const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
// app.use(require("./routes/record"));
// get driver connection
const dbo = require("./database/connection");

//app.use("/bookings/", require("./routes/bookingsRoute"));

// app.get("/", function (req, res) {
//   res.send("Express is working!");
// });

// app.listen(port, () => {
//   // perform a database connection when server starts
//   dbo.connectToServer(function (err) {
//     if (err) console.error(err);
//   });
//   console.log(`Server is running on port: ${port}`);
// });

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
