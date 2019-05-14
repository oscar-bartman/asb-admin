#! /usr/bin/env node
import * as program from "commander";

program
    .version("0.0.1", "-v, --version")
    .command("list [topic]", "list topic with subscriptions, leave blank to list all topics with subscriptions").alias('l')
    .command("new-topic [elem]", "create new")
    .command("new-subscription [elem]", "create new")
    .command("view [topic]", "view events")
    .command("setup [file]", "setup a service bus as specified by a config file")
    .command("teardown [file]", "send a valid event to a topic")
    .command("send [topic] [file]", "send a valid event to a topic")
    .command("load [load]", "send an amount of load over the gv-event-processor and get some logging")
    .command("drain-dlq [topic]", "empty the dlq for a topic")
    .parse(process.argv);
