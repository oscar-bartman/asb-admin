import * as program from "commander"
import { logger } from "./utils/logger"
import * as azure from "azure-sb"
import { Azure, ServiceBusService } from "azure-sb"
import ReceiveSubscriptionMessageOptions = Azure.ServiceBus.ReceiveSubscriptionMessageOptions;
import Message = Azure.ServiceBus.Message;
import TypedResultAndResponseCallback = Azure.ServiceBus.TypedResultAndResponseCallback;

const _serviceBusService: ServiceBusService = azure.createServiceBusService();

program
    .parse(process.argv);

if (!program.args[0] || !program.args[1]) {
    logger.error("I need a topic and subscription name.");
}

const runDrainDlq = async () => {
    const topicPath: string = program.args[0];
    const subscriptionPath: string = `${program.args[1]}/$DeadLetterQueue`;
    // set isPeekLock to false because we just want to delete everything out of this queue
    const options: ReceiveSubscriptionMessageOptions = {
        isPeekLock: false
    };

    interface Summary {
        messageId: string;
        body: string;
    }

    const messageSummaries: Summary[] = [];

    let receiving: boolean = true;

    const callback: TypedResultAndResponseCallback<Message> = async (error: any, message: any) => {
        if (error && error === "No messages to receive") {
            receiving = false;
        } else if (error) {
            logger.error("An error occurred while receiving a message.");
            process.exit(1);
        }

        logger.debug(message.brokerProperties.MessageId);

        messageSummaries.push({
            messageId: message.brokerProperties.MessageId,
            body: message.body
        });
    };

    while (receiving) {
        _serviceBusService.receiveSubscriptionMessage(topicPath, subscriptionPath, options, callback)
    }
};

runDrainDlq().catch(e => {
    logger.error(e);
});
