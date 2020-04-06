import * as _ from "lodash";
import { deleteTopic } from ".";

export async function teardown(config: { topic: string }[]) {
    const uniqTopics = _(config)
        .map((busConfig) => busConfig.topic)
        .uniq()
        .value();

    await Promise.all(
        uniqTopics.map((uniqTopic: string) => deleteTopic(uniqTopic))
    );

    return uniqTopics;
}
