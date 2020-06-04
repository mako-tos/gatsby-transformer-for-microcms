const { createPlainText } = require("../createPlainText");
const cheerio = require("cheerio");

describe("createPlainText", () => {
  test("easy", async () => {
    const $ = cheerio.load("abcd");
    const plainText = createPlainText($);
    expect(plainText).toBe("abcd");
  });

  test("difficult", async () => {
    const $ = cheerio.load("<p>abcd</p><span>x</span>y");
    const plainText = createPlainText($);
    expect(plainText).toBe("abcdxy");
  });
});
