import ChessBoard from './ChessBoard.mjs';
import BoardSquare from './BoardSquare.mjs';
import Utility from './Utility.mjs';

const blacksTurn = document.getElementById('blacks-turn');
const whitesTurn = document.getElementById('whites-turn');
const rootStyle = getComputedStyle(document.documentElement);
const moveDuration = parseFloat(rootStyle.getPropertyValue('--move-duration'));

export const ChessGui = {

  initBoard(chessBoard, boardElement, onclickSquare) {
    ChessBoard.must_be(chessBoard);
    Utility.must_be(boardElement, HTMLElement);
    
    // Clear Board
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareElement = document.createElement('div');
        boardElement.appendChild(squareElement);

        // Add Coordinates
        squareElement.setAttribute('row', row);
        squareElement.setAttribute('column', col);

        // Add Classes
        squareElement.classList.add('board-square');

        // Light vs Dark Squares
        if ((row + col) % 2 === 0) {
          squareElement.classList.add('light-square');
        } else {
          squareElement.classList.add('dark-square');
        }

        const square = chessBoard.board[row][col];
        square.container = squareElement;

        squareElement.addEventListener('click', () => onclickSquare(square));

        if (square.piece) {
          const color = square.piece.color;
          const type = square.piece.get_name();
          const srcElement = ChessGui.createPiece(type, color);
          srcElement.alt = `${color} ${type}`;
          squareElement.appendChild(srcElement);
        }
      }
    }
  },

  displayBoard(chessBoard, chessboardHTML) {
    ChessBoard.must_be(chessBoard);
    Utility.must_be(chessboardHTML, HTMLElement);

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

  createPiece(type, color) {
    const img = document.createElement('img');
    img.classList.add('chess-piece');
    img.src = `./images/${color}_${type}.svg`;
    return img;
  },

  movePiece(from, to) {
    Utility.must_be(from, HTMLDivElement);
    Utility.must_be(to, HTMLDivElement);

    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    const deltaX = toRect.left - fromRect.left;
    const deltaY = toRect.top - fromRect.top;

    const piece = from.querySelector('.chess-piece');
    Utility.must_be(piece, HTMLImageElement);
      
    piece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    setTimeout(() => {
      piece.style.transform = '';
      to.innerHTML = from.innerHTML;
      from.innerHTML = '';
    }, moveDuration);
  },

  highlightSquare(square) {
    BoardSquare.must_be(square);
    square.container.classList.add('highlight-square');
  },

  unhighlightSquare(square) {
    BoardSquare.must_be(square);
    square.container.classList.remove('highlight-square');
  },

  displayWhitesTurn() {
    whitesTurn.classList.add('player-turn-active');
    blacksTurn.classList.remove('player-turn-active');
  },

  displayBlacksTurn() {
    blacksTurn.classList.add('player-turn-active');
    whitesTurn.classList.remove('player-turn-active');
  }
}

export default ChessGui;

