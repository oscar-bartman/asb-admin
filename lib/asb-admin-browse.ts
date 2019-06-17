import * as program from "commander"
import { logger } from "./utils/logger"
import { SubscriptionClient, ServiceBusClient, ReceivedMessageInfo } from "@azure/service-bus";

program
    .parse(process.argv);

// if (!program.args[0] || !program.args[1]) {
//     logger.error("I need a topic and subscription name.");
//     process.exit(1);
// }

// logger.info(`using topic: ${program.args[0]} and subscription: ${program.args[1]}`);

const topicName = "azure-sample-topic";
const subscriptionName = "azure-sample-subscription";

// topic: string, subscription: string
const run = async () => {
    const connectionString = process.env["AZURE_SERVICEBUS_CONNECTION_STRING"] || "";

    const serviceBusClient = ServiceBusClient.createFromConnectionString(connectionString);
    const subscriptionClient: SubscriptionClient = serviceBusClient.createSubscriptionClient(topicName, subscriptionName);

    try {
        const peekResult: ReceivedMessageInfo[] = await subscriptionClient.peek();
        
        if (peekResult.length) {
            logger.info(`peeked result body: ${peekResult[0].body}`);
        }
        
        await subscriptionClient.close();
    } catch (err) {
        console.log(err);
    } finally {
        await serviceBusClient.close();
    }
}

// program.args[0], program.args[1]
run().catch(e => {
    logger.error(e);
    process.exit(1);
});
