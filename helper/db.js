const mongoose = require("mongoose");

const connectDB = async () => {
  const mongourl =
    "mongodb+srv://admin:JX3moPcdhmmCFUi4@blackcluster.y5jrx.mongodb.net/TicTacToe";
  mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  console.log("monogo usrl", mongourl);
  try {
    db.on("connecting", function () {
      console.log("connecting to MongoDB...");
    });
    db.on("error", function (error) {
      console.error("Error in MongoDb connection: " + error);
      mongoose.disconnect();
    });
    db.on("connected", function () {
      console.log("MongoDB connected!");
    });
    db.once("open", function () {
      console.log("MongoDB connection opened!");
    });
    db.on("reconnected", function () {
      console.log("MongoDB reconnected!");
    });
    db.on("disconnected", async function () {
      console.log("MongoDB disconnected!");
      await mongoose.connect(mongourl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        auto_reconnect: true,
      });
    });
    await mongoose.connect(mongourl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      auto_reconnect: true,
    });
    console.log(mongourl);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
