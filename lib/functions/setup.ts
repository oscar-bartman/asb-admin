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
        config.map(async (busConfig) => {
            if (busConfig.subscription) {
                return createSubscription(
                    busConfig.topic,
                    busConfig.subscription
                );
            }
        })
    );
}
