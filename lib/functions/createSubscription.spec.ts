import { createSubscription } from "./createSubscription";
jest.mock("../asb", () => ({
    serviceBusService: { createSubscription: jest.fn() }
}));

describe("deleteSubscription", () => {
    it("returns a promise", () => {
        expect(
            typeof createSubscription("topicPath", "subscriptionPath").then
        ).toBe("function");
    });
});
