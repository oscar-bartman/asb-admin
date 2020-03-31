import { makeTopicClient } from "../asb";

export async function send({
    topicName,
    payload
}: {
    topicName: string;
    payload: object | object[];
}) {
    const client = makeTopicClient({ topicName });

    const sender = client.createSender();

    if (Array.isArray(payload)) {
        await sender.sendBatch(payload.map((e) => ({ body: e })));
    } else {
        await sender.send({ body: payload });
    }

    await client.close();
}
