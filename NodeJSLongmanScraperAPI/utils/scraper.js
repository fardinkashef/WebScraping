import playwright from "playwright";
import * as cheerio from "cheerio";
import { handleEntry } from "./entry.js";

const baseURL = "https://www.ldoceonline.com/dictionary/";

export default async function scrape(word) {
  const browser = await playwright.chromium.launch({ headless: true });
  const sharedData = { pronunciation: "" };
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
    const url = baseURL + word;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    let html = await page.content();
    const $ = cheerio.load(html);

    // Get all entries:
    let $entries = $("div.dictionary span.dictentry");

    const $nonBussEntries = $entries.filter(function (i, el) {
      // this === el
      return !$(this).html().includes("bussdictEntry");
    });
    const arrayOfArrays = $nonBussEntries.toArray().map((elem) => {
      return handleEntry($(elem), $, browser, sharedData);
    });
    const sensesInArray = await Promise.all(arrayOfArrays);
    const senses = sensesInArray.flat();
    // console.log(senses);

    return senses;

    // page.close();
  } catch (error) {
    return console.log("This error happened:", error);
  } finally {
    browser.close();
  }
}
