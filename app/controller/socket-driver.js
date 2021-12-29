const { Server: SocketServer } = require("socket.io");
const { joinRoom } = require("./controls");
const {
  getGameUpdate,
  gameWin,
  onRestartGame,
  onGameClose,
} = require("./gameController");

const initilize = (httpServer) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("disconnect", () => {
      console.log(
        "user disconnected",
        socket.id,
        "\n",
        new Date().toLocaleString()
      );
    });

    socket.on("USER_ONLINE", (data) => {
      console.log("USER_ONLINE with ", data);
    });

    socket.on("CREATE_ROOM", () => {
      var roomId = Math.random().toString(36).substring(2, 7);
      console.log("Room Created with ID:", roomId);
      socket.join(roomId);
      socket.emit("ROOM_CREATED", roomId);
    });

    socket.on("SEND_JOIN_REQUEST", async (roomId) => {
      joinRoom(io, socket, roomId);
    });

    socket.on("UPDATE_GAME", (matrix) => {
      console.log("UpdateGame", socket.id, "\n", "Matrix", matrix);
      getGameUpdate(socket, matrix);
    });

    socket.on("GAME_WIN", (message) => {
      console.log("GAME_WIN message:", message);
      gameWin(socket, message);
    });

    socket.on("RESTART_GAME", (message) => {
      console.log("RESTART_GAME message:", message);
      onRestartGame(socket, message);
    });

    socket.on("CLOSE_GAME", () => {
      console.log("CLOSE_GAME ", socket.id);
      onGameClose(socket);
    });
  });
};
module.exports = initilize;
