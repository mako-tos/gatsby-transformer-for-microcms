const { createListOfContents } = require("../createListOfContents");
const cheerio = require("cheerio");

describe("createPlainText", () => {
  [1, 2, 3, 4, 5, 6].forEach((num) => {
    test(`basic h${num}`, async () => {
      const $ = cheerio.load(`<h${num} id="id${num}">label${num}</h${num}>`);
      const result = createListOfContents($);
      const $wapper = $("<div />")
      $wapper.append($(result));
      const $ol = $wapper.find("ol.listOfContents")
      expect($ol.length).toBe(1);
      const $li = $ol.find(`li.listOfContents--level${num}`)
      expect($li.length).toBe(1);
      const $a = $li.find('a')
      expect($a.attr('href')).toBe(`#id${num}`)
      expect($a.text()).toBe(`label${num}`)
    });
  });

  test(`if no h* return empty ol`, async () => {
    const $ = cheerio.load(`<p id="idp">labelp</p>`);
    const result = createListOfContents($);
    const $wapper = $("<div />")
    $wapper.append($(result));
    const $ol = $wapper.find("ol.listOfContents")
    expect($ol.length).toBe(1);
    const $li = $ol.find(`li`)
    expect($li.length).toBe(0);
});

  test(`if some h* return all h*`, async () => {
    const $ = cheerio.load(`<h1 id="id1">label1</h1><h2 id="id2">label2</h2>`);
    const result = createListOfContents($);
    const $wapper = $("<div />")
    $wapper.append($(result));
    const $ol = $wapper.find("ol.listOfContents")
    expect($ol.length).toBe(1);
    const $li = $ol.find(`li`)
    expect($li.length).toBe(2);
  });
});
