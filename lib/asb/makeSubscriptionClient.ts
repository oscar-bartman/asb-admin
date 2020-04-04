import { serviceBusClient } from "./serviceBusClient";

// should be removed, export serviceBusClient directly
export function makeSubscriptionClient({
    topicName,
    subscriptionName
}: {
    topicName: string;
    subscriptionName: string;
}) {
    return serviceBusClient.createSubscriptionClient(
        topicName,
        subscriptionName
    );
}
