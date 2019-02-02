import * as program from "commander"
import * as azure from "azure-sb";
import {Azure, ServiceBusService} from "azure-sb";
import {table} from "table"
import Topic = Azure.ServiceBus.Results.Models.Topic;
import Subscription = Azure.ServiceBus.Results.Models.Subscription;
import * as fp from "lodash/fp";
import {promisify} from "util";

const _serviceBusService: ServiceBusService = azure.createServiceBusService();
const _listTopicsAsync: any = promisify(_serviceBusService.listTopics).bind(_serviceBusService);
const _listSubscriptionsAsync: any = promisify(_serviceBusService.listSubscriptions).bind(_serviceBusService);

const _toCommaSeparated = fp.reduce((acc: string, sub: Subscription) => `${sub.SubscriptionName}${acc ? `, ${acc}` : ""}`, "");
const _drawOptions = {
    drawHorizontalLine: (index: number, size: number) => {
        return index === 0 || index === 1 || index === size;
    }
};

program
    .parse(process.argv);

const listSubsAllTopics = async () => {
    let topics: Topic[];
    try {
        topics = await _listTopicsAsync();
    } catch (e) {
        throw e;
    }

    const topicNames: string[] = [];
    topics.forEach((topic: Topic) => {
        topicNames.push(topic.TopicName);
    });

    const subLists = await Promise.all(topicNames.map((topicName: string) => {
        try {
            return _listSubscriptionsAsync(topicName);
        } catch (e) {
            throw e;
        }
    }));

    const subNamesStrings: string[] = fp.flatMap((subList: Subscription[]) => {
        return _toCommaSeparated(subList);
    })(subLists);

    let data = topicNames.map((name: string, index: number) => [name, subNamesStrings[index]]);

    data = [
        ["Topic", "Subscriptions"],
        ...data
    ];

    console.log(table(data, _drawOptions));
};

const listSubsTopic = async (topic: string) => {
    let subList;
    try {
        subList = await _listSubscriptionsAsync(topic);
    } catch (e) {
        throw e;
    }

    const data = [
        ["Topic", "Subscriptions"],
        [topic, _toCommaSeparated(subList)]
    ];

    console.log(table(data, _drawOptions));
};


if (!program.args[0]) {
    listSubsAllTopics()
        .catch(e => {
            console.log(e);
        });
} else {
    const topic = program.args[0];
    listSubsTopic(topic)
        .catch(e => {
            console.log(e);
        });
}

