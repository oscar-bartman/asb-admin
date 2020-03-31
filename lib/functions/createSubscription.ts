import { promisify } from "util";
import { serviceBusService } from "../asb";

export const createSubscription = promisify(
    serviceBusService.createSubscription
).bind(serviceBusService);
