const fetch = require("node-fetch");
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
 * microcmsの画像URLをresponsiveなsrcset用に作り直す
 * @param {string} urlBase
 * @param {Array<objct>} rectSet
 * @param {object} orgParams
 * @param {boolean} isWebp
 * @returns {string} srcset
 */
const createImgSrcset = (urlBase, rectSet, orgParams, isWebp) => {
  return rectSet
    .map((rect) => {
      const newUrl = new URL(urlBase);
      newUrl.searchParams.set("w", rect.w);
      newUrl.searchParams.set("h", rect.h);
      orgParams.forEach((value, key) => {
        if (key === "w" || key === "h" || key === "fm") {
          return;
        }
        newUrl.searchParams.set(key, value);
      });
      if (isWebp) {
        newUrl.searchParams.set("fm", "webp");
      }
      return `${newUrl.href} ${rect.w}w`;
    })
    .join(", ");
};

/**
 * 画像URLからサイズを取得する
 * @param {string} imageUrl
 * @param {object} reporter
 */
const getJsonByImageUrl = async (imageUrl, reporter) => {
  try {
    const fetchResult = await fetch(imageUrl + "?fm=json");
    const json = await fetchResult.json();
    const height = json.PixelHeight;
    const width = json.PixelWidth;
    return { height, width };
  } catch (e) {
    reporter.warn(`image not found: ${imageUrl}`);
  }
  return {};
};

/**
 * convert from img to picture and sources and img
 * @param {Cheerio} $
 * @param {object} param1 (Optional)
 * @param {string} param1.sizes
 * @param {string} param1.loading
 * @param {object} reporter
 * @return {Cheerio} $
 */
const applyImg = async ($, { sizes, loading }, reporter) => {
  const promises = $('img[src^="https://images.microcms-assets.io"]')
    .map(async (idx, img) => {
      const src = img.attribs.src;
      const url = new URL(src);
      const params = url.searchParams;
      const urlBase = url.origin + url.pathname;
      let height = parseInt(params.get("h") || 0, 10);
      let width = parseInt(params.get("w") || 0, 10);

      if (height === 0 || width === 0) {
        const result = await getJsonByImageUrl(urlBase, reporter);
        if (!result.width || !result.height) {
          return;
        }
        height = result.height;
        width = result.width;
      }
      const rates = [1 / 4, 1 / 2, 1, 2, 4];
      const rectSet = rates.map((rate) => {
        return {
          h: parseInt(height * rate, 10),
          w: parseInt(width * rate, 10),
        };
      });

      const $picture = $("<picture />");
      const srcSetWebp = createImgSrcset(urlBase, rectSet, params, true);
      const webpSource = $("<source />");
      webpSource.attr("srcSet", srcSetWebp);
      webpSource.attr("type", "image/webp");
      $picture.append(webpSource);

      const srcSet = createImgSrcset(urlBase, rectSet, params, false);
      const source = $("<source />");
      source.attr("srcSet", srcSet);
      $picture.append(source);

      const $img = $(img);
      const newImg = $(`<img>`);
      for (const key in img.attribs) {
        newImg.attr(key, img.attribs[key]);
      }
      newImg.attr("srcset", srcSet); // fallback
      newImg.attr("sizes", sizes);
      newImg.attr("loading", loading);
      $picture.append(newImg);

      $img.replaceWith($picture);
    })
    .get();
  await Promise.all(promises);

  return $;
};

/**
 * @param {Cheerio} $ Cheerio
 * @param {object} options
 * @param {boolean} options.useHljs (Optional)
 * @param {string} options.image.sizes (Optional)
 * @param {string} options.image.loading (Optional) lazy|auto|eager
 * @param {object} reporter
 * @returns {string} convertedHtml
 */
const convertHtml = async ($, { useHljs = false, image = {} }, reporter) => {
  const defaultOptions = {
    sizes: "(max-width: 800px) 80vw, 800px",
    loading: "lazy",
  };
  const { sizes, loading } = { ...defaultOptions, ...image };

  $ = await applyImg($, { sizes, loading }, reporter);
  if (useHljs) {
    $ = applyHljs($);
  }
  return $("body").html();
};

module.exports = { convertHtml };
