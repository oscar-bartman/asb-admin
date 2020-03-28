import * as program from "commander"
import * as azure from "azure-sb"
import { table } from "table"
import * as fp from "lodash/fp"
import { promisify } from "util"
import { logger } from "./utils/logger"

const toCommaSeparated = fp.reduce(
    (acc: string, sub: { SubscriptionName: string }) =>
        `${sub.SubscriptionName}${acc ? `, ${acc}` : ""}`,
    ""
)
const drawOptions = {
    drawHorizontalLine: (index: number, size: number) => {
        return index === 0 || index === 1 || index === size
    },
}

program.parse(process.argv)

const listSubsAllTopics = async () => {
    const serviceBusService = azure.createServiceBusService()
    const listTopicsAsync = promisify(serviceBusService.listTopics).bind(
        serviceBusService
    )
    const listSubscriptionsAsync = promisify(
        serviceBusService.listSubscriptions
    ).bind(serviceBusService)

    type Topic = { TopicName: string }
    let topics: Topic[]
    topics = await listTopicsAsync()

    const topicNames: string[] = []
    topics.forEach((topic: Topic) => {
        topicNames.push(topic.TopicName)
    })

    const subLists = await Promise.all(
        topicNames.map((topicName: string) => {
            return listSubscriptionsAsync(topicName)
        })
    )

    type Subscription = { SubscriptionName: string }

    const subNamesStrings: string[] = fp.flatMap((subList: Subscription[]) => {
        return toCommaSeparated(subList)
    })(subLists)

    let data = topicNames.map((name: string, index: number) => [
        name,
        subNamesStrings[index],
    ])

    data = [["Topic", "Subscriptions"], ...data]

    console.log(table(data, drawOptions))
}

const listSubsTopic = async (topic: string) => {
    const serviceBusService = azure.createServiceBusService()
    const listSubscriptionsAsync = promisify(
        serviceBusService.listSubscriptions
    ).bind(serviceBusService)

    let subList

    subList = await listSubscriptionsAsync(topic)

    const data = [
        ["Topic", "Subscriptions"],
        [topic, toCommaSeparated(subList)],
    ]

    console.log(table(data, drawOptions))
}

if (!program.args[0]) {
    listSubsAllTopics().catch((e) => {
        logger.error(e)
    })
} else {
    const topic = program.args[0]
    listSubsTopic(topic).catch((e) => {
        logger.error(e)
    })
}
