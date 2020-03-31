import { setup } from "../../lib/utils/setup";
import {
    createTopicIfNotExistsAsync,
    createSubscriptionAsync
} from "../../lib/asb";
import { logger } from "../../lib/utils/logger";

jest.mock("../../lib/asb", () => ({
    createTopicIfNotExistsAsync: jest.fn(),
    createSubscriptionAsync: jest.fn()
}));
jest.mock("../../lib/utils/logger", () => ({
    logger: {
        info: jest.fn()
    }
}));

describe("setup", () => {
    beforeEach(() => {
        (createSubscriptionAsync as jest.Mock).mockReset();
        (logger.info as jest.Mock).mockReset();
    });

    it("tries to create as many topics as passed", async () => {
        await setup([
            { topic: "testTopic1", subscription: "testSubscription" },
            { topic: "testTopic2", subscription: "testSubscription" }
        ]);
        expect(createTopicIfNotExistsAsync).toBeCalledTimes(2);
    });
    it("tries to create as many subscriptions as are in the spec", async () => {
        await setup([
            { topic: "testTopic1", subscription: "testSubscription" },
            { topic: "testTopic2", subscription: "testSubscription" }
        ]);
        expect(createSubscriptionAsync).toBeCalledTimes(2);
    });

    it("logs which topics have been created", async () => {
        await setup([
            { topic: "testTopic1", subscription: "testSubscription" },
            { topic: "testTopic2", subscription: "testSubscription" }
        ]);

        expect(logger.info as jest.Mock).toBeCalledWith(
            "created the following topics: testTopic1,testTopic2"
        );

        expect(logger.info as jest.Mock).toBeCalledWith(
            "created the following subscriptions: testSubscription,testSubscription"
        );
    });
});
