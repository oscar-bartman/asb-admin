jest.mock("../asb", () => ({
    serviceBusService: {
        createTopicIfNotExists: jest.fn(),
        createSubscription: jest.fn(),
        listTopics: jest.fn(),
        deleteTopic: jest.fn(),
        listSubscriptions: jest.fn(),
        deleteSubscription: jest.fn()
    }
}));
import * as functions from ".";

describe("functions", () => {
    it("exports screateSubscription", () => {
        expect(functions.createSubscription).toBeTruthy();
    });

    it("exports createTopicIfNotExists", () => {
        expect(functions.createTopicIfNotExists).toBeTruthy();
    });

    it("exports deleteSubscription", () => {
        expect(functions.deleteSubscription).toBeTruthy();
    });

    it("exports deleteTopic", () => {
        expect(functions.deleteTopic).toBeTruthy();
    });

    it("exports listSubscriptions", () => {
        expect(functions.listSubscriptions).toBeTruthy();
    });

    it("export listTopics", () => {
        expect(functions.listTopics).toBeTruthy();
    });

    it("export setup", () => {
        expect(functions.setup).toBeTruthy();
    });
});
