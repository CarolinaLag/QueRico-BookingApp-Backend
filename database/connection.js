// const { MongoClient } = require("mongodb");
// const mongoose = require("mongoose");
// const Db = process.env.MONGODB_URI;
// const client = new MongoClient(Db, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// let _db;

// module.exports = {
//   connectToServer: function (callback) {
//     client.connect(function (err, db) {
//       // Verify we got a good "db" object
//       if (db) {
//         _db = db.db("booking-app");
//         console.log("Successfully connected to MongoDB.");
//       }
//       return callback(err);
//     });
//   },

//   getDb: function () {
//     return _db;
//   },
// };

// const mongoose = require("mongoose");

// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// };

// let db = mongoose.connect(process.env.MONGODB_URI, options, (err) => {
//   console.log("connected to db");
//   if (err) {
//     console.log(err);
//     return;
//   }
// });

// module.exports = db;
