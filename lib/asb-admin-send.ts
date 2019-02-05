import * as program from "commander";
import { EventService } from "@grandvision/event-processor";
import { send } from "./utils/sender"
import { Event } from "./models/Event";
import { logger } from "./utils/logger";

// todo enable to pass explicit event to send on CLI (requires validating the event with existing models, should check if this is a desired feature first).
program
    .parse(process.argv);

const runSend = async (topic: string, load: number) => {
    const eventService = new EventService({
        serviceBusConnectionStr: process.env.AZURE_SERVICEBUS_CONNECTION_STRING || "",
        messagePollingIntervalMs: parseInt(process.env.MESSAGE_POLLING_INTERVAL_MS || "")
    }, logger);

    let events: Event[] = [];
    for (let i = 0; i < load; i++) {
        events.push({
            id: i,
            message: JSON.stringify({ foo: "bar" })
        });
    }

    await send(topic, events, eventService);
};

const topic: string = program.args[0];
const load: number = parseInt(program.args[1]);

if (!topic || !load) {
    console.log("I need a topic and load.")
} else {
    runSend(topic, load).catch(e => {
        console.log(e);
    });
}
