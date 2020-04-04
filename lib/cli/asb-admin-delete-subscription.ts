import * as program from "commander";
import { logger } from "../utils";
import { deleteSubscription } from "../functions";

program.parse(process.argv);

const [topic, subscription] = program.args;

if (!topic || !subscription) {
    logger.error("I need a topic and subscription name.");
}

deleteSubscription(topic, subscription).catch((err) =>
    logger.error(err.message)
);
