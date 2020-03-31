import { promisify } from "util";
import { serviceBusService } from "../asb";

export const listTopics = promisify(serviceBusService.listTopics).bind(
    serviceBusService
);
