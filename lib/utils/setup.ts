import * as azure from "azure-sb";
import { promisify } from "util";
import { logger } from "./logger"

export async function setupServiceBus(config: {
    topic: string;
    subscription?: string;
}[]) {
    const _serviceBusService = azure.createServiceBusService();
    const _createTopicIfNotExistsAsync = promisify(_serviceBusService.createTopicIfNotExists).bind(_serviceBusService);
    const _createSubscriptionAsync = promisify(_serviceBusService.createSubscription).bind(_serviceBusService);

    await Promise.all(config.map((busConfig: any) => {
        return _createTopicIfNotExistsAsync(busConfig.topic);
    }));
    logger.info(`created the following topics: ${config.map(busConfig => busConfig.topic)}`);

    await Promise.all(config.map(async busConfig => {
        if (busConfig.subscription) {
            return _createSubscriptionAsync(busConfig.topic, busConfig.subscription);
        }
    }));
    if (config.some(busConfig => busConfig.subscription !== undefined)) {
        logger.info(
            `created the following subscriptions: ${config.map(busConfig => busConfig.subscription).filter((sub: any) => sub !== undefined)}`
        );
    }
};
