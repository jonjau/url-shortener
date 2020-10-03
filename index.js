const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const PORT = 3000;
const CONNECTION = fs.readFileSync('mongo.config', 'utf8')

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/short", (req, res) => {
  const db = mongoose.connection.db;
  // insert record in 'test' collection
  db.collection("test").insertOne({ testCompleted: 1 });

  res.json({ ok: 1 });
});

app.get("/short", (req, res) => {
  res.send("Hello from short");
});

// setup mongodb connection
mongoose.connect(CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('open', () => {
  // wait for mongodb connection before server starts
  app.listen(PORT, () => {
    console.log(`Server started on: ${PORT}`);
  })
});
