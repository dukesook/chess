import ChessBoard from './ChessBoard.mjs';
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
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.innerHTML = `${row}, ${col}`;
        chessboard.appendChild(square);
        square.classList.add('board-square');
        if ((row + col) % 2 === 0) {
          square.classList.add('light-square');
        } else {
          square.classList.add('dark-square');
        }

        const onclickSquare = function() {
          console.log('clicked', row, col);
        }
        square.addEventListener('click', onclickSquare);
      }
    }
  }

}

Chess.init();

export default Chess;