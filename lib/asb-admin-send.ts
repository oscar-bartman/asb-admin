import * as program from "commander";
import * as fs from "fs";
import { logger } from "./utils/logger";
import { send } from "./utils";

program.parse(process.argv);

async function runSend({ topic, file }: { topic: string; file: string }) {
    let messageBody: any;
    if (file) {
        const payload: string = fs.readFileSync(file, { encoding: "utf8" });
        messageBody = JSON.parse(payload);
    }

    await send({ topicName: topic, payload: messageBody });
}

const [topic, file] = program.args;

if (!topic) {
    logger.error("I need a topic.");
}
if (!file) {
    logger.error("I need a file to read from.");
} else {
    runSend({ topic, file }).catch((err) => {
        logger.error(
            `[SEND]: Error occurred while trying to send a message to topic: ${topic}.`,
            err
        );
        process.exit(1);
    });
}
