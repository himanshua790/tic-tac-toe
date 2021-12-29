const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const mongoose = require("mongoose");

// const connectDB = require("./helper/db");
// connectDB();

const roomData = {};
const SocketIo = require("./app/controller/socket-driver");
SocketIo(httpServer, roomData);

app.get("/api", (req, res) => {
  res.json({ message: JSON.stringify(roomData) });
});
app.get("/close-server", (req, res) => {
  mongoose.connection.close(function () {
    console.log(
      "Mongoose default connection disconnected through app termination;"
    );
    process.exit(0);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
