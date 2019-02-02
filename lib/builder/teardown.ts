import * as _ from "lodash";
import { ServiceBusService } from "azure-sb";
import * as azure from "azure-sb";
import { promisify } from "util";
const _serviceBusService: ServiceBusService = azure.createServiceBusService();
const _deleteTopicAsync = promisify(_serviceBusService.deleteTopic).bind(_serviceBusService);
const _deleteSubscriptionAsync = promisify(_serviceBusService.deleteSubscription).bind(_serviceBusService);

// todo set up some logging
export const tearDownServiceBus = async (config: any[]) => {
    // todo type topicToSub and config object
    await Promise.all(config.map((topicToSub: any) => {
        return _deleteSubscriptionAsync(topicToSub.topic, topicToSub.subscription);
    }));

    const uniqTopics = _(config)
        .map(topicToSub => topicToSub.topic)
        .uniq()
        .value();

    await Promise.all(uniqTopics.map((uniqTopic: string) => {
        return _deleteTopicAsync(uniqTopic);
    }));
};
