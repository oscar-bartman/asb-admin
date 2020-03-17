import { ServiceBusClient } from "@azure/service-bus";

export async function send({ connectionString, topicName, payload }: { connectionString: string; topicName: string, payload: string }) {
    const client = makeTopicClient({ connectionString, topicName })

    const sender = client.createSender();

    await sender.send({ body: payload });

    await client.close();
}

export async function sendBatch({ connectionString, topicName, payload }: { connectionString: string; topicName: string, payload: string[] }) {
    const client = makeTopicClient({ connectionString, topicName })

    const sender = client.createSender();

    await sender.sendBatch(payload.map(e => ({ body: e })))

    await client.close();
}

function makeTopicClient({ connectionString, topicName }: { connectionString: string; topicName: string }) {
    return ServiceBusClient
        .createFromConnectionString(connectionString)
        .createTopicClient(topicName)
}