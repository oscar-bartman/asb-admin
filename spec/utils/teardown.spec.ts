import { tearDown } from "../../lib/utils/teardown";
import { deleteTopicAsync } from "../../lib/utils/serviceBusServiceAsync";

jest.mock("../../lib/utils/logger");
jest.mock("../../lib/utils/serviceBusServiceAsync", () => ({
    deleteTopicAsync: jest.fn()
}));
jest.mock("../../lib/utils/logger");

describe("teardown", () => {
    beforeEach(() => {
        (deleteTopicAsync as jest.Mock).mockReset();
    });

    it("tries to delete the topics in the config passed", async () => {
        await tearDown([{ topic: "testTopic1" }, { topic: "testTopic2" }]);

        expect(deleteTopicAsync).toBeCalledTimes(2);
        expect(deleteTopicAsync).toBeCalledWith("testTopic1");
        expect(deleteTopicAsync).toBeCalledWith("testTopic2");
    });

    it("will only try to delete a duplicate topic in the config once", async () => {
        await tearDown([{ topic: "testTopic1" }, { topic: "testTopic1" }]);

        expect(deleteTopicAsync).toBeCalledTimes(1);
        expect(deleteTopicAsync).toBeCalledWith("testTopic1");
    });
});
