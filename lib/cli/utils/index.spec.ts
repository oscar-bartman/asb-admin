import * as utils from ".";

describe("utils", () => {
    it("exports getBusConfig", () => {
        expect(typeof utils.getBusConfig).toBe("function");
    });

    it("exports getPrefixedTopicsConfig", () => {
        expect(typeof utils.getPrefixedTopicsConfig).toBe("function");
    });
});
