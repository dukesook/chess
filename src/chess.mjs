console.log('loading chess.mjs');

const chessboard = document.getElementById('chessboard');


const Chess = {

  init: function() {
    Chess.createBoard();
  },

  createBoard: function() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.innerHTML = `${row}, ${col}`;
        chessboard.appendChild(square);
        // Add class to square
        square.classList.add('board-square');
      }
    }
  }

}

Chess.init();

export default Chess;