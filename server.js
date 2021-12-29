const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const http = require("http");
const app = express();
const PORT = process.env.PORT || 5000;
const SocketIo = require("./app/controller/socket-driver");

//production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendfile(path.join((__dirname = "client/build/index.html")));
  });
} else {
  //Static file declaration
  app.use(express.static(path.join(__dirname, "client/build")));
}
const httpServer = http.createServer(app);
SocketIo(httpServer);

//start server
httpServer.listen(PORT, (req, res) => {
  console.log(`server listening on port: ${PORT}`);
});
