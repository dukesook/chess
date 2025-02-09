import ChessBoard from './ChessBoard.mjs';
import { BoardSquare } from './ChessBoard.mjs';
import Gui from './ChessGui.mjs';
console.log('loading chess.mjs');

const chessboardHTML = document.getElementById('chessboard');

// State Machine
const State = Object.freeze({
  WHITES_TURN: 0,
  WHITE_MOVING: 1,
  BLACKS_TURN: 2,
  BLACK_MOVING: 3,
})

const Chess = {
  board: null,
  selectedSquare: null, // The square with the piece that player has selected to move
  state: State.WHITES_TURN,

  init: function() {
    Chess.board = new ChessBoard();
    Chess.board.print();
    Gui.initBoard(Chess.board, chessboardHTML, Chess.onclickSquare);
  },

  onclickSquare: function(square) {
    BoardSquare.must_be(square);

    const state = Chess.state;
    if (state == State.WHITES_TURN) {
      // White Selected Their Piece to Move
      Chess.handlePlayersTurn(square, 'white');
    }
    else if (state == State.WHITE_MOVING) {
      // White selected a destination for their piece
      Chess.handlePlayerMoving(square, 'white');
    }
    else if (state == State.BLACKS_TURN) {
      // Black Selected Their Piece to Move
      Chess.handlePlayersTurn(square, 'black');
    }
    else if (state == State.BLACK_MOVING) {
      // Black selected a destination for their peice
      Chess.handlePlayerMoving(square, 'black');
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
    Chess.state = State.WHITE_MOVING;
    console.log('VALID: Moving to WHITE_MOVING state');

  },

  handlePlayerMoving: function(square, playerColor) {
    BoardSquare.must_be(square);

  },



  movePiece: function(from, to) {
    BoardSquare.must_be(from);
    BoardSquare.must_be(to);

    if (!from.piece) {
      throw new Error('No piece to move');
    }

    // Move
    try {
      Chess.board.move_piece(from, to);
      Gui.movePiece(from.container, to.container);
    } catch (e) {
      console.error(e);
      return;
    }

    Chess.board.print();

  }

}

Chess.init();

export default Chess;