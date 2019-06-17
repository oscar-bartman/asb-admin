import { ServiceBusService } from "azure-sb";
import * as azure from "azure-sb";
import { promisify } from "util";
import { BusConfig } from "../models/Event";
import { logger } from "./logger"

let _serviceBusService: ServiceBusService;
let _createTopicIfNotExistsAsync: any;
let _createSubscriptionAsync: any;

export const setupServiceBus = async (config: BusConfig[]) => {
    _serviceBusService = azure.createServiceBusService();
    _createTopicIfNotExistsAsync = promisify(_serviceBusService.createTopicIfNotExists).bind(_serviceBusService);
    _createSubscriptionAsync = promisify(_serviceBusService.createSubscription).bind(_serviceBusService);

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
