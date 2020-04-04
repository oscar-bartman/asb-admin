import { promisify } from "util";
import { serviceBusService } from "../asb";

export const createTopicIfNotExists: (
    topicPath: string
) => Promise<void> = promisify(serviceBusService.createTopicIfNotExists).bind(
    serviceBusService
);
