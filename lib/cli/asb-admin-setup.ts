import * as program from "commander";
import { logger } from "../utils";
import { setup } from "../functions";
import * as fs from "fs";

program.parse(process.argv);

let [file] = program.args;

if (!file) {
    file = `${process.cwd()}/bus-config.json`;
}

file = fs.readFileSync(file, "utf8");
const config = JSON.parse(file);

setup(config)
    .then(() => {
        logger.info("config was created");
    })
    .catch((err) => {
        logger.error("could not setup config", err);
    });
