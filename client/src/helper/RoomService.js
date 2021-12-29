export const createRoom = (socket, listener) => {
    socket.emit("CREATE_ROOM",listener);
};

const error = (socket,listener)=>{
    socket.on("ERROR", listener);
}
const joinRequest = (socket,listener)=>{
    socket.on("JOIN_REQUEST_ACCEPTED", listener);
    
}

// socket.on("ROOM_CREATED", handleRoomCreated);

// socket.on("OPPONENT_JOINED", handleOpponentJoined);