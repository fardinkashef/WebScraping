import express from "express";
import scrape from "./utils/scraper.js";
import HttpError from "./utils/http-error.js";
import cors from "cors";

const app = express();
//Simple Usage (Enable All CORS Requests)
app.use(cors());
app.get("/api/:word", async (req, res) => {
  const word = req.params.word;
  console.log(`Got a request for word: ${word}`);
  try {
    const data = await scrape(word);
    res.json(data);
  } catch (error) {
    console.log("This error happened while scraping the word:", error);
  }
});
app.get("/api", (req, res) => {
  res.send("Render server is up and running!");
});

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});
app.use((err, req, res, next) => {
  console.log("An ERRoR happened:", err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
app.listen(process.env.PORT || 5000, () => console.log("connected to port"));

// scrape("bear");
