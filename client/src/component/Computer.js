import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Board from "../page-component/Board";
import Minimax from "../page-component/minimax";
const styles = {
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, auto)",
    width: "306px",
    margin: "16rem auto 0 auto",
  },
  settings_gui: {
    width: "60%",
    height: "auto",
    marginTop: "7rem",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
  },
  option: {
    width: "100%",
    marginBottom: "5px",
    padding: "5px",
    backgroundColor: "#322e2f",
    color: "#e2d810",
    fontSize: "20px",
    cursor: "pointer",
  },
  option_hover: { opacity: "0.9" },
  theme_switcher: { position: "absolute", top: "1rem", right: "1rem" },
  setting_info: {
    fontSize: "larger",
    fontWeight: "bold",
    color: "crimson",
    fontFamily: '"Maven Pro", sans-serif',
  },
  github_link: {
    position: "absolute",
    right: "10px",
    bottom: "10px",
    letterSpacing: "3px",
    fontFamily: '"Quicksand", sans-serif',
    fontSize: "23px",
    color: "#2b2424",
  },
};

function Game() {
  // Functions
  const handleClick = (event) => {
    const targetSpot = event.target;
    const targetSpotID = targetSpot.getAttribute("id");
    const indexesOfTargetSpot = coordination[targetSpotID];

    if (targetSpot.innerText !== EMPTY) {
      setShowWarningModal(!showWarningModal);
    } else {
      if (settings.gameMode === "PvC") {
        targetSpot.innerText = players.user;
        updateBoardState(...indexesOfTargetSpot, players.user);

        if (!minimax.getDepth()) {
          setShowResultModal(!showResultModal);
        } else {
          const bestValuesForComputer = minimax.max();
          updateBoardState(
            bestValuesForComputer.row,
            bestValuesForComputer.col,
            players.opponnent
          );

          if (minimax.isFinished()) {
            setShowResultModal(!showResultModal);
          }
        }
      } else {
        let countOfX = 0;
        let countOfO = 0;
        let turn;

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (board[i][j] === "X") countOfX += 1;
            else if (board[i][j] === "O") countOfO += 1;
          }
        }

        if (!countOfX && !countOfO) {
          turn = "X";
        } else if (countOfX && !countOfO) {
          turn = "O";
        } else if (countOfX === countOfO) {
          turn = "X";
        } else if (countOfX > countOfO) {
          turn = "O";
        } else if (countOfO > countOfX) {
          turn = "X";
        }

        updateBoardState(...indexesOfTargetSpot, turn);
        if (minimax.isFinished()) {
          setShowResultModal(!showResultModal);
        }
      }
    }
  };

  const updateBoardState = (row, col, player) => {
    let currentBoard = board;
    currentBoard[row][col] = player;
    setBoard(currentBoard);
    forceUpdate();
  };

  const playAgain = () => {
    setShowResultModal(!showResultModal);
    setBoard(initialBoard);
  };

  const closeWarningModal = () => {
    setShowWarningModal(!showWarningModal);
  };

  // Others (variables, states, JSX ...)
  const EMPTY = "";
  const initialBoard = [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const forceUpdate = React.useReducer(() => ({}))[1];

  const settings = {
    user: "X",
    gameMode: "PvC",
  };
  const players = {
    user: settings.user,
    opponnent: settings.user === "X" ? "O" : "X",
  };
  const minimax = new Minimax(board, players);
  let modalDatas = {
    title: undefined,
    bodyText: undefined,
  };
  const coordination = {
    1: [0, 0],
    2: [0, 1],
    3: [0, 2],
    4: [1, 0],
    5: [1, 1],
    6: [1, 2],
    7: [2, 0],
    8: [2, 1],
    9: [2, 2],
  };

  if (showResultModal) {
    let finalPoint = minimax.returnValueOfPosition();
    if (finalPoint === 0) {
      modalDatas.title = "Draw";
      modalDatas.bodyText = "Match Has Ended with Draw !";
    }
    if (finalPoint === 1) {
      modalDatas.title = "Opponnent";
      modalDatas.bodyText = "Opponnent Has Won !";
    }
    if (finalPoint === -1) {
      modalDatas.title = "User";
      modalDatas.bodyText = "User Has Won !";
    }
  }

  if (
    settings.gameMode === "PvC" &&
    players.user === "O" &&
    board.toString() === initialBoard.toString() // "Objects" don't equal to each other even though they're the same, so we should turn the objects into string forms for a true comparison.
  ) {
    const bestValuesForComputer = minimax.max();
    updateBoardState(
      bestValuesForComputer.row,
      bestValuesForComputer.col,
      players.opponnent
    );
  }

  return (
    <>
      <Modal show={showResultModal}>
        <Modal.Header>
          <Modal.Title>{modalDatas.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalDatas.bodyText}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={playAgain}>Play Again</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showWarningModal}>
        <Modal.Header>
          <Modal.Title>You Cannot Move to a Filled Spot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You've tried to move to a filled spot but you it's illegal.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeWarningModal}>
            Close
          </Button>
          <Button onClick={closeWarningModal}>OK</Button>
        </Modal.Footer>
      </Modal>

      <Board board={board} onClickedToSpots={handleClick} />
    </>
  );
}

export default Game;
