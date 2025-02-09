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
  state: new State(),
  board: null,
  currentSquare: null, // The square with the piece that player has selected to move

  init: function() {
    Chess.board = new ChessBoard();
    Chess.board.print();
    Gui.initBoard(Chess.board, chessboardHTML, Chess.onclickSquare);
  },

  onclickSquare: function(square) {
    BoardSquare.must_be(square);

    const state = Chess.state;
    if (state == State.WHITES_TURN) {
      Chess.handleWhitesTurn(square);
    } else if (state == State.WHITE_MOVING) {
      Chess.handleWhiteMoving(square);
    } else if (state == State.BLACKS_TURN) {
      Chess.handleBlacksTurn(square);
    } else if (state == State.BLACK_MOVING) {
      Chess.handleBlackMoving(square);
    }
  },

  handleWhitesTurn: function(square) {
    BoardSquare.must_be(square);

  },

  handleWhiteMoving: function(square) {
    BoardSquare.must_be(square);

  },

  handleBlacksTurn: function(square) {
    BoardSquare.must_be(square);

  },

  handleBlackMoving: function(square) {
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