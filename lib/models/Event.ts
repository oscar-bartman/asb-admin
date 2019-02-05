export class Event {
    id: number;
    message: any;
}

export class BusConfig {
    topic: string;
    subscription?: string;
}

