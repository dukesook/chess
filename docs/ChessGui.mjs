import ChessBoard from './ChessBoard.mjs';
import { BoardSquare } from './ChessBoard.mjs';

export const ChessGui = {

  displayNewBoard(chessBoard, container, callback) {
    ChessBoard.must_be(chessBoard);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareHTML = document.createElement('div');
        container.appendChild(squareHTML);

        // Add Coordinates
        squareHTML.setAttribute('row', row);
        squareHTML.setAttribute('column', col);

        // Add Classes
        squareHTML.classList.add('board-square');

        // Light vs Dark Squares
        if ((row + col) % 2 === 0) {
          squareHTML.classList.add('light-square');
        } else {
          squareHTML.classList.add('dark-square');
        }

        const square = chessBoard.board[row][col];
        const onclickSquare = function() {
          callback(square, squareHTML);
        }

        squareHTML.addEventListener('click', onclickSquare);

        if (square.piece) {
          const shortName = square.piece.get_short_name();
          squareHTML.innerHTML = shortName;
        }
      }
    }
  },

  displayBoard(chessBoard, chessboardHTML) {
    ChessBoard.must_be(chessBoard);
    const board = chessBoard.board;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = board[row][col];
        BoardSquare.must_be(square);
        const piece = square.piece;
        if (piece) {
          const shortName = piece.get_short_name();

        }
      }
    }

  }
}

export default ChessGui;