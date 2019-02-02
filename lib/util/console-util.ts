// todo watch the out file, when something changes, clear the console and write the outfile to console
process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        // todo update the table, refresh the screen
    }
});
