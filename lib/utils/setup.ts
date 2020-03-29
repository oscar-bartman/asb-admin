import { logger } from "./logger";
import {
    createTopicIfNotExistsAsync,
    createSubscriptionAsync
} from "./serviceBusServiceAsync";

export async function setup(
    config: {
        topic: string;
        subscription?: string;
    }[]
) {
    await Promise.all(
        config.map((busConfig: any) =>
            createTopicIfNotExistsAsync(busConfig.topic)
        )
    );
    logger.info(
        `created the following topics: ${config.map(
            (busConfig) => busConfig.topic
        )}`
    );

    await Promise.all(
        config.map(async (busConfig) => {
            if (busConfig.subscription) {
                return createSubscriptionAsync(
                    busConfig.topic,
                    busConfig.subscription
                );
            }
        })
    );
    if (config.some((busConfig) => busConfig.subscription !== undefined)) {
        logger.info(
            `created the following subscriptions: ${config
                .map((busConfig) => busConfig.subscription)
                .filter((sub: any) => sub !== undefined)}`
        );
    }
}
