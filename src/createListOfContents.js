/**
 * @param {Cheerio} $ Cheerio
 * @returns {Array<object>} list of contents
 */
const createListOfContents = $ => {
  const $wapper = $("<div />")
  const $ol = $('<ol class="listOfContents" />')
  $wapper.append($ol)
  $("h1, h2, h3, h4, h5, h6").each((idx, elem) => {
    const $h = $(elem);
    const level = parseInt(elem.tagName.replace(/[hH]/, ''), 10);
    const id = $h.attr('id');
    const label = $h.text();
    const a = $(`<a href="#${id}">${label}</a>`)
    const li = $(`<li class="listOfContents--level${level}" />`)
    li.append(a)
    $ol.append(li)
  })
  return $wapper.html()
};

module.exports = { createListOfContents }