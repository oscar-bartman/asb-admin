import { deleteSubscription } from "./deleteSubscription";
jest.mock("../asb", () => ({
    serviceBusService: { deleteSubscription: jest.fn() }
}));

describe("deleteSubscription", () => {
    it("returns a promise", () => {
        expect(
            typeof deleteSubscription("topicPath", "subscriptionPath").then
        ).toBe("function");
    });
});
