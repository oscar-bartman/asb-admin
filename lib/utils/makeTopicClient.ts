import { ServiceBusClient } from "@azure/service-bus";

export function makeTopicClient({ connectionString, topicName }: { connectionString: string; topicName: string }) {
    return ServiceBusClient
        .createFromConnectionString(connectionString)
        .createTopicClient(topicName)
}