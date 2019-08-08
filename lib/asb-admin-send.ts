import * as program from "commander";
import { ServiceBusClient, SendableMessageInfo } from "@azure/service-bus";
import * as fs from "fs";
import { logger } from "./utils/logger";

program
    .option('-b, --batch', 'treat input as batch')
    .parse(process.argv);

const connectionString = process.env["AZURE_SERVICEBUS_CONNECTION_STRING"] || "";
let _serviceBusClient: ServiceBusClient;

const composeMessage = (messageBody: string): SendableMessageInfo => ({ body: messageBody });

const runSend = async (topic: string, file: string) => {

    let messageBody: any;

    // TODO clean this up, messageBody isn't necessary but I want the option to send 
    // either a string or an object so we can see how azure handles handles either one.
    if (file) {
        const payload: string = fs.readFileSync(file, { encoding: "utf8" });
        let parsed: any;
        try {
            parsed = JSON.parse(payload);
        } catch (err) {
            logger.error(`[SEND]: Could not parse given file, invalid JSON.`)
            process.exit(1);
        }
        messageBody = parsed;
    }

    _serviceBusClient = ServiceBusClient.createFromConnectionString(connectionString);

    const topicClient = _serviceBusClient.createTopicClient(topic);
    const sender = topicClient.createSender();

    if (program.batch && Array.isArray(messageBody)) {
        await Promise.all(messageBody.map(message => sender.send(composeMessage(message))));
    } else {
        await sender.send(composeMessage(messageBody))
    }

    await _serviceBusClient.close();
};

const [
    topic,
    file
] = program.args;

if (!topic) {
    console.log("[SEND]: I need a topic and a file to read from.")
} else {
    runSend(topic, file).catch(err => {
        logger.error(`[SEND]: Error occurred while trying to send a message to topic: ${topic}.`, err);
        process.exit(1);
    });
}
