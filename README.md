# arm-template-generator
Generates ARM (Azure Resource Manager) Templates

# Supported Templates
1. Create Service Bus Namespace, topic, subscription and outputs namespace level connection string
1. Create Service Bus Namespace, topic, subscription and outputs topic level connection string

# How to use
```
const atg = require('arm-template-generator');

const template = atg.newTemplate({
  namespace: "myNamespace",
  topic: "myTopic",
  subscription: "mySubscription",
  authRuleName: "myAuthRuleName" // optional, name for topic level authorization rule
});

console.log(template);
```

# Example
An example is provided in example.js that uses `inquirer` to take input and generate a JSON arm template file.

# Authorization Rules
By default, the output variable named `NamespaceDefaultConnectionString` will contain the connection string for the namespace level. It can be useful to acquire only a Topic level authorization. By passing in `authRuleName`, this will setup a Topic level auth rule.
