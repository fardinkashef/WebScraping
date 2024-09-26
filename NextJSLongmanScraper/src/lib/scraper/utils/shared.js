export function cleanText(text) {
  let cleanedText = text.replaceAll("/n", "").replaceAll("\n", "");
  while (cleanedText.includes("  ")) {
    cleanedText = cleanedText.replaceAll("  ", " ");
  }
  return cleanedText.trim();
}
