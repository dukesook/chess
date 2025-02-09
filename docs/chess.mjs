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
    if (square.piece) {
      Chess.moving = true;
      Chess.currentSquare = square;
    }
    else {
      console.log('Empty Square Clicked');
      if (Chess.moving) {
        Chess.movePiece(Chess.currentSquare, square);
        Chess.currentSquare = null;
        Chess.moving = false
      }
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