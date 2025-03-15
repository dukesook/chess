import PieceInterface from "./Piece.mjs";

export default class BoardSquare {
  piece = null;     // PeiceInterface
  row = null;       // Integer
  column = null;    // Integer
  container = null; // HTML Element

  constructor(row, column) {
    this.row = row;
    this.column = column;
  }

  static object_constructor(object) {
    // Creates a BoardSquare from the given object.
    // The object was originally a BoardSquare, but sent over the network as a plain object.

    const square = new BoardSquare(object.row, object.column);
    square.piece = PieceInterface.object_constructor(object.piece);
    for (let key in object) {
      square[key] = object[key];
    }
    return square;
  }

  static must_be(object, pieceStatus = null) {
    if (!(object instanceof BoardSquare)) {
      throw new Error('Must be a BoardSquare');
    }
    if (!pieceStatus) {
      return
    }
    const piece = object.piece;
    
    // Square must be occupied
    if (pieceStatus == 'occupied') {
      if (!piece) {
        throw new Error('Square is empty');
      }
    }

    // Square must be empty
    if (pieceStatus == 'empty') {
      if (piece) {
        throw new Error('Square is not empty');
      }
    } 

  }

  equals(other) {
    BoardSquare.must_be(other);
    if (this.row == other.row && this.column == other.column) {
      return true;
    }
    return false;
  }
}