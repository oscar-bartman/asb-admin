import * as program from "commander";

program
    .parse(process.argv);

if (!program.args[0] || !program.args[1]) {
    console.log("I need both a topic and a file containing a valid event.");
    process.exit(1);
}

console.log("Not implemented yet");
// const topic = program.args[0];
// const file = program.args[1];

