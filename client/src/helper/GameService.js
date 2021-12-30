export const updateGame = async (socket, gameMatrix) => {
  socket.emit("UPDATE_GAME", { matrix: gameMatrix });
};

export const onGameUpdate = async (socket, listener, remove = false) => {
  if (remove) {
    console.log("socket OFF : ON_GAME_UPDATE");
    socket.off("ON_GAME_UPDATE", ({ matrix }) => listener(matrix));
  } else {
    socket.on("ON_GAME_UPDATE", ({ matrix }) => listener(matrix));
  }
};

export const onStartGame = async (socket, listener, remove = false) => {
  if (remove) {
    socket.off("START_GAME", listener);
    console.log("socket OFF : START_GAME");
  } else {
    socket.on("START_GAME", listener);
  }
};

export const gameWin = async (socket, message) => {
  socket.emit("GAME_WIN", { message });
};

export const onGameWin = async (socket, listener, remove = false) => {
  if (remove) {
    socket.off("ON_GAME_WIN", ({ message }) => {
      listener(message);
    });
  } else {
    socket.on("ON_GAME_WIN", ({ message }) => {
      listener(message);
    });
  }
};

export const restartGame = async (socket, message) => {
  socket.emit("RESTART_GAME", { message });
};
export const onRestartGame = async (socket, listener, remove = false) => {
  if (remove) {
    socket.off("ON_RESTART_GAME", ({ message }) => {
      console.log("ON_RESTART_GAME message:", message);
      listener(message);
    });
  } else {
    socket.on("ON_RESTART_GAME", ({ message }) => {
      console.log("ON_RESTART_GAME message:", message);
      listener(message);
    });
  }
};
export const closeGame = async (socket) => {
  socket.emit("CLOSE_GAME");
};
export const onGameClose = async (socket, listener, remove = false) => {
  if (remove) {
    socket.off("ON_GAME_CLOSE", (roomId) => {
      console.log("ON_GAME_CLOSE roomID:", roomId);
      listener(roomId);
    });
  } else {
    socket.on("ON_GAME_CLOSE", (roomId) => {
      console.log("ON_GAME_CLOSE roomID:", roomId);
      listener(roomId);
    });
  }
};
