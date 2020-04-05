import { serviceBusClient } from "../asb";

export async function send({
    topicName,
    payload
}: {
    topicName: string;
    payload: object | object[];
}) {
    const client = serviceBusClient.createTopicClient(topicName);

    const sender = client.createSender();

    if (Array.isArray(payload)) {
        await sender.sendBatch(payload.map((e) => ({ body: e })));
    } else {
        await sender.send({ body: payload });
    }

    await client.close();
}
