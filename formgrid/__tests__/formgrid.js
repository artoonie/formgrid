const slider = require('../formgrid.js');

beforeEach(() => {
  // See: https://github.com/jsdom/jsdom/issues/1695
  Element.prototype.scrollIntoView = jest.fn();
});

describe('API basic tests', () => {
  test('Create entire timeline and do not crash', () => {
    const grid = FormGrid('table-id');
  });
});
