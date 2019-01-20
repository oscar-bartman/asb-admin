import * as program from "commander"
import * as azure from "azure-sb";
import {ServiceBusService} from "azure-sb";
import {table} from "table"

program
    .parse(process.argv);

if (!program.args[0]) {
    console.log("argument required");
    process.exit(1);
}

const elem = program.args[0];

// todo make use of table (https://www.npmjs.com/package/table) and chalk (https://www.npmjs.com/package/chalk) to make this pretty
if (elem === "s" || elem === "subs" || elem === "subscriptions") {

    if (!program.args[1]) {
        // todo list all of the subscriptions in a table under their topic names

        console.log("name of topic is missing");
        process.exit(1);
    }

    const serviceBusService: ServiceBusService = azure.createServiceBusService();

    const topic = program.args[1];

    serviceBusService.listSubscriptions(topic, {}, (err: any, listsubscriptionresult: any) => {
        if (err) {
            console.log(err);
        } else {
            const data = [
                [topic]
            ];
            listsubscriptionresult.forEach((subScriptionResult: any) => {
                // console.log(subScriptionResult.SubscriptionName);
                data.push([subScriptionResult.SubscriptionName])
            });
            const options = {
                drawHorizontalLine: (index: number, size: number) => {
                    return index === 0 || index === 1 || index === size;
                }
            };
            console.log(table(data, options));
        }
    });
}

