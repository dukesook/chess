import ChessBoard from './ChessBoard.mjs';
import { BoardSquare } from './ChessBoard.mjs';

export const ChessGui = {

  initBoard(chessBoard, container, callback) {
    ChessBoard.must_be(chessBoard);
    must_be_HTMLElement(container);

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
    must_be_HTMLElement(chessboardHTML);

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

  },

  movePiece(from, to) {
    must_be_HTMLElement(from);
    must_be_HTMLElement(to);

    to.innerHTML = from.innerHTML;
    from.innerHTML = '';
  }
}

export default ChessGui;

function must_be_HTMLElement(object) {
  if (!(object instanceof HTMLElement)) {
    throw new Error('Must be a HTMLElement, but got ' + object);
  }
}