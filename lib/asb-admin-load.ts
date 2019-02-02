import * as program from "commander";
import { EventService, MessageProcessResult } from "@grandvision/event-processor";
import * as winston from "winston";
import { setupServiceBus } from "./builder/setup";
import { tearDownServiceBus } from "./builder/teardown";

const logger = winston.createLogger({
    level: "info", transports: new winston.transports.Console()
});

program
    .parse(process.argv);

const runLoad = async (load: number) => {
    // init event processor
    const eventService = new EventService({
        serviceBusConnectionStr: process.env.AZURE_SERVICEBUS_CONNECTION_STRING || "",
        messagePollingIntervalMs: parseInt(process.env.MESSAGE_POLLING_INTERVAL_MS || "")
    }, logger);

    // create topic and subscriber
    const topic = "load-test-topic";
    const subscription = "load-test-subscription";
    const config = [{
        topic,
        subscription
    }];
    await setupServiceBus(config);

    // give azure some time to set up the bus
    logger.info("Giving azure some time to setup topic and subscriptions");
    await new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, 3000);
    });

    // use a resolve to call on completion
    let handlePromiseResolve = () => {
    };
    const handleMessagePromise = new Promise<void>(resolve => {
        handlePromiseResolve = resolve;
    });

    // todo create an outfile and spawn watcher process
    const eventData = {};
    // todo type body
    const checkStop = (event: any) => {
        const { id } = event;
        eventData[`${id}`].complete = true;
        eventData[`${id}`].end = new Date().getTime();
        if (Object.keys(eventData).map(k => eventData[k]).every(event => event.complete)) {
            handlePromiseResolve();
        }

        // todo update the outfile file
    };

    const messageHandler = (type: string) => async (body: string) => {
        const event = JSON.parse(body);
        checkStop(event);
        return MessageProcessResult.DELETE(`received message on ${type}: ${body}`);
    };

    await eventService.registerReceiver("load-test-topic", subscription, messageHandler("sub"));
    await eventService.registerReceiver("load-test-topic", `${subscription}/$DeadLetterQueue`, messageHandler("dlq"));

    // send events
    const sendPromises = [];
    for (let i = 0; i < load; i++) {
        eventData[`${i}`] = {
            complete: false,
            start: new Date().getTime()
        };
        sendPromises.push(eventService.sendMessage(topic, JSON.stringify({ id: i, message: { foo: "bar" } })));
        // todo update file async or after all is sent
    }
    await Promise.all(sendPromises);

    // await until all the events are back
    await handleMessagePromise;

    // stop and teardown the servicebus test config
    await eventService.stop();
    await tearDownServiceBus(config);

    // todo compile report
};

if (!program.args[0]) {
    console.log("I need a number of events.")
} else {
    const load = parseInt(program.args[0]);
    runLoad(load).catch(e => {
        console.log(e);
    });
}
