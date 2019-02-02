# Azure Service Bus Admin Tool

## Install
`npm install -g`

## Use
First configure a valid ASB connection string as an environment variable
with the name `AZURE_SERVICEBUS_CONNECTION_STRING`.

```bash
# list subscriptions for [topic]
$ asb-admin list [topic]

# list all subscriptions for all topics
$ asb-admin list
```

## Contribute
- npm run build
- npm start (args)
