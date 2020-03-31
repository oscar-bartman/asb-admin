import * as program from "commander";
import { logger } from "../utils";
import { createSubscription } from "../functions";

program.parse(process.argv);

const [topic, subscription] = program.args;

if (!topic || !subscription) {
    logger.error("I need a topic and subscription name.");
}

createSubscription(topic, subscription)
    .then(() => {
        logger.info(
            `added subscription '${program.args[1]}' on topic '${program.args[0]}'`
        );
    })
    .catch((err: any) => {
        logger.error("adding subscription failed", err);
    });
