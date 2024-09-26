import { getCrossRefSense } from "./crossRef.js";
import { handleEXAMPLEsGramExasColloExas } from "./examples.js";
import { cleanText } from "./shared.js";
import fs from "fs";

export async function handleEntry(
  $entry,
  $,
  browser,
  sharedData,
  searchedWord
) {
  //* WORD: sth like: "gotta"
  let word = "";
  if ($entry.find("span.Entry span.Head span.HWD").length)
    word = $entry.find("span.Entry span.Head span.HWD").text();
  else word = $entry.find(".PHRVBHWD").text();
  //* PRONUNCIATION: sth like this: /bʊk/
  let pronunciation = "";
  if ($entry.find("span.Head > span.PronCodes").length) {
    pronunciation = $entry.find("span.Head > span.PronCodes").text();
    sharedData.pronunciation = pronunciation;
  } else pronunciation = sharedData.pronunciation;
  pronunciation = pronunciation.trim();
  //* TOOLTIP: sth like this :{ text: '●●●', title: 'Core vocabulary: High-frequency' }
  let tooltip = null;
  if ($entry.find("span.Head > span.tooltip").length) {
    tooltip = { text: "", title: "" };
    tooltip.text = $entry.find("span.Head > span.tooltip").text();
    tooltip.title = $entry.find("span.Head > span.tooltip").attr("title");
    tooltip.text = cleanText(tooltip.text);
  }
  //* FREQUENCY: sth like this: [{ text: 'S1', title: 'Top 1000 spoken words' },{ text: 'W1', title: 'Top 1000 written words' }]
  let frequency = [];
  const $frequencyEls = $entry.find("span.Head > span.FREQ");
  if ($frequencyEls.length) {
    $frequencyEls.each((i, elem) => {
      const text = $(elem).text();
      const title = $(elem).attr("title");
      frequency.push({ text, title });
    });
  }
  //* PART OF SPEECH: sth like this: "noun"
  let partOfSpeech = "";
  if ($entry.find("span.Head span.POS").text())
    partOfSpeech = $entry.find("span.Head span.POS").text().trim();

  //* REGISTER: sth like: "spoken informal"
  let register = "";
  const $registerEls = $entry.find("span.Head span.REGISTERLAB");
  if ($registerEls.length) {
    $registerEls.each((i, elem) => {
      register = register + $(elem).text() + " ";
    });
  }
  register = register.trim();
  // console.log("register", register);

  //* INFLECTION: sth like: "(grabbed, grabbing)"
  let inflections = $entry.find("span.Inflections").text().trim();

  //* SENSES: a sense is a meaning
  const $senses = $entry.find("span.Sense");
  const sensesScrapedData = $senses.map(async (i, $sense) => {
    let $nonRefSense; // Each sense may contain a cross ref to another page in longman website. If that's the case, I will go to that page and get the sense and put it in $nonRefSense so this element won't ever contain a ref but the actual sense itself.
    //* INDEX: the number of the sense, some number like: 1,2,3, ...
    let index;
    if ($senses.length > 1) index = $($sense).children("span.sensenum").text();
    else index = "";
    //* TITLE: sth like: book_noun_2
    let title = word;
    if ($senses.length > 1) {
      if (partOfSpeech == "phrasal verb") title = title + "_" + `${i + 1}`;
      else title = title + "_" + partOfSpeech + "_" + `${i + 1}`;
    }

    //* LEXUNIT: sth like: "in advance (of something)" or "be obsessing about/over"
    let lexUnit = "";
    if ($($sense).find("span.LEXUNIT").text())
      lexUnit = $($sense).find("span.LEXUNIT").text();
    // console.log("lexUnit", lexUnit);

    //*  CHECKING CROSSREFS
    if (
      $($sense).find("span.Crossref").length &&
      !$($sense).find("span.DEF").length
    ) {
      //TODO: Check and handle crossrefs here
      lexUnit = $($sense).find("span.Crossref span.REFHWD").text();
      lexUnit = cleanText(lexUnit);
      const base_url = "https://ldoceonline.com";
      const uri = $($sense).find("span.Crossref a.crossRef").attr("href");
      const url = base_url + uri;
      $nonRefSense = await getCrossRefSense(url, browser);
    } else {
      $nonRefSense = $sense;
    }

    //* DEFINITION
    let definitionText = "";
    if ($($nonRefSense).find("span.Subsense").length) {
      const $subsenses = $($nonRefSense).find("span.Subsense");
      $subsenses.each((i, $subsense) => {
        const subSenseNum = $($subsense).find("span.sensenum").text() + " ";
        const def = $($subsense).find("span.DEF").text();
        definitionText = definitionText + subSenseNum + def + " " + "\n";
      });
    } else {
      definitionText = $($nonRefSense).find("span.DEF").text();
    }
    definitionText = cleanText(definitionText);
    //*GEO: sth like: "British English"
    let geo = "";
    if ($($nonRefSense).find("span.GEO").length) {
      geo = $($nonRefSense).find("span.GEO").text();
    }
    geo = geo.trim();

    //* F2N BOX: sth like: Register: In everyday English people usually say ...
    let f2n = null;
    if ($($nonRefSense).find("span.F2NBox").length) {
      const heading = $($nonRefSense).find("span.F2NBox span.heading").text();
      let explanation = $($nonRefSense).find("span.F2NBox span.EXPL").text();
      const $f2nExampleEls = $($nonRefSense).find("span.F2NBox span.EXAMPLE");
      let f2nExamples = [];
      $f2nExampleEls.each((i, $f2nExampleEl) => {
        f2nExamples.push($($f2nExampleEl).text());
      });
      if ($($nonRefSense).find("span.F2NBox span.EXAMPLE").length === 0)
        explanation = explanation.replace(":", "");
      f2n = {
        heading,
        explanation,
        examples: f2nExamples,
      };
    }
    //* Sense Registers: sth like: "spoken informal"
    let senseRegisters = $($nonRefSense).find("span.REGISTERLAB").text().trim();

    //* Synonyms:
    let synonyms = [];
    const $synonymEls = $($nonRefSense).find("span.SYN");
    $synonymEls.each((i, $synonymEl) => {
      synonyms.push(
        $($synonymEl).text().replace("SYN", "").replace(",", "").trim()
      );
    });

    //* Oppositions:
    let oppositions = [];
    const $oppositionEls = $($nonRefSense).find("span.OPP");
    $oppositionEls.each((i, $oppositionEl) => {
      synonyms.push(
        $($oppositionEl).text().replace("OPP", "").replace(",", "").trim()
      );
    });

    //* Examples:
    let examples = [];
    if ($($nonRefSense).find("span.Subsense").length) {
      const $subsenses = $($nonRefSense).find("span.Subsense");
      $subsenses.each((_, $subsense) => {
        handleEXAMPLEsGramExasColloExas($subsense, examples, $);
      });
    } else {
      handleEXAMPLEsGramExasColloExas($nonRefSense, examples, $);
    }
    examples = examples.map((ex) => ({ ...ex, text: cleanText(ex.text) }));
    const data = {
      word,
      pronunciation,
      tooltip,
      frequency,
      partOfSpeech,
      register,
      inflections,
      title,
      images: [],
      geo,
      f2n,
      meaning: {
        index: index,
        definition: {
          lexUnit,
          registers: senseRegisters,
          text: definitionText,
          synonyms,
          oppositions,
        },
        translation: "",
        examples,
      },
    };
    return data;
    /////////
  });

  const results = await Promise.all(sensesScrapedData);
  //* Read the data in data.json file:
  const previousdata = readDataFile(searchedWord);

  //* Add new data to old data and write to data.json file:
  writeDataFile(previousdata, results, searchedWord);
}

function readDataFile(searchedWord) {
  const previousDataInJSON = fs.readFileSync(`./${searchedWord}.json`, {
    encoding: "utf-8",
  });
  const previousdata = JSON.parse(previousDataInJSON);

  return previousdata;
}
function writeDataFile(previousdata, newData, searchedWord) {
  const data = [...previousdata, ...newData];
  const dataInJSON = JSON.stringify(data);
  fs.writeFileSync(`./${searchedWord}.json`, dataInJSON);
  console.log(
    `Entry "${newData[0].partOfSpeech}" of word "${searchedWord}" done!!!`
  );
}

// async function readDataFile(searchedWord) {
//   const previousDataInJSON = await fs.promises.readFile(`./${searchedWord}.json`, {
//     encoding: "utf-8",
//   });
//   const previousdata = await JSON.parse(previousDataInJSON);

//   return previousdata;
// }
// async function writeDataFile(previousdata, newData, searchedWord) {
//   const data = [...previousdata, ...newData];
//   const dataInJSON = await JSON.stringify(data);
//   await fs.promises.writeFile(`./${searchedWord}.json`, dataInJSON);
//   console.log(
//   `Entry "${newData[0].partOfSpeech}" of word "${searchedWord}" done!!!`
// );
// }
