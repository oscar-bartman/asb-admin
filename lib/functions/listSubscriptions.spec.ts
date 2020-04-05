import { listSubscriptions } from "./listSubscriptions";
jest.mock("../asb", () => ({
    serviceBusService: { listSubscriptions: jest.fn() }
}));

describe("listSubscriptions", () => {
    it("returns a promise", () => {
        expect(typeof listSubscriptions().then).toBe("function");
    });
});
