import ChessBoard from './ChessBoard.mjs';
import { BoardSquare } from './ChessBoard.mjs';
import Gui from './ChessGui.mjs';
console.log('loading chess.mjs');

const chessboardHTML = document.getElementById('chessboard');


const Chess = {

  board: null,

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
  }

}

Chess.init();

export default Chess;