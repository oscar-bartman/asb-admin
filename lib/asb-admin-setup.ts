import * as program from "commander";
import { setupServiceBus } from "./utils/setup";
import * as fs from "fs";
import { logger } from "./utils/logger";

program
    .parse(process.argv);

let file: string;
if (!program.args[0]) {
    file = `${process.cwd()}/bus-config.json`
} else {
    file = program.args[0];
}
file = fs.readFileSync(file, "utf8");
const config = JSON.parse(file);

setupServiceBus(config).then(() => {
    logger.info("Successfully built service bus configuration");
}).catch(e => {
    // 409 means this already exists
    if (e.statusCode === 409) {
        logger.info(e.detail);
    } else {
        logger.error(e);
    }
});
