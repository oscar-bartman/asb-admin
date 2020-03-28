import * as _ from "lodash";
// eslint-disable-next-line no-unused-vars
import { ServiceBusService } from "azure-sb";
import { promisify } from "util";
import { logger } from "./logger";

export async function tearDownServiceBus(config: {
    topic: string;
    subscription?: string;
}[], serviceBusService: ServiceBusService) {
    const deleteTopicAsync = promisify(serviceBusService.deleteTopic).bind(serviceBusService);
    const uniqTopics = _(config)
        .map(busConfig => busConfig.topic)
        .uniq()
        .value();

    logger.info(`deleting the following topics: ${uniqTopics}`);
    await Promise.all(uniqTopics.map((uniqTopic: string) => {
        return deleteTopicAsync(uniqTopic);
    }));
}
