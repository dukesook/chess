import ChessBoard from './ChessBoard.mjs';
import BoardSquare from './BoardSquare.mjs';
import Gui from './ChessGui.mjs';
import { PieceColor } from './Pieces.mjs';
console.log('loading chess.mjs');

const chessboardHTML = document.getElementById('chessboard');
const resetButton = document.getElementById('reset-button');

// State Machine
const State = Object.freeze({
  WHITES_TURN: 0,
  WHITE_MOVING: 1,
  BLACKS_TURN: 2,
  BLACK_MOVING: 3,
  GAME_OVER: 4,
})

const Chess = {
  board: null, // class ChessBoard
  selectedSquare: null, // The square with the piece that player has selected to move
  state: State.WHITES_TURN,

  init: function() {
    Chess.board = new ChessBoard();
    Chess.board.print();
    Gui.initBoard(Chess.board, chessboardHTML, Chess.onclickSquare);
    Chess.setState(State.WHITES_TURN);
  },

  onclickSquare: function(square) {
    BoardSquare.must_be(square);

    // TODO - move PIECE_COLOR up a level
    //        Since the controller needs access to it,
    //        The controller can just create it and pass it down.
    // But should a Piece know it's colors?
    // Answer: No!! A Piece should be tied to just white or black:
    //              What is you want blue pieces? Or clear? The piece
    //              Needs to know that it has a color, let the high-level
    //              Controller decide what that is.


    const state = Chess.state;
    if (state == State.WHITES_TURN) {
      Chess.handlePlayersTurn(square, PieceColor.WHITE); // White Selected Their Piece to Move
    }
    else if (state == State.WHITE_MOVING) {
      Chess.handlePlayerMoving(square, PieceColor.WHITE); // White selected a destination for their piece
    }
    else if (state == State.BLACKS_TURN) {
      Chess.handlePlayersTurn(square, 'black'); // Black Selected Their Piece to Move
    }
    else if (state == State.BLACK_MOVING) {
      Chess.handlePlayerMoving(square, PieceColor.BLACK); // Black selected a destination for their peice
    }
    else if (state == State.GAME_OVER) {
      console.log('TODO: RESET GAME');
    }
  },


  handlePlayersTurn: function(square, playerColor) {
    BoardSquare.must_be(square);

    // Select Square with Piece
    const piece = square.piece;
    if (!piece) {
      console.log('You can only select a square with a piece on it');
      return;
    }

    // Select Team piece
    const color = piece.color;
    if (color != playerColor) {
      console.log('You must select your own pieces');
      return;
    }

    // Success
    Chess.selectedSquare = square;
    Gui.highlightSquare(square);
    Chess.state = Chess.getNextState();
    console.log('VALID: Moving to state', Chess.state);

  },


  handlePlayerMoving: function(toSquare, playerColor) {
    const fromSquare = Chess.selectedSquare;
    BoardSquare.must_be(toSquare);
    BoardSquare.must_be(fromSquare);
    
    try {

      // Move Piece
      Chess.board.move_piece(fromSquare, toSquare); // throws error if invalid
      Chess.board.print();

      // Play Sound
      playMoveSound();

      // Update Gui
      Gui.movePiece(fromSquare.container, toSquare.container);
  
      // Update State
      let gameOver = Chess.board.kingCaptured;
      if (gameOver) {
        Chess.setState(State.GAME_OVER);
      }
      else {
        const nextState = Chess.getNextState();
        Chess.setState(nextState);
      }

    }
    catch (e) {
      console.error(e);
      Chess.resetPlayerTurn(playerColor);
    }


    Gui.unhighlightSquare(fromSquare);

  },


  resetPlayerTurn(playerColor) {
    if (playerColor == PieceColor.WHITE) {
      Chess.state = State.WHITES_TURN;
    }
    else if (playerColor == PieceColor.BLACK) {
      Chess.state = State.BLACKS_TURN;
    }
  },


  setState(state) {

    // TODO: add a Chess.playerTurn variable!
    Chess.state = state;
    if (state == State.WHITES_TURN) {
      Gui.displayPlayersTurn('White');
    }
    else if (state == State.WHITE_MOVING) {
      Gui.displayPlayersTurn('White');
    }
    else if (state == State.BLACKS_TURN) {
      Gui.displayPlayersTurn('Black');
    }
    else if (state == State.BLACK_MOVING) {
      Gui.displayPlayersTurn('Black');
    }
    else if (state == State.GAME_OVER) {
      console.log('GAME OVER!');
    }
  },


  getNextState: function() {
    const state = Chess.state;
    if (state == State.WHITES_TURN) {
      return State.WHITE_MOVING;
    }
    else if (state == State.WHITE_MOVING) {
      return State.BLACKS_TURN;
    }
    else if (state == State.BLACKS_TURN) {
      return State.BLACK_MOVING;
    }
    else if (state == State.BLACK_MOVING) {
      return State.WHITES_TURN;
    }
  },

}

Chess.init();
resetButton.onclick = Chess.init;


export default Chess;

function playMoveSound() {
  let sound = new Audio('./audio/move.mp3');
  sound.play();
}