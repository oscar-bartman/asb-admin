// import { ServiceBusClient } from "@azure/service-bus";
import * as asb from "@azure/service-bus";

const connectionString =
    process.env["AZURE_SERVICEBUS_CONNECTION_STRING"] || "";

export const serviceBusClient = asb.ServiceBusClient.createFromConnectionString(
    connectionString
);

export * from "@azure/service-bus";
