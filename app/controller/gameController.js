const getSocketGameRoom = (socket) => {
  const socketRooms = Array.from(socket.rooms.values()).filter(
    (r) => r !== socket.id
  );
  const gameRoom = socketRooms && socketRooms[0];

  return gameRoom;
};

const getGameUpdate = (socket, message) => {
  var gameRoom = getSocketGameRoom(socket);
  console.log("GetGameUpdate GameRoom :", gameRoom, "\nMatrix:", message);
  socket.to(gameRoom).emit("ON_GAME_UPDATE", message);
};

const gameWin = (socket, message) => {
  var gameRoom = getSocketGameRoom(socket);
  socket.to(gameRoom).emit("ON_GAME_WIN", message);
};
const onRestartGame = (socket, message) => {
  var gameRoom = getSocketGameRoom(socket);
  socket.to(gameRoom).emit("ON_RESTART_GAME", message);
};
const onGameClose = (socket) => {
  var gameRoom = getSocketGameRoom(socket);
  // leave room
  socket.to(gameRoom).emit("ON_GAME_CLOSE", gameRoom);
  socket.leave(gameRoom);
};
module.exports = { getGameUpdate, gameWin, onRestartGame, onGameClose };
