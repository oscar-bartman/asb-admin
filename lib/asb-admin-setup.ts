import * as program from "commander"

program
    .parse(process.argv);

console.log("Not implemented yet");
process.exit(1);

if (!program.args[0]) {
    // todo read from bus-config.json and parse and setup
}

// const file = program.args[0];
// todo given file, parse and setup
// todo check file formatting with types (we could use joi, but everyone on the project gets types because we work with it,
//  and we will want to extract the setup logic in a way that we can pour it into the event-processor tests as well).
