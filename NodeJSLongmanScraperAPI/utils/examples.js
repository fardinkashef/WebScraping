//* This function takes an EXAMPLE element (an element with class of EXAMPLE) and extracts the example data from it:
function handleEXAMPLE($elem, examples, $) {
  examples.push({ type: "example", text: $($elem).text() });
}
//* This function takes an GramExa element (an element with class of GramExa) and extracts the example data from it:
function handleGramExa($elem, examples, $) {
  let grammer = "";
  if ($($elem).children("span.PROPFORMPREP").length)
    grammer = $($elem).children("span.PROPFORMPREP").text();
  else grammer = $($elem).children("span.PROPFORM").text();
  let gloss = $($elem).children("span.GLOSS").text();
  examples.push({ type: "grammer", text: grammer + gloss });
  const exampleEls = $($elem).children("span.EXAMPLE");
  exampleEls.each((_, $exampleEl) =>
    examples.push({ type: "example", text: $($exampleEl).text() })
  );
}
//* This function takes an ColloExa element (an element with class of ColloExa) and extracts the example data from it:
function handleColloExa($elem, examples, $) {
  let collocation = $($elem).children("span.COLLO").text();
  let gloss = $($elem).children("span.GLOSS").text();
  examples.push({
    type: "collocation",
    text: collocation + gloss,
  });
  const exampleEls = $($elem).children("span.EXAMPLE");
  exampleEls.each((_, $exampleEl) =>
    examples.push({ type: "example", text: $($exampleEl).text() })
  );
}

export function handleEXAMPLEsGramExasColloExas($elem, examples, $) {
  $($elem)
    .children("span.EXAMPLE")
    .each((_, $elem) => {
      handleEXAMPLE($elem, examples, $);
    });
  $($elem)
    .children("span.GramExa")
    .each((_, $elem) => {
      handleGramExa($elem, examples, $);
    });
  $($elem)
    .children("span.ColloExa")
    .each((_, $elem) => {
      handleColloExa($elem, examples, $);
    });
}
