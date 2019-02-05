import * as winston from "winston";

export const logger = winston.createLogger({
    level: "debug", transports: new winston.transports.Console()
});
