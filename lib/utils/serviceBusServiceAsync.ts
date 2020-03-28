import * as azure from "azure-sb";
import { promisify } from "util";

const serviceBusService = azure.createServiceBusService();

export const createTopicIfNotExistsAsync = promisify(serviceBusService.createTopicIfNotExists).bind(serviceBusService);
export const createSubscriptionAsync = promisify(serviceBusService.createSubscription).bind(serviceBusService);