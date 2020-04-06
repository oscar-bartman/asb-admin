import { getPrefixedTopicsConfig } from "./getPrefixedTopicsConfig";

describe("getPrefixedTopicsConfig", () => {
    it("gets all the topics in a list of topics with a certain prefix", () => {
        const result = getPrefixedTopicsConfig({
            topics: [
                { TopicName: "x_topic1" },
                { TopicName: "xtopic1" },
                { TopicName: "ytopic1" }
            ],
            prefix: "x"
        });

        expect(result).toEqual([{ topic: "x_topic1" }, { topic: "xtopic1" }]);
    });

    it("returns an empty list if passed an empty list for topics", () => {
        const result = getPrefixedTopicsConfig({
            topics: [],
            prefix: "x"
        });

        expect(result).toEqual([]);
    });
});
