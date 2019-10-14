const inquirer = require('inquirer');
const fs = require('fs');
const atg = require('./');

async function init() {
  inquirer.prompt([{
    type: 'input',
    name: 'sku',
    message: 'Messaging tier for service Bus namespace [Basic]:',
  }, {
    type: 'input',
    name: 'namespace',
    message: 'Name of Service Bus Namespace:',
    validate: (text) => (!!text),
  }, {
    type: 'input',
    name: 'topic',
    message: 'Name of Service Bus Topic:',
    validate: (text) => (!!text),
  }, {
    type: 'input',
    name: 'subscription',
    message: 'Name of Service Bus Subscription:',
    validate: (text) => (!!text),
  }, {
    type: 'input',
    name: 'filename',
    message: 'Local Filename for Template [template.json]:',
  }, {
    type: 'list',
    name: 'authRuleNameExists',
    choices: ['Yes', 'No'],
    default: 'No',
    message: 'Do you want to setup a Topic Level Authorization Rule? [No]:',
  }, {
    type: 'input',
    name: 'authRuleName',
    when: (answers) => answers.authRuleNameExists === 'Yes',
    message: 'Name of Authorization Rule:',
  }]).then((answers) => {
    const template = atg.newTemplate(answers);
    try {
      fs.writeFileSync(answers.filename || 'template.json', JSON.stringify(template, null, 4));
      console.log('File written successfully to', answers.filename || 'template.json');
    } catch (e) {
      console.error('Error writing file to ', answers.filename || 'template.json');
      console.error(e);
    }
  });
}

init();
