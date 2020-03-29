import { setup } from "../../lib/utils/setup";
import {
    createTopicIfNotExistsAsync,
    createSubscriptionAsync
} from "../../lib/utils/serviceBusServiceAsync";

jest.mock("../../lib/utils/serviceBusServiceAsync", () => ({
    createTopicIfNotExistsAsync: jest.fn(),
    createSubscriptionAsync: jest.fn()
}));
jest.mock("../../lib/utils/logger");

describe("setup", () => {
    beforeEach(() => {
        (createSubscriptionAsync as jest.Mock).mockReset();
    });

    it("tries to create as many topics as passed", async () => {
        await setup([
            { topic: "testTopic", subscription: "testSubscription" },
            { topic: "testTopic", subscription: "testSubscription" }
        ]);
        expect(createTopicIfNotExistsAsync).toBeCalledTimes(2);
    });
    it("tries to create as many subscriptions as are in the spec", async () => {
        await setup([
            { topic: "testTopic", subscription: "testSubscription" },
            { topic: "testTopic", subscription: "testSubscription" }
        ]);
        expect(createSubscriptionAsync).toBeCalledTimes(2);
    });
});
