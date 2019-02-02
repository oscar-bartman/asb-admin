import * as program from "commander";
import { setupServiceBus } from "./builder/setup";
import * as fs from "fs";

program
    .parse(process.argv);

let file: string;
if (!program.args[0]) {
    file = `${process.cwd()}/bus-config.json`
} else {
    file = program.args[0];
}
file = fs.readFileSync(file, "utf8");
const config: object[] = JSON.parse(file);

setupServiceBus(config).then(() => {
    console.log("Successfully built service bus configuration");
}).catch(e => {
    if (e.statusCode === 409) {
        console.log(e.detail);
    } else {
        console.log(e);
    }
});
