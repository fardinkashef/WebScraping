"use client";
import scrape from "@/lib/scraper";
import { useRef, useState } from "react";

type HeaderProps = {
  setScrapedData: any;
};

function Header({ setScrapedData }: HeaderProps) {
  const [scraping, setScraping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleScrape = async () => {
    setScraping(true);
    if (!inputRef.current) return;
    try {
      const res = await scrape(inputRef.current.value);
      setScrapedData(res);
    } catch (error) {
      console.log("this error happened:", error);
    } finally {
      setScraping(false);
    }
  };
  return (
    <div className="bg-blue-950 w-full flex flex-col gap-2 justify-center items-center h-40 ">
      <h1 className="text-white text-xl">Longman Dictionary Scraper</h1>

      <div className="bg-white flex p-1 rounded-sm ">
        <input
          type="text"
          className="outline-none text-center"
          placeholder="Type a word"
          ref={inputRef}
        />
        <button
          className={` text-white p-1 rounded w-20 ${
            scraping ? "bg-red-400" : "bg-red-600 "
          } `}
          onClick={handleScrape}
          disabled={scraping}
        >
          {!scraping ? "Scrape" : "Scraping"}
        </button>
      </div>
    </div>
  );
}

export default Header;
