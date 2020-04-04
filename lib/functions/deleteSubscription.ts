import { promisify } from "util";
import { serviceBusService } from "../asb";

export const deleteSubscription: (
    topicPath: string,
    subscriptionPath: string
) => Promise<void> = promisify(serviceBusService.deleteSubscription).bind(
    serviceBusService
);
