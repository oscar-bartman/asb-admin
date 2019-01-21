import * as program from "commander"
import * as azure from "azure-sb";
import {Azure, ServiceBusService} from "azure-sb";
import {table} from "table"
import Topic = Azure.ServiceBus.Results.Models.Topic;
import Subscription = Azure.ServiceBus.Results.Models.Subscription;
import * as fp from "lodash/fp";
import {promisify} from "util";

const serviceBusService: ServiceBusService = azure.createServiceBusService();
const listTopicsAsync: any = promisify(serviceBusService.listTopics).bind(serviceBusService);
const listSubscriptionsAsync: any = promisify(serviceBusService.listSubscriptions).bind(serviceBusService);

const toCommaSeparated = fp.reduce((acc: string, sub: Subscription) => `${sub.SubscriptionName}${acc? `, ${acc}`: ""}`, "");
const drawOptions = {
    drawHorizontalLine: (index: number, size: number) => {
        return index === 0 || index === 1 || index === size;
    }
};

program
    .parse(process.argv);

if (!program.args[0]) {
    console.log("argument [elem] required");
    process.exit(1);
}

const elem = program.args[0];

const listSubsAllTopics = async () => {
    let topics: Topic[];
    try {
        topics = await listTopicsAsync();
    } catch (e) {
        throw e;
    }

    const topicNames: string[] = [];
    topics.forEach((topic: Topic) => {
        topicNames.push(topic.TopicName);
    });

    const subLists = await Promise.all(topicNames.map((topicName: string) => {
        try {
            return listSubscriptionsAsync(topicName);
        } catch (e) {
            throw e;
        }
    }));

    const subNamesStrings: string[] = fp.flatMap((subList: Subscription[]) => {
        return toCommaSeparated(subList);
    })(subLists);

    let data = topicNames.map((name: string, index: number) => [name, subNamesStrings[index]]);

    data = [
        ["Topic", "Subscriptions"],
        ...data
    ];

    console.log(table(data, drawOptions));
};

const listSubsTopic = async (topic: string) => {
    let subList;
    try {
        subList = await listSubscriptionsAsync(topic);
    } catch (e) {
        throw e;
    }

    const data = [
        ["Topic", "Subscriptions"],
        [topic, toCommaSeparated(subList)]
    ];

    console.log(table(data, drawOptions));
};

if (elem === "s" || elem === "subs" || elem === "subscriptions") {
    if (!program.args[1]) {
        listSubsAllTopics()
            .catch(e => {
                console.log(e);
            });
    } else {
        const topic = program.args[1];
        listSubsTopic(topic)
            .catch(e => {
                console.log(e);
            });
    }
}

