#! /usr/bin/env node
import * as program from "commander";
import { header } from "../utils";

header();

program
    .version("0.0.1", "-v, --version")
    .command("list", "list topics with subscriptions")
    .alias("l")
    .command(
        "setup [file]",
        "setup a service bus as specified by a config file"
    )
    .command("teardown [file]", "tear down a configuration")
    .command("send [topic] [file]", "send a payload to a topic")
    .command(
        "drain [topic] [subscription]",
        "reads from a sub and deletes each message after logging it"
    )
    .command(
        "add-subscription [topic] [subscription]",
        "adds a subscription to a topic"
    )
    .command(
        "delete-subscription [topic] [subscription]",
        "deletes a subscription from a topic"
    )
    .parse(process.argv);
