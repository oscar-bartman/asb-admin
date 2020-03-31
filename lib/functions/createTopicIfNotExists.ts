import { promisify } from "util";
import { serviceBusService } from "../asb";

export const createTopicIfNotExists = promisify(
    serviceBusService.createTopicIfNotExists
).bind(serviceBusService);
