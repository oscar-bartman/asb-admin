import { send } from "../../lib/utils/send"
import { makeTopicClient } from "../../lib/utils/makeTopicClient"

jest.mock("../../lib/utils/logger")
jest.mock("../../lib/utils/makeTopicClient", () => ({
    makeTopicClient: jest.fn().mockReturnValue({
        createSender: jest.fn().mockReturnValue({
            send: jest.fn(),
            sendBatch: jest.fn()
        }),
        close: jest.fn()
    })
}))


describe("send", () => {
    it("should call send if passed an object", async () => {
        await send({ connectionString: "fake", topicName: "fake", payload: { foo: "bar" } })
        expect(makeTopicClient({ connectionString: "", topicName: "" }).createSender().send).toBeCalled()
    })

    it("should call sendBatch if passed an array", async () => {
        await send({ connectionString: "fake", topicName: "fake", payload: [{ foo: "bar" }] })
        expect(makeTopicClient({ connectionString: "", topicName: "" }).createSender().sendBatch).toBeCalled()
    })
})