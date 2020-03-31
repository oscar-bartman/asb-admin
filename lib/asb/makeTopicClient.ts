import { serviceBusClient } from "./serviceBusClient";

export function makeTopicClient({ topicName }: { topicName: string }) {
    return serviceBusClient.createTopicClient(topicName);
}
