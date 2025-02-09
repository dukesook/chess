import ChessBoard from './ChessBoard.mjs';
import { BoardSquare } from './ChessBoard.mjs';
import Gui from './ChessGui.mjs';
console.log('loading chess.mjs');

const chessboardHTML = document.getElementById('chessboard');


const Chess = {

  board: null,
  moving: false, // The play has selected a piece to move, pending a destination square
  currentSquare: null, // The square with the piece that player has selected to move

  init: function() {
    
    Chess.board = new ChessBoard();
    Chess.board.print();

    // HTML
    Gui.initBoard(Chess.board, chessboardHTML, Chess.onclickSquare);

  },


  onclickSquare: function(square) {
    BoardSquare.must_be(square);

    if (Chess.moving) {
      Chess.onclickSquareMovingState(square);
    }
    else {
      Chess.onclickSquareInitialState(square);
    }

  },

  onclickSquareMovingState: function (square) {
    BoardSquare.must_be(square);
    
    if (square.piece) {
      Chess.moving = true;
      Chess.currentSquare = square;
    }

  },

  onclickSquareInitialState: function (square) {
    BoardSquare.must_be(square);
    
    if (!square.piece) {
      return; // You have to select a piece to move
    }

    Chess.moving = true;
    Chess.currentSquare = square;

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
    } catch (e) {
      console.error(e);
      return;
    }

    // Update View
    Gui.movePiece(from.container, to.container);

    // Update Model
    Chess.board.print();
  }

}

Chess.init();

export default Chess;