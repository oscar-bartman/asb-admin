import * as program from "commander";
import * as fs from "fs";
import { listTopics } from "../functions";
import { tearDown } from "../functions/teardown";
import { logger } from "../utils";

program
    .option(
        "-p, --prefix <prefix>",
        "teardown all topics with a certain prefix"
    )
    .parse(process.argv);

(async () => {
    let config = [];

    if (program.prefix) {
        const topics = await listTopics();
        topics
            .filter((topic: any) => topic.TopicName.startsWith(program.prefix))
            .forEach((topic: any) => {
                config.push({ topic: topic.TopicName });
            });
    } else {
        let file;
        if (!program.args[0]) {
            file = `${process.cwd()}/bus-config.json`;
        } else {
            file = program.args[0];
        }
        file = fs.readFileSync(file, "utf8");
        config = JSON.parse(file);
    }

    await tearDown(config);
})()
    .then((topics) => {
        logger.info(`deleted the following topics: ${topics}`);
    })
    .catch((err) => {
        logger.error("could not delete topics", err);
    });
