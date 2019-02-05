import * as _ from "lodash";
import { ServiceBusService } from "azure-sb";
import { promisify } from "util";
import { logger } from "./logger";
import { BusConfig } from "../models/Event";

// todo move to utils?
export const tearDownServiceBus = async (config: BusConfig[], serviceBusService: ServiceBusService) => {
    const deleteTopicAsync = promisify(serviceBusService.deleteTopic).bind(serviceBusService);
    // todo type topicToSub and config object
    const uniqTopics = _(config)
        .map(busConfig => busConfig.topic)
        .uniq()
        .value();

    logger.info(`deleting the following topics: ${uniqTopics}`);
    await Promise.all(uniqTopics.map((uniqTopic: string) => {
        return deleteTopicAsync(uniqTopic);
    }));
};
