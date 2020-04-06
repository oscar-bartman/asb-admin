import * as program from "commander";
import { logger } from "../utils";
import { setup } from "../functions";
import { getBusConfig } from "./utils";

program.parse(process.argv);

let [file] = program.args;

const config = getBusConfig({ file });

setup(config)
    .then(() => {
        logger.info("config was created");
    })
    .catch((err) => {
        logger.error("could not setup config", err);
    });
