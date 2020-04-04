import * as program from "commander";
import { logger } from "../utils";
import { serviceBusClient, delay, ReceiveMode } from "../asb";

program.parse(process.argv);

const [topic, subscription] = program.args;

if (!topic || !subscription) {
    logger.error("I need a topic and subscription name.");
}

(async () => {
    const client = serviceBusClient.createSubscriptionClient(
        topic,
        subscription
    );
    const receiver = client.createReceiver(ReceiveMode.peekLock);

    const onMessageHandler = async (brokeredMessage: any) => {
        logger.info(JSON.stringify(brokeredMessage.body));
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
})().catch((err) => logger.error(err.message));
