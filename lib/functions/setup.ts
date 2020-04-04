import { createTopicIfNotExists } from ".";
import { createSubscription } from ".";

export async function setup(
    config: {
        topic: string;
        subscription?: string;
    }[]
) {
    await Promise.all(
        config.map((busConfig: any) => createTopicIfNotExists(busConfig.topic))
    );

    await Promise.all(
        config.map((busConfig) =>
            busConfig.subscription
                ? createSubscription(busConfig.topic, busConfig.subscription)
                : null
        )
    );
}
