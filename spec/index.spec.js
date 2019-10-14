const atg = require('../');

describe('arm-template-generator', () => {
  it('newTemplate fails with empty object', () => {
    try {
      atg.newTemplate({});
    } catch (e) {
      expect(e instanceof Error).toBe(true);
    }
  });

  it('newTemplate succeeds with full object', () => {
    try {
      const ns = 'ns';
      const template = atg.newTemplate({
        namespace: ns,
        topic: 'topic',
        subscription: 'sub',
      });
      expect(template.parameters.serviceBusNamespaceName.defaultValue).toBe(ns);
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  it('Make sure that the namespace auth resource is valid ', () => {
    try {
      const template = atg.newTemplate({
        namespace: 'ns',
        topic: 'topic',
        subscription: 'sub',
      });
      expect(template.variables.defaultAuthRuleResourceId).toBe("[resourceId('Microsoft.ServiceBus/namespaces/authorizationRules', parameters('serviceBusNamespaceName'), variables('defaultSASKeyName'))]");
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  it('Make sure that the topic auth resource is valid ', () => {
    try {
      const template = atg.newTemplate({
        namespace: 'ns',
        topic: 'topic',
        subscription: 'sub',
        authRuleName: 'topicLevel',
      });
      expect(template.variables.defaultAuthRuleResourceId).toBe("[resourceId('Microsoft.ServiceBus/namespaces/topics/authorizationRules', parameters('serviceBusNamespaceName'), parameters('serviceBusTopicName'), parameters('serviceBusRuleName'))]");
    } catch (e) {
      expect(false).toBe(true);
    }
  });
});
