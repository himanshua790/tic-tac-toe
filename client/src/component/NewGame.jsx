import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import GamePad from "./GamePad";
import { SocketContext } from "../helper/socket";
const NewGame = () => {
  const { socket, isInRoom, setInRoom, backToHome } = useContext(SocketContext);
  const [viewRoom, setViewRoom] = useState(null);
  const roomId = useRef(null);
  const [joined, setJoined] = useState(false);

  const handleRoomCreated = useCallback((room) => {
    console.log("roomId is set", room);
    roomId.current = room;
    setInRoom(true);
    setViewRoom(room);
    return () => {
      socket.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpponentJoined = (room) => {
    console.log("opponent joined", room);
    console.log("Current ROom is :", roomId.current);

    if (roomId.current === room) {
      setJoined(true);
      console.log("Opponent join your room");
    }
  };

  useEffect(() => {
    socket.emit("CREATE_ROOM");

    socket.on("ROOM_CREATED", handleRoomCreated);
    socket.on("OPPONENT_JOINED", handleOpponentJoined);

    return () => {
      socket.off("ROOM_CREATED", handleRoomCreated);
      socket.off("OPPONENT_JOINED", handleOpponentJoined);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={backToHome}>Back to Home</button>
      {joined && isInRoom ? (
        <GamePad />
      ) : (
        <p>
          Waiting for other player to join please share your room ID: {viewRoom}
        </p>
      )}
    </div>
  );
};

export default NewGame;
