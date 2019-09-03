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
});
