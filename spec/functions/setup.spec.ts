import { setup } from "./../../lib/functions/setup";
jest.mock("../../lib/functions", () => ({
    createTopicIfNotExists: jest.fn(),
    createSubscription: jest.fn()
}));
import {
    createTopicIfNotExists,
    createSubscription
} from "../../lib/functions";

describe("setup", () => {
    setup([
        { topic: "something", subscription: "something" },
        { topic: "something" }
    ]);
    it("returns", () => {});

    it("tries to create topics", () => {
        expect(createTopicIfNotExists as jest.Mock).toBeCalled();
    });

    it("tries to create subscriptions", () => {
        expect(createSubscription as jest.Mock).toBeCalled();
    });

    it("tries to create as many topics as passed", () => {
        expect(createTopicIfNotExists).toBeCalledTimes(2);
    });

    it("tries to create as many subscriptions as passed", () => {
        expect(createSubscription).toBeCalledTimes(1);
    });
});
