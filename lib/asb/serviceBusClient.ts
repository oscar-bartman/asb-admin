import { ServiceBusClient } from "@azure/service-bus";

const connectionString =
    process.env["AZURE_SERVICEBUS_CONNECTION_STRING"] || "";

export const serviceBusClient = ServiceBusClient.createFromConnectionString(
    connectionString
);
