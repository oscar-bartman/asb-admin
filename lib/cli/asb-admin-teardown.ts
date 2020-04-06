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

async function runTeardown() {
    let config = [];

    if (prefix) {
        logger.info("found prefix, tearing down topics with prefix");

        const topics = await listTopics();

        config = getPrefixedTopicsConfig({ topics, prefix });
    } else {
        config = getBusConfig({ file });
    }
    const topics = await teardown(config);
    logger.info(`deleted the following topics: ${topics}`);
}

(async () => {
    try {
        await runTeardown();
        process.exit();
    } catch (err) {
        logger.error(err.message);
        process.exit(1);
    }
})();
