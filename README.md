# Longman Scraper

This repo includes a Next.js web application that scrapes [Longman Dictionary](https://ldoceonline.com) website and generates an array of JSON objects, each detailing the dictionary information for a specific sense of the word

## 🎯 Goal

The goal of this Next.js web application is to efficiently gather and organize dictionary data from the [Longman Dictionary](https://ldoceonline.com) website. By automating the process of looking up words and extracting their definitions, examples and etc, this tool eliminates the need for manual copy-pasting. Users can simply enter a word, and the application will generate an array of JSON objects, each containing detailed information for every sense of the word.

## 👀 Demo

Navigate to [LongmanScraper](https://longman-scraper.onrender.com/). Have fun!

## 🚀 Quick Start For Developers

First go to your projects folder and clone the repository by running this command in your terminal:

```
git clone https://github.com/fardinkashef/WebScraping.git
```

This repository includes three similar projects:

- NodeJSLongmanScraper: This folder contains a Node.js application that receives an array of words (each word as a string), scrapes the Longman dictionary, and generates a .json file for each word containing the scraped data.

- NodeJSLongmanScraperAPI: This folder contains a Node.js API server that receives a word through an HTTP "GET" request at "/api/:word" and responds with an array of JSON objects containing the scraped data.

- NextJSLongmanScraper: This folder contains a Next.js application that receives a word through an input field, scrapes the Longman dictionary, and displays an array of JSON objects on the screen, each containing the scraped data, along with a copy button.

So ignore the other two projects and change your directory to the Next.js project folder:

```
cd WebScraping/NextJSLongmanScraper
```

Now you're in the Next.js project. Then, install the dependencies:

```
npm install
```

Next, run this command to start the development server:

```
npm run dev
```

Finally open your browser and navigate to this URL to visit the website:

```
http://localhost:3000
```
