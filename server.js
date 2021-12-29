const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const app = express();
const PORT = process.env.PORT || 8888;
const httpServer = http.createServer(app);

const roomData = {};
const SocketIo = require("./app/controller/socket-driver");
SocketIo(httpServer, roomData);

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
