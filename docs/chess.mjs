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

    // TODO - move PIECE_COLOR up a level
    //        Since the controller needs access to it,
    //        The controller can just create it and pass it down.

    const state = Chess.state;
    if (state == State.WHITES_TURN) {
      Chess.handlePlayersTurn(square, 'white'); // White Selected Their Piece to Move
    }
    else if (state == State.WHITE_MOVING) {
      Chess.handlePlayerMoving(square, 'white'); // White selected a destination for their piece
    }
    else if (state == State.BLACKS_TURN) {
      Chess.handlePlayersTurn(square, 'black'); // Black Selected Their Piece to Move
    }
    else if (state == State.BLACK_MOVING) {
      Chess.handlePlayerMoving(square, 'black'); // Black selected a destination for their peice
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

    // You can't move on your own piece
    if (toSquare.peice && toSquare.piece.color == playerColor) {
      console.log('You can\'t kill your own piece');
      return;
    }

    // Move
    Chess.movePiece(fromSquare, toSquare);
    Gui.unhighlightSquare(fromSquare);
    Chess.state = Chess.getNextState();


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