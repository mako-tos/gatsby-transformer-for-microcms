/**
 * @param {Cheerio} $ Cheerio
 * @returns {string} plain text
 */
const createPlainText = $ => {
  return $.root()
    .text()
    .split("\n")
    .map((text) => text.trim())
    .join("");
};

module.exports = { createPlainText }