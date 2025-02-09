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
    Gui.displayNewBoard(Chess.board, chessboardHTML, Chess.onclickSquare);

  },


  onclickSquare: function(square, squareHTML) {
    BoardSquare.must_be(square);
    console.log(square);
    console.log(squareHTML);
    if (square.piece) {
      Chess.moving = true;
      Chess.currentSquare = square;
    }
    else {
      console.log('Empty Square Clicked');
      if (Chess.moving) {
        console.log('Move Piece from ', Chess.currentSquare, ' to ', square);
        Chess.moving = false
      }
    }
  }

}

Chess.init();

export default Chess;