import ChessBoard from './ChessBoard.mjs';
import { BoardSquare } from './ChessBoard.mjs';
import Gui from './ChessGui.mjs';
console.log('loading chess.mjs');

const chessboard = document.getElementById('chessboard');


const Chess = {

  board: null,

  init: function() {
    // HTML
    Chess.createBoard();


    Chess.board = new ChessBoard();
    Chess.board.print();
  },

  createBoard: function() {
    Gui.displayNewBoard(chessboard);
  }

}

Chess.init();

export default Chess;