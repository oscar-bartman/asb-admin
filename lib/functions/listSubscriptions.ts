import { promisify } from "util";
import { serviceBusService } from "../asb";

export const listSubscriptions = promisify(
    serviceBusService.listSubscriptions
).bind(serviceBusService);
