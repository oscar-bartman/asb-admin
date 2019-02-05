import * as program from "commander";
import { EventService, MessageProcessResult } from "@grandvision/event-processor";
import * as winston from "winston";
import { setupServiceBus } from "./utils/setup";
import { tearDownServiceBus } from "./utils/teardown";
import { Event } from "./models/Event";
import { table } from "table";
import { ServiceBusService } from "azure-sb";
import * as azure from "azure-sb";
import { send } from "./utils/sender";

const _serviceBusService: ServiceBusService = azure.createServiceBusService();

const logger = winston.createLogger({
    level: "info", transports: new winston.transports.Console()
});

let createTempTopicAndSub = false;

program
    .option("-c, --create", "create a temporary service bus config for this load test")
    .action(() => {
        createTempTopicAndSub = true;
    });

program
    .parse(process.argv);

let runTime = new Date().getTime();
// generate unique topics to prevent collisions
const topic = `test-load-topic${createTempTopicAndSub ? "-" + runTime : ""}`;
const subscription = `test-load-subscription`;
const config = [{
    topic,
    subscription
}];

const runLoad = async (load: number) => {
    // init event processor
    const eventServiceConfig = {
        serviceBusConnectionStr: process.env.AZURE_SERVICEBUS_CONNECTION_STRING || "",
        messagePollingIntervalMs: parseInt(process.env.MESSAGE_POLLING_INTERVAL_MS || "")
    };

    const eventService = new EventService(eventServiceConfig, logger);

    // create topic and subscriber if required
    if (createTempTopicAndSub) {
        await setupServiceBus(config);
    }

    // use a resolve to call on completion
    let handlePromiseResolve = () => {
    };
    const handleMessagePromise = new Promise<void>(resolve => {
        handlePromiseResolve = resolve;
    });

    const eventDatas = {};
    const checkStop = (event: Event) => {
        const { id } = event;
        logger.debug(`checkStop: id: ${id}`);
        eventDatas[`${id}`].complete = true;
        eventDatas[`${id}`].end = new Date().getTime();
        const allComplete = Object.keys(eventDatas).map(k => eventDatas[k]).every(event => event.complete);
        if (allComplete) {
            runTime = new Date().getTime() - runTime;
            handlePromiseResolve();
            console.log(table([
                ["Total runtime", runTime]
            ]));
        }
    };

    let processing = 0;
    const messageHandler = (type: string) => async (body: string) => {
        // create a delay to make cause overlapping proccesses
        processing++;
        logger.info(`now processing ${processing} events.`);
        await new Promise<void>(resolve => {
            setTimeout(() => {
                resolve();
            }, eventServiceConfig.messagePollingIntervalMs * 2 + 1000);
        });
        processing--;
        const event: Event = JSON.parse(body);
        checkStop(event);
        return MessageProcessResult.DELETE(`received message on ${type}: ${body}`);
    };

    await eventService.registerReceiver(topic, subscription, messageHandler("sub"));
    await eventService.registerReceiver(topic, `${subscription}/$DeadLetterQueue`, messageHandler("dlq"));

    // send events
    const events: Event[] = [];
    for (let i = 0; i < load; i++) {
        eventDatas[`${i}`] = {
            complete: false,
            start: new Date().getTime()
        };

        events.push({
            id: i,
            message: JSON.stringify({ foo: "bar" })
        });
    }
    await send(topic, events, eventService);

    // await until all the events are back
    await handleMessagePromise;

    // stop and teardown the servicebus test config
    await eventService.stop();

    if (createTempTopicAndSub) {
        await tearDownServiceBus(config, _serviceBusService);
    }

    logger.debug("tore down service bus config");
};

if (!program.args[0]) {
    console.log("I need a number of events.")
} else {
    const load: number = parseInt(program.args[0]) || 0;
    if (load === 0) {
        console.error("I need a valid parameter for load");
        process.exit(0);
    }
    console.log(`Running load test with load: ${load} on ${topic}`);
    runLoad(load).catch(e => {
        console.log(e);
    });
}
