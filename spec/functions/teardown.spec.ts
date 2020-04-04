import { tearDown } from "../../lib/functions/teardown";
import { deleteTopicAsync } from "../../lib/asb";

jest.mock("../../lib/asb", () => ({
    deleteTopicAsync: jest.fn()
}));
jest.mock("../../lib/utils/logger");

describe("teardown", () => {
    tearDown([
        { topic: "testTopic1" },
        { topic: "testTopic2" },
        { topic: "testTopic2" }
    ]);

    it("returns", () => {});

    it("tries to delete topics", () => {
        expect(deleteTopicAsync).toBeCalled();
    });

    it("tries to delete the topics in the config passed", () => {
        expect(deleteTopicAsync).toBeCalledTimes(2);
        expect(deleteTopicAsync).toBeCalledWith("testTopic1");
        expect(deleteTopicAsync).toBeCalledWith("testTopic2");
    });

    it("will only try to delete a duplicate topic in the config once", () => {
        expect(deleteTopicAsync).toBeCalledTimes(2);
        expect(deleteTopicAsync).toBeCalledWith("testTopic1");
        expect(deleteTopicAsync).toBeCalledWith("testTopic2");
    });

    it("returns a list with topic names it has deleted", async () => {
        const list = await tearDown([{ topic: "testTopic" }]);
        expect(list).toEqual(["testTopic"]);
    });
});
