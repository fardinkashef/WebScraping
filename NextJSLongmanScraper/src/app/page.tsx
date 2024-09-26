"use client";
import CodeBlock from "@/components/CodeBlock";
import Header from "@/components/Header";
import { useState } from "react";

export default function Home() {
  const [scrapedData, setScrapedData] = useState("");

  return (
    <div className="flex flex-col items-center bg-gray-600 min-h-screen">
      <Header setScrapedData={setScrapedData} />
      {scrapedData && <CodeBlock code={scrapedData} />}
    </div>
  );
}
