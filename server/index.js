// server/index.js

require("dotenv").config();

const app = require("./src/app");
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

mongoose.connect(uri);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Mongo DB Atlas has been connected!!!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});