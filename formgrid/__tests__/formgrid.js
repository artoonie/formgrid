const formgrid = require('../formgrid.js');

beforeEach(() => {
  document.body.innerHTML = '<div id="parent"></div>'
  // See: https://github.com/jsdom/jsdom/issues/1695
  Element.prototype.scrollIntoView = jest.fn();
});

describe('API basic tests', () => {
  test('Create with defaults', () => {
    const grid = new formgrid.FormGrid('parent', new formgrid.InitialFormGridConfig());
  }),
  test('Test that model size matches view size', () => {
    const grid = new formgrid.FormGrid('parent', new formgrid.InitialFormGridConfig());
    expect(grid.model.rows()).toEqual(grid.rowsInView());
    expect(grid.model.cols()).toEqual(grid.colsInView());
  });
});
