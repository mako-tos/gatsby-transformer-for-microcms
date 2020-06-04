const hljs = require("highlight.js");
const URL = require("url").URL;

/**
 * @param {Cheerio} $
 * @returns {Cheerio} $
 */
const applyHljs = ($) => {
  $("pre code").each((_, code) => {
    const result = hljs.highlightAuto($(code).text());
    $(code).html(result.value);
    $(code).addClass("hljs");
  });
  return $;
};

/**
 * convert from img to picture and sources and img
 * @param {Cheerio} $
 * @param {object} param1 (Optional)
 * @param {string} param1.sizes
 * @param {string} param1.loading
 * @return {Cheerio} $
 */
const applyImg = ($, { sizes, loading }) => {
  $('img[src^="https://images.microcms-assets.io"]').each((idx, img) => {
    const src = img.attribs.src;
    const url = new URL(src);
    const params = url.searchParams;
    const urlBase = url.origin;
    const height = parseInt(params.get("h") || 0, 10);
    const width = parseInt(params.get("w") || 0, 10);
    if (height === 0 || width === 0) {
      return;
    }
    const rates = [1 / 4, 1 / 2, 1, 2, 4];
    const rectSet = rates.map((rate) => {
      return { h: parseInt(height * rate, 10), w: parseInt(width * rate, 10) };
    });

    const $picture = $("<picture />");
    const srcSetWebp = rectSet
      .map((rect) => {
        return `${urlBase}?w=${rect.w}&h=${rect.h}&fmt=webp ${rect.w}w`;
      })
      .join(", ");
    const webpSource = $("<source />");
    webpSource.attr("srcSet", srcSetWebp);
    $picture.append(webpSource);

    const srcSet = rectSet
      .map((rect) => {
        return `${urlBase}?w=${rect.w}&h=${rect.h} ${rect.w}w`;
      })
      .join(", ");
    const source = $("<source />");
    source.attr("srcSet", srcSet);
    $picture.append(source);

    const $img = $(img);
    const newImg = $(`<img>`);
    for (const key in img.attribs) {
      newImg.attr(key, img.attribs[key]);
    }
    newImg.attr("sizes", sizes);
    newImg.attr("loading", loading);
    $picture.append(newImg);

    $img.replaceWith($picture);
  });

  return $;
};

/**
 * @param {Cheerio} $ Cheerio
 * @param {object} options
 * @param {boolean} options.useHljs (Optional)
 * @param {string} options.image.sizes (Optional)
 * @param {string} options.image.loading (Optional) lazy|auto|eager
 * @returns {string} convertedHtml
 */
const convertHtml = ($, { useHljs = false, image = {} }) => {
  const defaultOptions = {
    sizes: "(max-width: 800px) 80vw, 800px",
    loading: "lazy",
  };
  const { sizes, loading } = { ...defaultOptions, ...image };

  $ = applyImg($, { sizes, loading });
  if (useHljs) {
    $ = applyHljs($);
  }
  return $("body").html();
};

module.exports = { convertHtml };
