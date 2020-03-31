import * as program from "commander";
import { logger } from "./utils";
import { deleteSubscriptionAsync } from "./asb";

program.parse(process.argv);

if (!program.args[0] || !program.args[1]) {
    logger.error("I need a topic and subscription name.");
}

deleteSubscriptionAsync(program.args[0], program.args[1])
    .then(() => {
        logger.info(
            `deleted subscription '${program.args[1]}' from topic '${program.args[0]}'`
        );
    })
    .catch((err: any) => logger.error(err));
