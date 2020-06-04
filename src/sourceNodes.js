const cheerio = require("cheerio");
const { createPlainText } = require("./createPlainText");
const { convertHtml } = require("./convertHtml");

async function sourceNodes(
  { actions, createNodeId, createContentDigest, getNode, getNodesByType },
  pluginOptions
) {
  const nodeList = getNodesByType(pluginOptions.mediaType);
  const { field } = pluginOptions;
  const promises = nodeList.map(async (node) => {
    const $ = cheerio.load(node[field] || "");
    const html = $.find('body').html();
    const plainText = createPlainText($);
    const convertedHtml = convertHtml($, pluginOptions);

    const newNode = {
      html,
      plainText,
      convertedHtml,
    };

    const nodeId = createNodeId(`convert-html-${node.id}`);
    const cheerioNodeBase = {
      id: nodeId,
      parent: node.id,
      children: [],
      internal: {
        type: "convertHtml",
        contentDigest: createContentDigest(newNode),
      },
      ...newNode,
    };

    await actions.createNode(cheerioNodeBase);
    const cheerioNode = getNode(nodeId);
    actions.createParentChildLink({ parent: node, child: cheerioNode });
  });

  await Promise.all(promises);
}
exports.sourceNodes = sourceNodes;
