# Azure Service Bus Admin Tool

## Install globally

`npm i -g asb-admin`

## Use

First configure a valid ASB connection string as an environment variable
with the name `AZURE_SERVICEBUS_CONNECTION_STRING`.

```bash
# list all subscriptions with all topics
$ asb-admin list

# setup a service bus config as defined in a json file
$ asb-admin setup [file]

# tear down a service bus config as defined in a json file
$ asb-admin teardown [file]

# tear down all the topics starting with the prefix "foobar"
$ asb-admin teardown --prefix=foobar

# send content of a file as payload to a-topic
$ asb-admin send a-topic something.json

# reads from a sub and deletes each message after logging it
$ asb-admin drain a-topic a-subscription
```

Example service bus config file (json):

```json
[
    {
        "topic": "test-topic",
        "subscription": "test-subscription"
    }
]
```
