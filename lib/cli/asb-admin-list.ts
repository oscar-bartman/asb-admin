import * as program from "commander";
import { listTopics, listSubscriptions } from "../functions";
import * as fp from "lodash/fp";
import { toCommaSeparated, itable as table } from "./draw";
import { logger } from "../utils";

program.parse(process.argv);

const [topic] = program.args;

if (topic) listSubsTopic(topic).catch((err) => logger.error(err.message));
else listSubsAllTopics().catch((err) => logger.error(err.message));

async function listSubsAllTopics() {
    type Topic = { TopicName: string };
    let topics: Topic[];
    topics = await listTopics();

    const topicNames: string[] = [];
    topics.forEach((topic: Topic) => topicNames.push(topic.TopicName));

    const subLists = await Promise.all(
        topicNames.map((topicName: string) => listSubscriptions(topicName))
    );

    type Subscription = { SubscriptionName: string };

    const subNamesStrings = fp.flatMap((subList: Subscription[]) =>
        toCommaSeparated(subList)
    )(subLists);

    let data = topicNames.map((name: string, index: number) => [
        name,
        subNamesStrings[index]
    ]);

    data = [["Topic", "Subscriptions"], ...data];

    table(data);
}

async function listSubsTopic(topic: string) {
    const subList = await listSubscriptions(topic);

    const data = [
        ["Topic", "Subscriptions"],
        [topic, toCommaSeparated(subList)]
    ];

    table(data);
}
