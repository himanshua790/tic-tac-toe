const joinRoom = (io, socket, roomId) => {
  console.log("SEND_JOIN_REQUEST with ", roomId);
  if (io.sockets.adapter.rooms.get(roomId).size === 1) {
    socket.join(roomId);
    socket.emit("JOIN_REQUEST_ACCEPTED", roomId);
    socket.to(roomId).emit("OPPONENT_JOINED", roomId);

    // start Game
    socket.emit("START_GAME", { start: true, symbol: "x" });
    socket.to(roomId).emit("START_GAME", { start: false, symbol: "o" });
    
  } else if (io.sockets.adapter.rooms.get(roomId).size === 2) {
    socket.emit("ERROR", {
      message: "Room is full, Please join another room or create new.",
    });
  } else {
    socket.emit("ERROR", {
      message: "Room doesn't exists!",
    });
  }
  console.log("ROOM DATA", io.sockets.adapter.rooms.get(roomId).size);
};
module.exports = { joinRoom };
