import * as program from "commander"
import * as fs from "fs";
import { promisify } from "util";
import { Azure, ServiceBusService } from "azure-sb";
import * as azure from "azure-sb";
import Topic = Azure.ServiceBus.Results.Models.Topic;
import { tearDownServiceBus } from "./utils/teardown";

const _serviceBusService: ServiceBusService = azure.createServiceBusService();
const _listTopicsAsync: any = promisify(_serviceBusService.listTopics).bind(_serviceBusService);

program
    .option("-p, --prefix <prefix>", "teardown all topics with a certain prefix")
    .parse(process.argv);

let file: string;

const runTearDown = async () => {
    // todo type config object
    let config = [];

    if (program.prefix) {
        console.log("found prefix");
        const topics: Topic[] = await _listTopicsAsync();
        topics
            .filter((topic: Topic) => topic.TopicName.startsWith(program.prefix))
            .forEach((topic: Topic) => {
                config.push({ topic: topic.TopicName });
            });
    } else {
        console.log("no prefix");
        if (!program.args[0]) {
            file = `${process.cwd()}/bus-config.json`
        } else {
            file = program.args[0];
        }
        file = fs.readFileSync(file, "utf8");
        config = JSON.parse(file);
    }

    console.log(config);
    await tearDownServiceBus(config, _serviceBusService);
};

runTearDown().then(() => {
    console.log("Successfully tore down service bus configuration.")
}).catch(e => {
    if (e.statusCode === 404) {
        console.log(e.detail);
    } else {
        console.error(e);
    }
});
