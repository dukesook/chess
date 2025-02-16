import { Pawn, Rook, Bishop, Knight, King, Queen, PieceColor } from './Pieces.mjs';
import BoardSquare from './BoardSquare.mjs';
export default class ChessBoard {
  // Declare a 2d array of Board Squares
  board = [];
  kingCaptured = false;

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
      board[1][col].piece = new Pawn(PieceColor.BLACK);
      board[6][col].piece = new Pawn(PieceColor.WHITE);
    }

    // Add Rooks
    board[0][0].piece = new Rook(PieceColor.BLACK);
    board[0][7].piece = new Rook(PieceColor.BLACK);
    board[7][0].piece = new Rook(PieceColor.WHITE);
    board[7][7].piece = new Rook(PieceColor.WHITE);

    // Add Knights
    board[0][1].piece = new Knight(PieceColor.BLACK);
    board[0][6].piece = new Knight(PieceColor.BLACK);
    board[7][1].piece = new Knight(PieceColor.WHITE);
    board[7][6].piece = new Knight(PieceColor.WHITE);

    // Add Bishops
    board[0][2].piece = new Bishop(PieceColor.BLACK);
    board[0][5].piece = new Bishop(PieceColor.BLACK);
    board[7][2].piece = new Bishop(PieceColor.WHITE);
    board[7][5].piece = new Bishop(PieceColor.WHITE);

    // Add Queens
    board[0][3].piece = new Queen(PieceColor.BLACK);
    board[7][3].piece = new Queen(PieceColor.WHITE);

    // Add Kings
    board[0][4].piece = new King(PieceColor.BLACK);
    board[7][4].piece = new King(PieceColor.WHITE);


    return board;

  }

  static must_be(object) {
    if (!(object instanceof ChessBoard)) {
      throw new Error('Must be a ChessBoard');
    }
  }

  getSquare(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) {
      return null;
    }
    return this.board[row][col];
  }

  move_piece(from, to) {
    BoardSquare.must_be(from, 'occupied');
    BoardSquare.must_be(to);

    // Friendly Capture
    if (to.piece && to.piece.color == from.piece.color) {
      console.log('You can\'t kill your own piece');
      throw new Error('You can\'t kill your own piece');
    }

    // Validate Move
    const piece = from.piece;
    const isValidMove = piece.isValidMove(this, from, to);
    if (!isValidMove) {
      throw new Error('Invalid Move');
    }

    if (to.piece instanceof King) {
      this.kingCaptured = true;
    }

    // Update Controller
    from.piece.hasMoved = true;
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


