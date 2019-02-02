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

    const eventData = [];

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

    // use counter to check if we've achieved load yet
    let count = 0;
    const checkStop = () => {
        count++;
        if (count >= load) {
            handlePromiseResolve();
        }
    };

    // normal subscription handler
    const handleTopicMessage = async (body: string) => {
        checkStop();
        logger.info(`received message on sub: ${body}`);
        return MessageProcessResult.DELETE(`received message: ${body}, count: ${count}`);
    };

    // DLQ handler
    const handleDLQMessage = async (body: string) => {
        checkStop();
        logger.info(`received message on dlq: ${body}, count: ${count}`);
        return MessageProcessResult.DELETE(`received message: ${body}`);
    };

    await eventService.registerReceiver("load-test-topic", subscription, handleTopicMessage);
    await eventService.registerReceiver("load-test-topic", `${subscription}/$DeadLetterQueue`, handleDLQMessage);

    // send events
    const sendPromises = [];
    for (let i = 0; i < load; i++) {
        sendPromises.push(eventService.sendMessage(topic, JSON.stringify({ id: i, message: { foo: "bar" } })));
    }
    await Promise.all(sendPromises);

    let handlePromiseResolve = () => {
    };
    const handleMessagePromise = new Promise<void>(resolve => {
        handlePromiseResolve = resolve;
    });
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
