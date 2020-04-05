jest.mock("../asb", () => ({
    serviceBusService: { createTopicIfNotExists: jest.fn() }
}));
import { createTopicIfNotExists } from "./createTopicIfNotExists";

describe("createTopicIfNotExists", () => {
    it("returns a promise", () => {
        expect(typeof createTopicIfNotExists("topicPath").then).toBe(
            "function"
        );
    });
});
