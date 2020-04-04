import * as azure from "azure-sb";
import { promisify } from "util";

export const serviceBusService = azure.createServiceBusService();

// all the below methods should be removed
export const createTopicIfNotExistsAsync = promisify(
    serviceBusService.createTopicIfNotExists
).bind(serviceBusService);

export const createSubscriptionAsync = promisify(
    serviceBusService.createSubscription
).bind(serviceBusService);

export const deleteTopicAsync = promisify(serviceBusService.deleteTopic).bind(
    serviceBusService
);

export const listTopicsAsync = promisify(serviceBusService.listTopics).bind(
    serviceBusService
);

export const listSubscriptionsAsync = promisify(
    serviceBusService.listSubscriptions
).bind(serviceBusService);

export const deleteSubscriptionAsync = promisify(
    serviceBusService.deleteSubscription
).bind(serviceBusService);
