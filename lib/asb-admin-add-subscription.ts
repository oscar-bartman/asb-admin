// eslint-disable-next-line no-unused-vars
import { ServiceBusService } from "azure-sb"
import * as azure from "azure-sb"
import { promisify } from "util"
import * as program from "commander"
import { logger } from "./utils/logger"

program.parse(process.argv)

if (!program.args[0] || !program.args[1]) {
    logger.error("I need a topic and subscription name.")
}

let _serviceBusService: ServiceBusService
let _createSubscriptionAsync: any

const addSubscription = async (topicPath: string, subscriptionPath: string) => {
    _serviceBusService = azure.createServiceBusService()
    _createSubscriptionAsync = promisify(
        _serviceBusService.createSubscription
    ).bind(_serviceBusService)
    await _createSubscriptionAsync(topicPath, subscriptionPath)
}

addSubscription(program.args[0], program.args[1])
    .then(() => {
        logger.info(
            `added subscription '${program.args[1]}' on topic '${program.args[0]}'`
        )
    })
    .catch((err) => logger.error(err))
