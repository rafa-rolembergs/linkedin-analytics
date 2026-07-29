const assert = require('assert');
const CompanyDetector = require('../modules/companyDetector.js');

const fakeDocument = {
  querySelector(selector) {
    if (selector === 'h1') {
      return { innerText: 'Acme Corp' };
    }
    return null;
  }
};

const companyContext = CompanyDetector.getContext(fakeDocument, 'https://www.linkedin.com/company/acme');
assert.strictEqual(companyContext.page, 'EMPRESA');
assert.strictEqual(companyContext.companyName, 'Acme Corp');
assert.strictEqual(companyContext.linkedin, 'https://www.linkedin.com/company/acme');

const searchContext = CompanyDetector.getContext(fakeDocument, 'https://www.linkedin.com/search/results/companies/?keywords=fintech');
assert.strictEqual(searchContext.page, 'EMPRESAS');

console.log('companyDetector tests passed');
