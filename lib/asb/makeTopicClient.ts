import { serviceBusClient } from "./serviceBusClient";

// should be removed, export serviceBusClient directly
export function makeTopicClient({ topicName }: { topicName: string }) {
    return serviceBusClient.createTopicClient(topicName);
}
