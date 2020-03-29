import { tearDown } from "../../lib/utils/teardown";

jest.mock("../../lib/utils/logger");
jest.mock("../../lib/utils/serviceBusServiceAsync", () => ({
    deleteTopicAsync: jest.fn()
}));

describe("teardown", () => {
    it("", async () => {
        await tearDown([
            { topic: "testTopic", subscription: "testSubscription" }
        ]);
    });
});
