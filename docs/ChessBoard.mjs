import { Pawn, Rook, Bishop, Knight, King, Queen } from './Pieces.mjs';
import BoardSquare from './BoardSquare.mjs';
export default class ChessBoard {
  // Declare a 2d array of Board Squares
  board = [];
  constructor() {
    this.board = ChessBoard.createBoard();
  }

  static createBoard() {
    const board = [];
    for (let row = 0; row < 8; row++) {
      board[row] = [];
      for (let col = 0; col < 8; col++) {
        board[row][col] = new BoardSquare(row, col);
      }
    }

    // Add Pawns
    for (let col = 0; col < 8; col++) {
      board[1][col].piece = new Pawn('black');
      board[6][col].piece = new Pawn('white');
    }

    // Add Rooks
    board[0][0].piece = new Rook('black');
    board[0][7].piece = new Rook('black');
    board[7][0].piece = new Rook('white');
    board[7][7].piece = new Rook('white');

    // Add Knights
    board[0][1].piece = new Knight('black');
    board[0][6].piece = new Knight('black');
    board[7][1].piece = new Knight('white');
    board[7][6].piece = new Knight('white');

    // Add Bishops
    board[0][2].piece = new Bishop('black');
    board[0][5].piece = new Bishop('black');
    board[7][2].piece = new Bishop('white');
    board[7][5].piece = new Bishop('white');

    // Add Queens
    board[0][3].piece = new Queen('black');
    board[7][3].piece = new Queen('white');

    // Add Kings
    board[0][4].piece = new King('black');
    board[7][4].piece = new King('white');


    return board;

  }

  static must_be(object) {
    if (!(object instanceof ChessBoard)) {
      throw new Error('Must be a ChessBoard');
    }
  }

  move_piece(from, to) {
    BoardSquare.must_be(from);
    BoardSquare.must_be(to);
    if (!from.piece) {
      throw new Error('No piece to move');
    }

    // Update Controller
    to.piece = from.piece;
    from.piece = null;

  }

  print() {
    let output = '';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.board[row][col];
        const piece = square.piece;
        if (piece) {
          output += piece.get_short_name() + ' ';
        }
        else {
          output += '- ';
        }
      }
      output += '\n';
    }
    console.log(output);
  }

}

