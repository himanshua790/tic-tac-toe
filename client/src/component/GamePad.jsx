import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../helper/socket";

import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

import {
  updateGame,
  onGameUpdate,
  onStartGame,
  onGameWin,
  gameWin,
  restartGame,
  onRestartGame,
  closeGame,
  onGameClose,
} from "../helper/GameService";

const GamePad = () => {
  const {
    socket,
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
    resetAll,
  } = useContext(SocketContext);

  const nullMatrix = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const [matrix, setMatrix] = useState(nullMatrix);
  const [gameOver, setGameOver] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);

  // Game Logic
  const checkGameState = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      let row = [];
      for (let j = 0; j < matrix[i].length; j++) {
        row.push(matrix[i][j]);
      }

      if (row.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (row.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      let column = [];
      for (let j = 0; j < matrix[i].length; j++) {
        column.push(matrix[j][i]);
      }

      if (column.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (column.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    if (matrix[1][1]) {
      if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }

      if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }
    }

    if (matrix.every((m) => m.every((v) => v !== null))) {
      return [true, true];
    }
    return [false, false];
  };

  const updateGameMatrix = (column, row, symbol) => {
    console.log("Update Gmae", column, row, symbol);
    const newMatrix = [...matrix];

    if (newMatrix[row][column] === null || newMatrix[row][column] === "null") {
      console.log("Matrix set with updateGameMatrix");
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    }
    if (socket) {
      updateGame(socket, newMatrix);
      const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);
      if (currentPlayerWon && otherPlayerWon) {
        gameWin(socket, "The Game is a TIE!");
        setGameOver(true);
        alert("The Game is a TIE!");
      } else if (currentPlayerWon && !otherPlayerWon) {
        gameWin(socket, "You Lost!");
        setGameOver(true);
        alert("You Won!");
      }

      setPlayerTurn(false);
    }
  };

  const handleGameUpdates = (remove = false) => {
    console.log("HandleGameUpdates");
    if (socket) {
      console.log("Matrix set with HandleGameUpdates");
      onGameUpdate(
        socket,
        (newMatrix) => {
          setMatrix(newMatrix);
          checkGameState(newMatrix);
          setPlayerTurn(true);
        },
        remove
      );
    }
  };

  const handleGameStart = (remove = false) => {
    if (socket) {
      onStartGame(
        socket,
        (option) => {
          setPlayerSymbol(option.symbol);
          setGameStarted(true);
          if (option.start) {
            setPlayerTurn(true);
          } else {
            setPlayerTurn(false);
          }
        },
        remove
      );
    }
  };

  const handleGameWin = (remove = false) => {
    if (socket)
      onGameWin(
        socket,
        (message) => {
          console.log("Here", message);
          setPlayerTurn(false);
          alert(message);
          setGameOver(true);
        },
        remove
      );
  };

  const handleRestartGame = () => {
    if (socket) {
      restartGame(socket, "Opponent wants to Play again");
      setViewDialog(false);
      setPlayerTurn(false);
      setMatrix(nullMatrix);
      setGameStarted(true);
      setGameOver(false);
    }
  };

  const handleOnRestartGame = (remove = false) => {
    if (socket) {
      onRestartGame(
        socket,
        (message) => {
          console.log(" on Restart Game message:", message);
          setViewDialog(true);
        },
        remove
      );
    }
  };

  const handleCloseGame = () => {
    if (socket) {
      closeGame(socket);
      resetAll();
    }
  };

  const handleOnCloseGame = (remove = false) => {
    if (socket) {
      onGameClose(
        socket,
        (roomId) => {
          console.log("onCloseGame");
          resetAll();
        },
        remove
      );
    }
  };

  const handleDialogClose = () => {
    setViewDialog(false);
  };

  const handleRestartTheGame = () => {
    setViewDialog(false);
    setPlayerTurn(true);
    setMatrix(nullMatrix);
    setGameStarted(true);
    setGameOver(false);
  };

  useEffect(() => {
    handleGameUpdates();
    handleGameStart();
    handleGameWin();
    handleOnRestartGame();
    handleOnCloseGame();

    return () => {
      handleGameUpdates(true);
      handleGameStart(true);
      handleGameWin(true);
      handleOnRestartGame(true);
      handleOnCloseGame(true);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="GameContainer" style={GameContainer}>
      {!isGameStarted && (
        <h2>waiting for Other Player to Join to Start the Game</h2>
      )}
      {!isGameStarted || !isPlayerTurn ? (
        <div className="PlayerStopper" style={PlayStopperStyle}></div>
      ) : null}
      {gameOver && isGameStarted ? (
        <div className="PlayerStopper" style={PlayStopperStyle}>
          {viewDialog ? (
            <>
              <Dialog open={viewDialog} onClose={handleDialogClose}>
                <DialogTitle>Do you want to restart the game?</DialogTitle>

                <DialogActions>
                  <Button
                    onClick={handleRestartTheGame}
                    color="primary"
                    autoFocus
                  >
                    Yes
                  </Button>
                  <Button onClick={handleCloseGame} color="primary">
                    No
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleRestartGame}
              >
                Restart Game
              </Button>
            </>
          )}
        </div>
      ) : null}
      {matrix.map((row, rowIndex) => {
        return (
          <div className="RowContainer" key={rowIndex} style={RowContainer}>
            {row.map((column, columnIndex) => {
              var Border = {
                borderRight: columnIndex < 2 ? Cell.borderRight : "",
                borderLeft: columnIndex > 0 ? Cell.borderLeft : "",
                borderBottom: rowIndex < 2 ? Cell.borderBottom : "",
                borderTop: rowIndex > 0 ? Cell.borderTop : "",
              };
              return (
                <div
                  className="Cell"
                  key={columnIndex}
                  style={{ ...Cell, ...Border }}
                  onClick={() => {
                    updateGameMatrix(columnIndex, rowIndex, playerSymbol);
                  }}
                >
                  {column && column !== "null" ? (
                    column === "x" ? (
                      <div className="X" style={X}>
                        X
                      </div>
                    ) : (
                      <div className="O" style={O}>
                        O
                      </div>
                    )
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
      {isGameStarted && isPlayerTurn ? (
        <h3>Your Turn</h3>
      ) : (
        <h3>Opponent's Turn</h3>
      )}
    </div>
  );
};

// const PlayerStopper= ({children})=>{
//   return <div className="PlayerStopper" style={PlayStopperStyle}>{children}</div>
// }
const GameContainer = {
  display: "flex",
  flexDirection: "column",
  fontFamily: '"Zen Tokyo Zoo", cursive',
  position: "relative",
  justifyContent: "center",
};

const RowContainer = { width: "100%", display: "flex" };

const Cell = {
  width: "13em",
  height: "9em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "20px",
  cursor: "pointer",
  borderTop: "3px solid #8e44ad",
  borderLeft: "3px solid #8e44ad",
  borderBottom: "3px solid #8e44ad",
  borderRight: "3px solid #8e44ad",
  "::hover": { backgroundColor: "#8d44ad28" }, // hover pusdo class
};

const PlayStopperStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  bottom: "0",
  left: "0",
  zIndex: "99",
  cursor: "default",
};

const X = { fontSize: "100px", color: "#8e44ad", ":after": { content: "X" } }; // psudoclass after
const O = { fontSize: "100px", color: "#8e44ad", ":after": { content: "O" } }; // psudoclass after
export default GamePad;
