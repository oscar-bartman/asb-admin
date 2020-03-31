import { serviceBusClient } from "./serviceBusClient";

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
