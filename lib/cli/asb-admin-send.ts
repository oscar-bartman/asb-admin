import * as program from "commander";
import * as fs from "fs";
import { send } from "../functions";
import { logger } from "../utils";

program.parse(process.argv);

const [topic, file] = program.args;

if (!topic || !file) {
    logger.error("I need a topic and a file.");
    // need to configure proper asb cleanup on exit node
    process.exit();
}

const payload: string = fs.readFileSync(file, { encoding: "utf8" });
const messageBody = JSON.parse(payload);

send({ topicName: topic, payload: messageBody }).catch((err) => {
    logger.error(err.message);
    process.exit(1);
});
