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
    const options: ReceiveSubscriptionMessageOptions = {
        isPeekLock: true
    };

    interface Summary {
        messageId: string;
        info: string;
    }

    const messageSummaries: Summary[] = [];

    const callback: TypedResultAndResponseCallback<Message> = async (error: any, message: any) => {
        if (error) {
            logger.error("An error occurred while receiving a message.");
            process.exit(1);
        }

        logger.debug(message.brokerProperties.MessageId);

        messageSummaries.push({
            messageId: message.brokerProperties.MessageId,
            info: message.customProperties.deadletterreason
        });

        _serviceBusService.unlockMessage(message, (error1: any) => {
            if (error1) {
                logger.error("An error occurred while trying to unlock a message");
                process.exit(1);
            }
        });
    };

    _serviceBusService.receiveSubscriptionMessage(topicPath, subscriptionPath, options, callback)
};

runDrainDlq().catch(e => {
    logger.error(e);
});
