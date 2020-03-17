import { ServiceBusService } from "azure-sb";
import * as azure from "azure-sb";
import { promisify } from "util";
import * as program from "commander"
import { logger } from "./utils/logger"

program
  .parse(process.argv);

if (!program.args[0] || !program.args[1]) {
  logger.error("I need a topic and subscription name.");
}

let _serviceBusService: ServiceBusService;
let _deleteSubscriptionAsync: any;

const deleteSubscription = async (topicPath: string, subscriptionPath: string) => {
  _serviceBusService = azure.createServiceBusService();
  _deleteSubscriptionAsync = promisify(_serviceBusService.deleteSubscription).bind(_serviceBusService);
  await _deleteSubscriptionAsync(topicPath, subscriptionPath);
};

deleteSubscription(program.args[0], program.args[1])
  .then(() => {
    logger.info(`deleted subscription '${program.args[1]}' from topic '${program.args[0]}'`);
  })
  .catch(err => logger.error(err));