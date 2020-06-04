const { sourceNodes } = require('../sourceNodes');

jest.mock('../createPlainText', () => {
  return {
    createPlainText: jest.fn().mockReturnValue('createPlainText called'),
  };
});

jest.mock('../convertHtml', () => {
  return {
    convertHtml: jest.fn().mockReturnValue('convertHtml called'),
  };
});

jest.mock('cheerio', () => {
  return {
    load: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({
        html: jest.fn().mockReturnValue('html string')
      })
    }),
  };
});

const actions = {
  createNode: jest.fn(),
  createParentChildLink: jest.fn(),
};
const createNodeId = jest.fn().mockReturnValue('nodeId');
const createContentDigest = jest.fn().mockReturnValue('digest');
const getNode = jest.fn().mockReturnValue({});
const getNodesByType = jest.fn().mockReturnValue([{}, {}]);

beforeEach(() => {
  actions.createNode.mockClear();
  actions.createParentChildLink.mockClear();
  createNodeId.mockClear();
  createContentDigest.mockClear();
  getNode.mockClear();
});

const pluginOptions = {
  mediaType: 'blog',
  field: 'headImage',
};

describe('sourceNodes', () => {
  test('to be success', async () => {
    await sourceNodes(
      {
        actions,
        createNodeId,
        createContentDigest,
        getNode,
        getNodesByType,
      },
      pluginOptions
    );
    expect(actions.createNode.mock.calls.length).toBe(2);
    expect(createNodeId.mock.calls.length).toBe(2);
    expect(createContentDigest.mock.calls.length).toBe(2);
    expect(getNode.mock.calls.length).toBe(2);
    expect(getNodesByType.mock.calls.length).toBe(1);
    expect(actions.createParentChildLink.mock.calls.length).toBe(2);
  });
});
