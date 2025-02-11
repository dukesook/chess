export default class BoardSquare {
  piece = null;
  row = null;
  column = null;
  container = null; // HTML Element

  constructor(row, column) {
    this.row = row;
    this.column = column;
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
}