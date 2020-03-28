import { makeTopicClient } from "./makeTopicClient";

export async function send({ connectionString, topicName, payload }: { connectionString: string; topicName: string, payload: object | object[] }) {
    const client = makeTopicClient({ connectionString, topicName })

    const sender = client.createSender();

    if (Array.isArray(payload)) {
        await sender.sendBatch(payload.map(e => ({ body: e })))
    } else {
        await sender.send({ body: payload });
    }

    await client.close();
}
