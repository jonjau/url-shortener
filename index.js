const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

const ShortURL = require("./models/url");

const app = express();
const PORT = 3000;
const CONNECTION = fs.readFileSync("mongo.config", "utf8");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const allData = await ShortURL.find();
  res.render("index", { shortUrls: allData });
});

app.get("/:shortid", async (req, res) => {
  // grab the :shortid param
  const shortid = req.params.shortid;

  // perform the mongoose call to find the long URL
  const rec = await ShortURL.findOne({ short: shortid });

  // if null, set status to 404 (res.sendStatus(404))
  if (!rec) return res.sendStatus(404);

  // if not null, increment the click count in database
  rec.clicks++;
  await rec.save();

  // redirect the user to original link
  res.redirect(rec.full);
});

app.post("/short", async (req, res) => {
  // Grab the fullUrl parameter from the req.body
  const fullUrl = req.body.fullUrl;
  console.log("URL requested: ", fullUrl);

  // insert and wait for the record to be inserted using the model
  const record = new ShortURL({
    full: fullUrl,
  });

  await record.save();

  res.redirect("/");
});

// setup mongodb connection
mongoose.connect(CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("open", async () => {
  // wait for mongodb connection before server starts

  await ShortURL.create({ full: "http://google.com" });
  await ShortURL.create({ full: "http://duckduckgo.com" });

  app.listen(PORT, () => {
    console.log(`Server started on: ${PORT}`);
  });
});
