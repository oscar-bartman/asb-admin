import * as program from "commander";
import { teardown, listTopics } from "../functions";
import { logger } from "../utils";
import { getBusConfig, getPrefixedTopicsConfig } from "./utils";

program
    .option(
        "-p, --prefix <prefix>",
        "Teardown all topics in a bus config file. Will use prefix instead if specified. Will look for bus-config.json in current directory if nothing specified"
    )
    .parse(process.argv);

let [file] = program.args;
const prefix = program.prefix;
let config = [];

if (prefix) {
    logger.info("found prefix, tearing down topics with prefix");
    listTopics()
        .then((topics: { TopicName: string }[]) => {
            config = getPrefixedTopicsConfig({ topics, prefix });
        })
        .catch((err: Error) => {
            logger.error("could not get a list of topics", err);
        });
} else {
    config = getBusConfig({ file });
}

teardown(config)
    .then((topics) => {
        logger.info(`deleted the following topics: ${topics}`);
    })
    .catch((err) => {
        logger.error("could not delete topics", err);
    });
