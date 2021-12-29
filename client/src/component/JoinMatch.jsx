import React, {
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { SocketContext } from "../helper/socket";
import GamePad from "./GamePad";
const JoinMatch = ({ userId = "12312" }) => {
  const room = useRef(null);
  const { socket } = useContext(SocketContext);

  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState(null);

  const handleInviteAccepted = useCallback((roomId) => {
    console.log("HasndleInviteAccepted");
    setJoined(true);
    setRoomId(roomId);
  }, []);
  const handleInviteDeclined = useCallback((error) => {
    console.log("Can not join this Room ID", error);
  }, []);

  const handleJoinMatch = useCallback(
    (e) => {
      e.preventDefault();
      console.log("handleJoinChat");
      socket.emit("SEND_JOIN_REQUEST", room.current.value);
    },
    [socket]
  );

  useEffect(() => {
    socket.emit("USER_ONLINE", userId);

    socket.on("JOIN_REQUEST_ACCEPTED", handleInviteAccepted);
    socket.on("ERROR", handleInviteDeclined);

    return () => {
      socket.off("JOIN_REQUEST_ACCEPTED", handleInviteAccepted);
      socket.off("ERROR", handleInviteDeclined);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {joined ? (
        <GamePad room={roomId} playerSymbol="o" />
      ) : (
        <>
          <form onSubmit={handleJoinMatch} className="joinMatch">
            <label>Please Enter Room ID</label>
            <input
              id="choose"
              name="roomId"
              placeholder="Room ID"
              type="text"
              ref={room}
              minLength="5"
              maxLength="5"
            />
            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </div>
  );
};
export default JoinMatch;
