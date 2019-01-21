#! /usr/bin/env node
import * as program from "commander";

program
    .version("0.0.1", "-v, --version")
    .command("list [elem]", "list element")
    .command("new [elem]", "create new")
    .parse(process.argv);
