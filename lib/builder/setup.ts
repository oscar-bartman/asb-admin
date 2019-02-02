import { ServiceBusService } from "azure-sb";
import * as azure from "azure-sb";
import { promisify } from "util";

const _serviceBusService: ServiceBusService = azure.createServiceBusService();
const _createTopicIfNotExistsAsync: any = promisify(_serviceBusService.createTopicIfNotExists).bind(_serviceBusService);
const _createSubscriptionAsync: any = promisify(_serviceBusService.createSubscription).bind(_serviceBusService);

// todo set up some logging
export const setupServiceBus = async (config: object[]) => {
    // todo type topicToSub and config object
    await Promise.all(config.map((topicToSub: any) => {
        return _createTopicIfNotExistsAsync(topicToSub.topic);
    }));

    await Promise.all(config.map(async (topicToSub: any) => {
        await _createSubscriptionAsync(topicToSub.topic, topicToSub.subscription);
    }));
};
