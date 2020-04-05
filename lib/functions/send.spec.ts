import { send } from "../../lib/functions/send";
import { makeTopicClient } from "../../lib/asb";

jest.mock("../../lib/utils/logger");
jest.mock("../../lib/asb", () => ({
    makeTopicClient: jest.fn().mockReturnValue({
        createSender: jest.fn().mockReturnValue({
            send: jest.fn(),
            sendBatch: jest.fn()
        }),
        close: jest.fn()
    })
}));

describe("send", () => {
    it("should call send if passed an object", async () => {
        await send({
            topicName: "fake",
            payload: { foo: "bar" }
        });
        expect(
            makeTopicClient({
                topicName: ""
            }).createSender().send
        ).toBeCalled();
    });

    it("should call sendBatch if passed an array", async () => {
        await send({
            topicName: "fake",
            payload: [{ foo: "bar" }]
        });
        expect(
            makeTopicClient({
                topicName: ""
            }).createSender().sendBatch
        ).toBeCalled();
    });

    it("should call close on client", async () => {
        await send({
            topicName: "fake",
            payload: [{ foo: "bar" }]
        });
        expect(
            makeTopicClient({
                topicName: ""
            }).close
        ).toBeCalled();
    });
});
