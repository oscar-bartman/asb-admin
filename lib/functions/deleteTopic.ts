import { serviceBusService } from "../asb";
import { promisify } from "util";

export const deleteTopic = promisify(serviceBusService.deleteTopic).bind(
    serviceBusService
);
