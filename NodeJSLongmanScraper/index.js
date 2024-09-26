import playwright from "playwright";
import * as cheerio from "cheerio";
import { handleEntry } from "./utils/entry.js";
import fs from "fs";

//*! For scraping longman website from your local machin, you need to keep your proxy on.
//* Pay attention to the diffrence between browser.close() and page.close(), they do as their names imply.
//* If we don't close the browser, the code will not finish executing, so we must do it.
//* In some entries there isn't a phonetic alphabet section because it's been similar to the previous entry's. So after handling all the entries, remember to do this: for each entry which doesn't have a a phonetic alphabet section, copy the previous one's to the it.
//* To use playwright, we need to install browsers and since we only use chromium, after installing playwright we need to run the command "npx playwright install chromium" (if we run "npx playwright install", it will install chromium, firefox and webkit browsers but we don't need all of them)

// TODO: Sometimes when scraping several words simultaneously, an error happens and tells something about promises. I think it is happening after I changed writing to files to synchronously. Solved: The reason was page.close() line, I commented it out because with the line browser.close(), we don't need it. I know I didn't solve the problem properly, but I erased the problem.

const baseURL = "https://www.ldoceonline.com/dictionary/";

async function scrape(words) {
  const browser = await playwright.chromium.launch({ headless: true });
  //! We can't replace this following map method by a forEach method and remove the Promise.all line, because in that case, the line "await browser.close();" would close the browser and an error occurs. I've used map method to be able to Promise.all them in order to make the line "await browser.close();" execution wait (make the browser be open) until all the data scraping is done.
  //* This call back function in the following map method doesn't return any thing apparently, but actually it returns a promise and that's what I need here. In other words, I've only used wordsScrapingPromises to Promise.all it and make the execution of line "await browser.close();" wait until all data is scraped.

  const wordsScrapingPromises = words.map(async (word) => {
    await fs.promises.writeFile(`./${word}.json`, "[]");
    //* Both lines below work fine 👇:
    return scrapeWord(word, browser);
    // await scrapeWord(word, browser);
  });
  await Promise.all(wordsScrapingPromises);
  browser.close();
}

async function scrapeWord(word, browser) {
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
    await page.goto(url, { timeout: 240000 });
    let html = await page.content();
    const $ = cheerio.load(html);

    // const buffer = fs.readFileSync("book.html");
    // const $ = cheerio.loadBuffer(buffer);

    // Get all entries:
    let $entries = $("div.dictionary span.dictentry");

    const $nonBussEntries = $entries.filter((i, elem) => {
      // this === elem
      return !$(elem).html().includes("bussdictEntry");
    });
    const nonBussEntriesPromises = $nonBussEntries.map((i, elem) => {
      return handleEntry($(elem), $, browser, sharedData, word);
    });
    await Promise.all(nonBussEntriesPromises);
    // page.close();
  } catch (error) {
    return console.log("This error happened:", error);
  }
}

scrape(["sync", "freak"]);
