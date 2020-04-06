import * as fs from "fs";
import * as joi from "@hapi/joi";

const schema = joi.array().items(
    joi.object({
        topic: joi.string().required(),
        subscription: joi.string()
    })
);

export function getBusConfig({ file }: { file?: string }) {
    if (!file) {
        file = "bus-config.json";
    }
    file = fs.readFileSync(`${process.cwd()}/${file}`, "utf8");

    return joi.attempt(JSON.parse(file), schema);
}
