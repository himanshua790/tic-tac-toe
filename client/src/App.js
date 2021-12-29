import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import "./App.css";
import { SocketContext, socket } from "./helper/socket";

export default function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState("x");
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [vsComputer, setVsComputer] = useState(false);
  const [newGame, setNewGame] = useState(false);
  const [selection, setSelection] = useState(false);
  const backToHome = () => {
    setInRoom(false);
    setVsComputer(false);
    setNewGame(false);
    setSelection(false);
  };
  const resetAll = () => {
    setInRoom(false);
    setPlayerSymbol("x");
    setPlayerTurn(false);
    setGameStarted(false);
    setVsComputer(false);
    setNewGame(false);
    setSelection(false);
  };
  const gameContextValue = {
    newGame,
    setNewGame,
    isInRoom,
    setInRoom,
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
    socket,
    vsComputer,
    setVsComputer,
    selection,
    setSelection,
    backToHome,
    resetAll,
  };

  return (
    <SocketContext.Provider value={gameContextValue}>
      <div className="AppContainer">
        <div className="WelcomeText">
          <div className="MainContainer">
            <Home />
          </div>
        </div>
      </div>
    </SocketContext.Provider>
  );
}
