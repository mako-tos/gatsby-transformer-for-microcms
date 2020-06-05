const { convertHtml } = require("../convertHtml");
const cheerio = require("cheerio");
jest.mock("node-fetch", () => {
  const dummyResponse = Promise.resolve({
    ok: true,
    status: 200,
    json: () => {
      return { PixelHeight: 10, PixelWidth: 20 };
    },
  });
  return jest.fn().mockReturnValue(dummyResponse);
});

describe("convertHtml", () => {
  test("dont use hljs", async () => {
    const $ = cheerio.load("<pre><code>const x = 11;</code></pre>");
    const html = await convertHtml($, { useHljs: false });
    expect(html).toBe("<pre><code>const x = 11;</code></pre>");
  });

  test("use hljs", async () => {
    const $ = cheerio.load("<pre><code>const x = 11;</code></pre>");
    const html = await convertHtml($, { useHljs: true });
    expect(html).toBe(
      '<pre><code class="hljs"><span class="hljs-keyword">const</span> x = <span class="hljs-number">11</span>;</code></pre>'
    );
  });

  test("hljs is undefined", async () => {
    const $ = cheerio.load("<pre><code>const x = 11;</code></pre>");
    const html = await convertHtml($, {});
    expect(html).toBe("<pre><code>const x = 11;</code></pre>");
  });

  test("apply other site img", async () => {
    const $ = cheerio.load('<img src="https://other-site.com/some.img">');
    const html = await convertHtml($, { useHljs: true });
    expect(html).toBe('<img src="https://other-site.com/some.img">');
  });

  test("apply microcms's img(w and h is not defined)", async () => {
    const $ = cheerio.load(
      '<img src="https://images.microcms-assets.io/some.jpg">'
    );
    const html = await convertHtml($, { useHljs: false });
    // it's complex so check result with Cheerio
    const $result = cheerio.load(html);
    const $pictures = $result("picture");
    expect($pictures.length).toBe(1);
    const picture = $pictures.get(0);
    const $sources = $(picture).find("source");
    expect($sources.length).toBe(2);
    const $sourceWebp = $($sources.get(0));
    expect($sourceWebp.attr("type")).toBe("image/webp");
    const $sourceOrg = $($sources.get(1));
    expect($sourceOrg.attr("type")).toBe(undefined);
    $sources.each((idx, elem) => {
      expect($(elem).attr("srcset")).toBeTruthy();
    });
    const $img = $(picture).find("img");
    expect($img.length).toBe(1);
    expect($img.attr("src")).toBeTruthy();
  });

  test("apply microcms's img(w and h is defined)", async () => {
    const $ = cheerio.load(
      '<img src="https://images.microcms-assets.io/some.img?w=10&h=20">'
    );
    const html = await convertHtml($, { useHljs: false });
    // it's complex so check result with Cheerio
    const $result = cheerio.load(html);
    const $pictures = $result("picture");
    expect($pictures.length).toBe(1);
    const picture = $pictures.get(0);
    const $sources = $(picture).find("source");
    expect($sources.length).toBe(2);
    const $sourceWebp = $($sources.get(0));
    expect($sourceWebp.attr("type")).toBe("image/webp");
    const $sourceOrg = $($sources.get(1));
    expect($sourceOrg.attr("type")).toBe(undefined);
    $sources.each((idx, elem) => {
      expect($(elem).attr("srcset")).toBeTruthy();
    });
    const $img = $(picture).find("img");
    expect($img.length).toBe(1);
    expect($img.attr("src")).toBeTruthy();
  });

  test("apply microcms's img(w and h and alt is defined)", async () => {
    const $ = cheerio.load(
      '<img src="https://images.microcms-assets.io/some.img?w=10&h=20&fit=crop" alt="title">'
    );
    const html = await convertHtml($, {
      useHljs: false,
      image: { sizes: "100px", loading: "auto" },
    });
    // it's complex so check result with Cheerio
    const $result = cheerio.load(html);
    const $pictures = $result("picture");
    expect($pictures.length).toBe(1);
    const picture = $pictures.get(0);
    const $sources = $(picture).find("source");
    expect($sources.length).toBe(2);
    $sources.each((idx, elem) => {
      expect($(elem).attr("srcset")).toBeTruthy();
    });
    const $img = $(picture).find("img");
    expect($img.length).toBe(1);
    expect($img.attr("src")).toBeTruthy();
    expect($img.attr("alt")).toBe("title");
  });
});
