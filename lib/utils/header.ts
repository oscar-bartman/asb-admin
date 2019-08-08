
function getEnvironment(): string {
    const connectionString: string = String(process.env.AZURE_SERVICEBUS_CONNECTION_STRING);
    const matches: RegExpMatchArray | null = connectionString.match(/sb:\/\/(.*)\.servicebus/);
    return Array.isArray(matches) && matches[1] ? matches[1] : "";
}

export function header(): void {
    console.log("\r\n");
    console.log(" \x1b[36m%s\x1b[0m", getEnvironment());
    console.log("\r\n");
}