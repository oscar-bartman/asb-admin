import { Event } from "../models/Event";
import { EventService } from "@grandvision/event-processor";

export const send = async (topic: string, events: Event[], eventService: EventService) => {
    for (let i = 0; i < events.length; i++) {
        await eventService.sendMessage(topic, JSON.stringify(events[i]));
    }
};
