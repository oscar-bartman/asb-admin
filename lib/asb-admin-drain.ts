import * as program from "commander"
import { logger } from "./utils/logger"
import { delay, ServiceBusClient, ReceiveMode } from "@azure/service-bus"

program.parse(process.argv)

if (!program.args[0] || !program.args[1]) {
    logger.error("I need a topic and subscription name.")
}

const runDrainDlq = async () => {
    const connectionString =
        process.env["AZURE_SERVICEBUS_CONNECTION_STRING"] || ""
    const serviceBusClient = ServiceBusClient.createFromConnectionString(
        connectionString
    )
    const client = serviceBusClient.createSubscriptionClient(
        program.args[0],
        program.args[1]
    )
    const receiver = client.createReceiver(ReceiveMode.peekLock)

    const onMessageHandler = async (brokeredMessage: any) => {
        logger.info(`Received message: ${brokeredMessage.body}`)
        await brokeredMessage.complete()
    }
    const onErrorHandler = (err: any) => {
        logger.error(err.message)
    }

    try {
        receiver.registerMessageHandler(onMessageHandler, onErrorHandler, {
            autoComplete: false,
        })

        await delay(60000 * 10)

        await receiver.close()
        await client.close()
    } finally {
        await serviceBusClient.close()
    }
}

runDrainDlq().catch((e) => {
    logger.error(e)
})
