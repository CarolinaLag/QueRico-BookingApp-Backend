const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
app.use(cors());
app.use(express.json());

app.use("/", require("./routes/bookingRoute"));

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

mongoose.connect(process.env.MONGODB_URI, options, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  app.listen(process.env.PORT || 3001, () => {
    console.log("App is running");
  });
});
