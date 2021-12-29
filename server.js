const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

const roomData = {};
const SocketIo = require("./app/controller/socket-driver");
SocketIo(httpServer, roomData);

//production mode
if (process.env.NODE_ENV === "production") {
  httpServer.use(express.static(path.join(__dirname, "client/build")));
  httpServer.get("*", (req, res) => {
    res.sendfile(path.join((__dirname = "client/build/index.html")));
  });
} else {
  //Static file declaration
  httpServer.use(express.static(path.join(__dirname, "client/build")));
  //build mode
  httpServer.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/public/index.html"));
  });
}

//start server
httpServer.listen(port, (req, res) => {
  console.log(`server listening on port: ${PORT}`);
});
