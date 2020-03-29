import * as _ from "lodash";
import { logger } from "./logger";
import { deleteTopicAsync } from "./serviceBusServiceAsync";

export async function tearDown(
    config: {
        topic: string;
        subscription?: string;
    }[]
) {
    const uniqTopics = _(config)
        .map((busConfig) => busConfig.topic)
        .uniq()
        .value();

    config.map((busConfig) => busConfig.topic);

    logger.info(`deleting the following topics: ${uniqTopics}`);
    await Promise.all(
        uniqTopics.map((uniqTopic: string) => deleteTopicAsync(uniqTopic))
    );
}
