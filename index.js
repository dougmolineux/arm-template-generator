
function nsLevelAuth() {
  return "[resourceId('Microsoft.ServiceBus/namespaces/authorizationRules', parameters('serviceBusNamespaceName'), variables('defaultSASKeyName'))]";
}

function topicLevelAuth() {
  return "[resourceId('Microsoft.ServiceBus/namespaces/topics/authorizationRules', parameters('serviceBusNamespaceName'), parameters('serviceBusTopicName'), parameters('serviceBusRuleName'))]";
}

function getVariables(authRuleName) {
  if (!authRuleName) {
    return {
      defaultSASKeyName: 'RootManageSharedAccessKey',
      defaultAuthRuleResourceId: nsLevelAuth(),
      sbVersion: '2017-04-01',
    };
  }
  return {
    defaultSASKeyName: "[parameters('serviceBusRuleName')]",
    defaultAuthRuleResourceId: topicLevelAuth(authRuleName),
    sbVersion: '2017-04-01',
  };
}

function getBaseTemplate(authRuleName) {
  const topicResources = [
    {
      apiVersion: "[variables('sbVersion')]",
      name: "[parameters('serviceBusSubscriptionName')]",
      type: 'Subscriptions',
      dependsOn: [
        "[parameters('serviceBusTopicName')]",
      ],
      properties: {},
    },
  ];

  if (authRuleName) {
    topicResources.push({
      apiVersion: "[variables('sbVersion')]",
      name: "[parameters('serviceBusRuleName')]",
      type: 'authorizationRules',
      dependsOn: [
        "[parameters('serviceBusTopic')]",
      ],
      properties: {
        Rights: ['Send', 'Listen'],
      },
    });
  }

  return {
    $schema: 'https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#',
    contentVersion: '1.0.0.0',
    parameters: {},
    variables: {},
    resources: [{
      apiVersion: "[variables('sbVersion')]",
      name: "[parameters('serviceBusNamespaceName')]",
      type: 'Microsoft.ServiceBus/Namespaces',
      location: "[parameters('location')]",
      kind: 'Messaging',
      sku: {
        name: 'Standard',
      },
      resources: [
        {
          apiVersion: "[variables('sbVersion')]",
          name: "[parameters('serviceBusTopicName')]",
          type: 'Topics',
          dependsOn: [
            "[concat('Microsoft.ServiceBus/namespaces/', parameters('serviceBusNamespaceName'))]",
          ],
          properties: {
            path: "[parameters('serviceBusTopicName')]",
          },
          resources: topicResources,
        },
      ],
    }],
    outputs: {
      NamespaceDefaultConnectionString: {
        type: 'string',
        value: "[listkeys(variables('defaultAuthRuleResourceId'), variables('sbVersion')).primaryConnectionString]",
      },
      DefaultSharedAccessPolicyPrimaryKey: {
        type: 'string',
        value: "[listkeys(variables('defaultAuthRuleResourceId'), variables('sbVersion')).primaryKey]",
      },
    },
  };
}

function getParam(value, desc) {
  return {
    type: 'string',
    defaultValue: value,
    metadata: {
      description: desc,
    },
  };
}

function getAllParams(sku, namespace, topic, subscription, authRuleName) {
  const params = {};

  params.serviceBusSku = getParam(
    sku,
    'The messaging tier for service Bus namespace',
  );
  params.serviceBusNamespaceName = getParam(
    namespace,
    'Name of the Service Bus namespace',
  );
  params.serviceBusTopicName = getParam(
    topic,
    'Name of the Service Bus Topic',
  );
  params.serviceBusSubscriptionName = getParam(
    subscription,
    'Name of the Service Bus Topic Subscription',
  );
  params.location = getParam(
    '[resourceGroup().location]',
    'Location for all resources.',
  );
  if (authRuleName) {
    params.serviceBusRuleName = getParam(
      authRuleName,
      'Name of the Topic Level Authorization Rule, this will appear in the Azure Portal as a Shared Access Policy',
    );
  }

  return params;
}

exports.newTemplate = (options) => {
  if (!options.namespace || !options.topic || !options.subscription) {
    throw new Error('namespace, topic and subscription required on options object');
  }

  const authRuleName = options.authRuleName || null;
  const template = getBaseTemplate(authRuleName);
  template.parameters = getAllParams(
    options.sku || 'Basic',
    options.namespace,
    options.topic,
    options.subscription,
    authRuleName,
  );
  template.variables = getVariables(authRuleName);

  return template;
};
