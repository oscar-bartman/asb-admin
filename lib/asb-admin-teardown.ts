import * as program from "commander"
import * as fs from "fs";
import { tearDownServiceBus } from "./builder/teardown";

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

tearDownServiceBus(config).then(() => {
    console.log("Successfully tore down service bus configuration.")
}).catch(e => {
    if (e.statusCode === 404) {
        console.log(e.detail);
    }
});
