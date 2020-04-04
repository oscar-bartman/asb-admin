import * as _ from "lodash";
import { deleteTopicAsync } from "../asb";

// should only take a list of topics stricly speaking
export async function tearDown(
    config: {
        topic: string;
    }[]
) {
    const uniqTopics = _(config)
        .map((busConfig) => busConfig.topic)
        .uniq()
        .value();

    await Promise.all(
        uniqTopics.map((uniqTopic: string) => deleteTopicAsync(uniqTopic))
    );

    return uniqTopics;
}
