import { listTopics } from "./listTopics";
jest.mock("../asb", () => ({ serviceBusService: { listTopics: jest.fn() } }));

describe("listTopics", () => {
    it.only("returns a promise", () => {
        expect(typeof listTopics().then).toBe("function");
    });
});
