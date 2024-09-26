import * as cheerio from "cheerio";

export async function getCrossRefSense(url, browser) {
  try {
    const page = await browser.newPage();
    await page.route("**/*", (route) => {
      const request = route.request();
      const resourceType = request.resourceType();

      if (["image", "stylesheet", "script"].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    let html = await page.content();
    const $ = cheerio.load(html);
    const $sense = $("div.dictionary span.dictentry span.Sense");
    return $sense;
  } catch (error) {
    console.log("This error happened when handling a cross ref:", error);
  }
}
