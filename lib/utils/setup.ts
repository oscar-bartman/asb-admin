import { ServiceBusService } from "azure-sb";
import * as azure from "azure-sb";
import { promisify } from "util";
import { BusConfig } from "../models/Event";
import { logger } from "./logger"

const _serviceBusService: ServiceBusService = azure.createServiceBusService();
const _createTopicIfNotExistsAsync: any = promisify(_serviceBusService.createTopicIfNotExists).bind(_serviceBusService);
const _createSubscriptionAsync: any = promisify(_serviceBusService.createSubscription).bind(_serviceBusService);

export const setupServiceBus = async (config: BusConfig[]) => {
    await Promise.all(config.map((busConfig: any) => {
        return _createTopicIfNotExistsAsync(busConfig.topic);
    }));
    logger.info(`created the following topics: ${config.map((busConfig: BusConfig) => busConfig.topic)}`);

    await Promise.all(config.map(async (busConfig: BusConfig) => {
        if (busConfig.subscription) {
            return _createSubscriptionAsync(busConfig.topic, busConfig.subscription);
        }
    }));
    if (config.some((busConfig: BusConfig) => busConfig.subscription !== undefined)) {
        logger.info(`created the following subscriptions: ${config.map((busConfig: BusConfig) => busConfig.subscription).filter((sub: any) => sub !== undefined)}`);
    }
};
