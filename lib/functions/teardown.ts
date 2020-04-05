import * as _ from "lodash";
import { deleteTopic } from ".";

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
        uniqTopics.map((uniqTopic: string) => deleteTopic(uniqTopic))
    );

    return uniqTopics;
}
