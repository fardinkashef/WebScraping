import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/dark";
import CopyButton from "./CopyButton";
SyntaxHighlighter.registerLanguage("json", json);

type CodeBlockProps = {
  code: string;
};

function CodeBlock({ code }: CodeBlockProps) {
  return (
    <div className="relative p-4 w-full max-w-[800px]">
      <CopyButton code={code} />
      <SyntaxHighlighter
        language="json"
        style={dark}
        wrapLines={true}
        // wrapLongLines={true}
        customStyle={{
          height: "30rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
export default CodeBlock;
