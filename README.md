# arm-template-generator
Generates ARM (Azure Resource Manager) Templates

# Supported Templates
1. Create Service Bus Namespace, topic and subscription

# How to use
```
const atg = require('arm-template-generator');

const template = atg.newTemplate({
  namespace: "myNamespace",
  topic: "myTopic",
  subscription: "mySubscription"
});

console.log(template);
```

# Example
An example is provided in example.js that uses `inquirer` to take input and generate a JSON arm template file.
