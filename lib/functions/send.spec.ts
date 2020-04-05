import { send } from "../../lib/functions/send";
import { serviceBusClient } from "../asb";

jest.mock("../../lib/utils/logger");
jest.mock("../asb", () => ({
    serviceBusClient: {
        createTopicClient: jest.fn().mockReturnValue({
            close: jest.fn(),
            createSender: jest
                .fn()
                .mockReturnValue({ send: jest.fn(), sendBatch: jest.fn() })
        })
    }
}));

describe("send", () => {
    it("should call send if passed an object", async () => {
        await send({
            topicName: "fake",
            payload: { foo: "bar" }
        });
        expect(
            serviceBusClient.createTopicClient("topic").createSender().send
        ).toBeCalled();
    });

    it("should call sendBatch if passed an array", async () => {
        await send({
            topicName: "fake",
            payload: [{ foo: "bar" }]
        });
        expect(
            serviceBusClient.createTopicClient("topic").createSender().sendBatch
        ).toBeCalled();
    });

    it("should call close on client", async () => {
        await send({
            topicName: "fake",
            payload: [{ foo: "bar" }]
        });
        expect(serviceBusClient.createTopicClient("topic").close).toBeCalled();
    });
});
