import * as program from "commander"
import * as fs from "fs";
import { promisify } from "util";
import { Azure, ServiceBusService } from "azure-sb";
import * as azure from "azure-sb";
import { tearDownServiceBus } from "./utils";
import { logger } from "./utils";

let _serviceBusService: ServiceBusService;
let _listTopicsAsync: any;

program
    .option("-p, --prefix <prefix>", "teardown all topics with a certain prefix")
    .parse(process.argv);

let file: string;

type Topic = Azure.ServiceBus.Results.Models.Topic;

const runTearDown = async () => {
    _serviceBusService = azure.createServiceBusService();
    _listTopicsAsync = promisify(_serviceBusService.listTopics).bind(_serviceBusService);

    // todo type config object
    let config = [];

    if (program.prefix) {
        logger.info("found prefix");
        const topics: Topic[] = await _listTopicsAsync();
        topics
            .filter((topic: Topic) => topic.TopicName.startsWith(program.prefix))
            .forEach((topic: Topic) => {
                config.push({ topic: topic.TopicName });
            });
    } else {
        logger.info("no prefix");
        if (!program.args[0]) {
            file = `${process.cwd()}/bus-config.json`
        } else {
            file = program.args[0];
        }
        file = fs.readFileSync(file, "utf8");
        config = JSON.parse(file);
    }

    await tearDownServiceBus(config, _serviceBusService);
};

runTearDown().then(() => {
    logger.info("Successfully tore down service bus configuration.")
}).catch(e => {
    if (e.statusCode === 404) {
        logger.error(e.detail);
    } else {
        logger.error(e);
    }
});
