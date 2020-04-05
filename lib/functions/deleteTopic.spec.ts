import { deleteTopic } from "./deleteTopic";
jest.mock("../asb", () => ({
    serviceBusService: {
        deleteTopic: jest.fn()
    }
}));

describe("deleteTopic", () => {
    it("returns a promise", () => {
        expect(typeof deleteTopic().then).toBe("function");
    });
});
