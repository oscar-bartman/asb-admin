import { tearDown } from "../../lib/functions/teardown";
import { deleteTopic } from "../functions";

jest.mock("../functions", () => ({
    deleteTopic: jest.fn()
}));
jest.mock("../utils/logger");

describe("teardown", () => {
    tearDown([
        { topic: "testTopic1" },
        { topic: "testTopic2" },
        { topic: "testTopic2" }
    ]);

    it("returns", () => {});

    it("tries to delete topics", () => {
        expect(deleteTopic).toBeCalled();
    });

    it("tries to delete the topics in the config passed", () => {
        expect(deleteTopic).toBeCalledTimes(2);
        expect(deleteTopic).toBeCalledWith("testTopic1");
        expect(deleteTopic).toBeCalledWith("testTopic2");
    });

    it("will only try to delete a duplicate topic in the config once", () => {
        expect(deleteTopic).toBeCalledTimes(2);
        expect(deleteTopic).toBeCalledWith("testTopic1");
        expect(deleteTopic).toBeCalledWith("testTopic2");
    });

    it("returns a list with topic names it has deleted", async () => {
        const list = await tearDown([{ topic: "testTopic" }]);
        expect(list).toEqual(["testTopic"]);
    });
});
