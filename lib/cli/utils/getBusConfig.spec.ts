import { getBusConfig } from "./getBusConfig";
jest.mock("fs", () => ({
    readFileSync: jest.fn()
}));
import * as fs from "fs";

describe("getBusConfig", () => {
    beforeEach(() => {
        (fs.readFileSync as jest.Mock).mockReset();
    });

    it("gets bus-config.json file if no file is passed", () => {
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([]));
        getBusConfig({});
        expect(fs.readFileSync).toBeCalledWith(
            `${process.cwd()}/bus-config.json`,
            "utf8"
        );
    });

    it("gets config from a file if a file is passed", () => {
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([]));

        const file = "file";
        getBusConfig({ file });
        expect(fs.readFileSync).toBeCalledWith(
            `${process.cwd()}/${file}`,
            "utf8"
        );
    });

    it("returns a config from a file", () => {
        const config = [
            { topic: "topic", subscription: "subscription1" },
            { topic: "topic", subscription: "subscription2" }
        ];

        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(config));

        const result = getBusConfig({});

        expect(result).toEqual(config);
    });

    it("throws if the config from the file has unknown property", () => {
        const config = [{ topic: "topic", nonsense: "subscription1" }];

        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(config));

        expect(() => getBusConfig({})).toThrow();
    });

    it("throws if the config from the file is missing a topic", () => {
        const config = [{ subscription: "subscription1" }];

        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(config));

        expect(() => getBusConfig({})).toThrow();
    });
});
