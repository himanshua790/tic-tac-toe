import React, { useContext } from "react";
import { SocketContext } from "../helper/socket";
import Computer from "./Computer";
// import GamePad from "./GamePad";
import JoinMatch from "./JoinMatch";
import NewGame from "./NewGame";

const Home = () => {
  const {
    vsComputer,
    setVsComputer,
    isInRoom,
    setInRoom,
    newGame,
    setNewGame,
    selection,
    setSelection,
    backToHome,
  } = useContext(SocketContext);
  const startNewGame = (response) => {
    setNewGame(response);
    setInRoom(!response);
  };

  const playWithPlayer = (response) => {
    setVsComputer(response);
    setSelection(true);
  };

  return (
    <div className="App">
      <div className="heading">
        <h1>Tic Tac Toe</h1>
      </div>
      <div
        className="subheading"
        style={{ textAlign: "end", marginRight: "100px" }}
      >
        <h3>by: Himanshu Soni</h3>
      </div>
      <div className="MainBody" style={{ marginTop: "100px" }}>
        {!isInRoom && !newGame ? (
          <>
            <button onClick={() => startNewGame(true)}>Start New Match</button>
            <button onClick={() => startNewGame(false)}>Join Match</button>
          </>
        ) : isInRoom && !newGame ? (
          <>
            <button onClick={backToHome}>Back To Home</button>
            <JoinMatch />
          </>
        ) : !isInRoom && newGame && !selection ? (
          <>
            <button onClick={backToHome}>Back To Home</button>
            <button onClick={() => playWithPlayer(true)}>Vs Player</button>
            <button onClick={() => playWithPlayer(false)}>Vs Computer</button>
          </>
        ) : vsComputer && newGame && selection ? (
          <>
            <NewGame />
          </>
        ) : (
          <>
            <button onClick={backToHome}>Back To Home</button>
            <Computer />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
