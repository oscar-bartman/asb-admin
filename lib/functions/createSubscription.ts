import { promisify } from "util";
import { serviceBusService } from "../asb";

export const createSubscription: (
    topicPath: string,
    subscriptionPath: string
) => Promise<{ SubscriptionName: string; TopicName: string }> = promisify(
    serviceBusService.createSubscription
).bind(serviceBusService);
