import * as program from "commander";
import { logger } from "./utils/logger";
import { createSubscriptionAsync } from "./asb/serviceBusServiceAsync";

program.parse(process.argv);

if (!program.args[0] || !program.args[1]) {
    logger.error("I need a topic and subscription name.");
}

createSubscriptionAsync(program.args[0], program.args[1])
    .then(() => {
        logger.info(
            `added subscription '${program.args[1]}' on topic '${program.args[0]}'`
        );
    })
    .catch((err: any) => logger.error(err));
