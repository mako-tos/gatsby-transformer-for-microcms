const cheerio = require("cheerio");
const { createPlainText } = require("./src/createPlainText");
const { convertHtml } = require("./src/convertHtml");

async function sourceNodes(
  { actions, createNodeId, createContentDigest, getNode, getNodesByType },
  pluginOptions
) {
  const nodeList = getNodesByType(pluginOptions.mediaType);
  const { field } = pluginOptions;
  const promises = nodeList.map(async (node) => {
    const $ = cheerio.load(node[field] || "");
    const html = $.html();
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

const validateOptions = ({ reporter }, options) => {
  if (!options) {
    reporter.panic("need options");
    return;
  }

  if (!options.mediaType || typeof options.mediaType !== "string") {
    reporter.panic("need mediaType and must be string");
    return;
  }

  if (!options.field || typeof options.field !== "string") {
    reporter.panic("need field and must be string");
    return;
  }

  if (options.useHljs && typeof options.useHljs !== "boolean") {
    reporter.panic("useHljs must be boolean");
    return;
  }

  if (options.image && typeof options.image !== "object") {
    reporter.panic("image must be object");
    return;
  }

  if (options.image && options.image.sizes && typeof options.image.sizes !== "string") {
    reporter.panic("image.sizes must be string");
    return;
  }

  if (options.image && options.image.loading && typeof options.image.loading !== "string") {
    reporter.panic("image.sizes must be loading");
    return;
  }
};
exports.onPreBootstrap = validateOptions;
