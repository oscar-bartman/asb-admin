import * as program from "commander";
import { logger } from "./utils/logger";
import { delay, ReceiveMode } from "@azure/service-bus";
import { makeSubscriptionClient } from "./asb/makeSubscriptionClient";

program.parse(process.argv);

if (!program.args[0] || !program.args[1]) {
    logger.error("I need a topic and subscription name.");
}

const runDrainDlq = async () => {
    const client = makeSubscriptionClient({
        topicName: program.args[0],
        subscriptionName: program.args[1]
    });
    const receiver = client.createReceiver(ReceiveMode.peekLock);

    const onMessageHandler = async (brokeredMessage: any) => {
        logger.info(
            `Received message: ${JSON.stringify(brokeredMessage.body)}`
        );
        await brokeredMessage.complete();
    };

    const onErrorHandler = (err: any) => {
        logger.error(err.message);
    };

    receiver.registerMessageHandler(onMessageHandler, onErrorHandler, {
        autoComplete: false
    });

    await delay(60000 * 10);

    await receiver.close();
    await client.close();
};

runDrainDlq().catch((e) => {
    logger.error(e);
});
