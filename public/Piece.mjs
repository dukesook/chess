import ChessBoard from './ChessBoard.mjs';
import BoardSquare from './BoardSquare.mjs';

// Color Enumeration
export const PieceColor = Object.freeze({
  WHITE: 'white',
  BLACK: 'black',
  must_be: function(object) {
    if (!Object.values(this).includes(object)) {
      throw new Error(`Invalid PieceColor value: ${object}`);
    }
  }
})



export default class PeiceInterface {
  points = null;
  color = null;
  short_name = null; // P, B, N, R, Q, K
  name = null; // pawn, bishop, knight, rook, queen, king
  WHITE = PieceColor.WHITE;
  BLACK = PieceColor.BLACK;

  constructor(color, short_name, name) {
    
    PieceColor.must_be(color);
    this.color = color;
    this.short_name = short_name;
    this.name = name;

    // Prohibit Abstract class Instantiation
    if (new.target === PeiceInterface) {
      throw new TypeError("Attempting to instantiate Abstract Class: PeiceInterface");
    }

    // Validate Children
    // TODO: add 'getValidMoves' to requiredMethods
    const requiredMethods = ['isValidMove'];
    this.must_implement(requiredMethods);
  }

  static object_constructor(object) {
    if (!object) {
      return null;
    }
    const name = object.name;
    const color = object.color;
    let piece = null;
    if (name == 'pawn') {
      piece = new Pawn(color);
    } else if (name == 'rook') {
      piece = new Rook(color);
    } else if (name == 'bishop') {
      piece = new Bishop(color);
    } else if (name == 'knight') {
      piece = new Knight(color);
    } else if (name == 'queen') {
      piece = new Queen(color);
    } else if (name == 'king') {
      piece = new King(color);
    } else {
      throw new Error('Invalid piece name: ' + name);
    }
    for (let key in object) {
      piece[key] = object[key];
    }
    return piece;
  }

  must_implement(requiredMethods) {
    // Ensure each child implements the required methods
    for (const method of requiredMethods) {
      if (typeof this[method] !== 'function') {
        throw new Error(`${this.constructor.name} must implement ${method}()`);
      }
    }
  }

  isValidMove() {
    throw new Error('isValidMove() Not Overridden');
  };

  getValidMoves() {
    throw new Error('getValidMoves() Not Overridden');
  };

  static pathIsClear(board, from, to) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');
    BoardSquare.must_be(to);

    const rowDelta = to.row - from.row;
    const colDelta = to.column - from.column;
    const rowDirection = Math.sign(rowDelta);
    const colDirection = Math.sign(colDelta);
    let row = from.row;
    let col = from.column;
    let distance = Math.max(Math.abs(rowDelta), Math.abs(colDelta));
    
    for (let i = 0; i < distance-1; i++) {
      row += rowDirection;
      col += colDirection;
      const square = board.board[row][col];
      if (square.piece) {
        console.error('Path not clear: ' + row + ', ' + col, ' have a ', square.piece.name);
        return false;
      }
    }
    return true;
  }

  static isLinearMove(from, to) {
    const rowDelta = Math.abs(from.row - to.row);
    const colDelta = Math.abs(from.column - to.column);
    return rowDelta == 0 || colDelta == 0;
  }

  static isDiagonalMove(from, to) {
    const rowDelta = Math.abs(from.row - to.row);
    const colDelta = Math.abs(from.column - to.column);
    return rowDelta == colDelta;
  }

}



export class Pawn extends PeiceInterface {
  points = 1;
  hasMoved = false;

  constructor(color) {
    super(color, 'P', 'pawn');
  }

  getDirection() {
    if (this.color == PieceColor.WHITE) {
      return -1; // White Pieces move up
    }
    else if (this.color == PieceColor.BLACK) {
      return 1; // Black Pieces move down
    }
    else {
      throw new Error('Invalid piece color: ' + this.color);
    }
  }

  isValidMove(board, from, to) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');
    BoardSquare.must_be(to);
    let delta = this.getDirection();

    // Move Forward 1 Square
    if (from.row + delta == to.row &&
        from.column == to.column &&
        !to.piece)
    {
      return true;
    }

    // Move Forward 2 Squares
    const frontSquare = board.board[from.row + delta][from.column];
    if (from.row + 2*delta == to.row &&
      from.column == to.column &&
      !to.piece &&
      !frontSquare.piece &&     // Path must be clear
      !this.hasMoved) {
        // TODO - En Passant
        // TODO - Pawn Promotion
      return true;
    }

    // Capture Diagonally
    if (from.row + delta == to.row &&
        Math.abs(from.column - to.column) == 1 &&
        to.piece &&
        to.piece.color != this.color) {
      return true;
    }

    // Invalid Move
    return false;
  
  };

  getValidMoves(board, from) {
    Utility.must_be(board, ChessBoard);
    BoardSquare.must_be(from, 'occupied');

    const validMoves = []; // Array of BoardSquares
    let delta = this.getDirection();

    // Move Forward 1 Square
    let to = board.getSquare(from.row + delta, from.column);
    if (to && !to.piece) {
      validMoves.push(to);
    }
  
    // Move Forward 2 Squares
    to = board.getSquare(from.row + 2*delta, from.column);
    if (to && !to.piece && !this.hasMoved) {
      validMoves.push(to);
    }

    // Capture Diagonally Left
    to = board.getSquare(from.row + delta, from.column - 1);
    if (to && to.piece && to.piece.color != this.color) {
      validMoves.push(to);
    }
    
    // Capture Diagonally Right
    to = board.getSquare(from.row + delta, from.column + 1);
    if (to && to.piece && to.piece.color != this.color) {
      validMoves.push(to);
    }

    return validMoves;
  }
}



export class Rook extends PeiceInterface {
  points = 5;

  constructor(color) {
    super(color, 'R', 'rook');
  }

  isValidMove (board, from, to) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');
    BoardSquare.must_be(to);

    if (!PeiceInterface.isLinearMove(from, to)) {
      return false;
    }

    else if (!PeiceInterface.pathIsClear(board, from, to)) {
      return false;
    }

    return true;
  };


  getValidMoves(board, from) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');

    const validMoves = []; // Array of BoardSquares
    for (let i = 1; i < 8; i++) {
      let up = board.getSquare(from.row - i, from.column);
      if (this.isValidMove(board, from, up)) {
        validMoves.push(up);
      }
      
      let down = board.getSquare(from.row + i, from.column);
      if (this.isValidMove(board, from, down)) {
        validMoves.push(down);
      }

      let left = board.getSquare(from.row, from.column - i);
      if (this.isValidMove(board, from, left)) {
        validMoves.push(left);
      }

      let right = board.getSquare(from.row, from.column + i);
      if (this.isValidMove(board, from, right)) {
        validMoves.push(right);
      }
    }
    return validMoves;
  }


}



export class Bishop extends PeiceInterface {
  points = 3;
  

  constructor(color) {
    super(color, 'B', 'bishop');
  }

  isValidMove (board, from, to) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');
    BoardSquare.must_be(to);

    if (!PeiceInterface.isDiagonalMove(from, to)) {
      return false;
    }
    else if (!PeiceInterface.pathIsClear(board, from, to)) {
      return false;
    }

    return true;
    
  }

  getValidMoves(board, from) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');

    const validMoves = []; // Array of BoardSquares
    for (let i = 1; i < 8; i++) {
      let upLeft = board.getSquare(from.row - i, from.column - i);
      if (this.isValidMove(board, from, upLeft)) {
        validMoves.push(upLeft);
      }
      
      let upRight = board.getSquare(from.row - i, from.column + i);
      if (this.isValidMove(board, from, upRight)) {
        validMoves.push(upRight);
      }

      let downLeft = board.getSquare(from.row + i, from.column - i);
      if (this.isValidMove(board, from, downLeft)) {
        validMoves.push(downLeft);
      }

      let downRight = board.getSquare(from.row + i, from.column + i);
      if (this.isValidMove(board, from, downRight)) {
        validMoves.push(downRight);
      }
    }
    return validMoves;
  }
}



export class Knight extends PeiceInterface {
  points = 3;

  constructor(color) {
    super(color, 'N', 'knight');
  }

  isValidMove (board, from, to) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');
    BoardSquare.must_be(to);

    const rowDelta = Math.abs(from.row - to.row);
    const colDelta = Math.abs(from.column - to.column);

    // L-Shaped Move
    if ((rowDelta == 2 && colDelta == 1) ||
        (rowDelta == 1 && colDelta == 2)) {
      return true;
    }

    // Invalid Move
    return false;
  };

  getValidMoves(board, from) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');

    const validMoves = []; // Array of BoardSquares
    const deltas = [
      {row: -2, col: -1},
      {row: -2, col:  1},
      {row: -1, col: -2},
      {row: -1, col:  2},
      {row:  1, col: -2},
      {row:  1, col:  2},
      {row:  2, col: -1},
      {row:  2, col:  1}
    ];

    for (const delta of deltas) {
      let to = board.getSquare(from.row + delta.row, from.column + delta.col);
      if (to && this.isValidMove(board, from, to)) {
        validMoves.push(to);
      }
    }
    return validMoves;
  }
}



export class Queen extends PeiceInterface {
  points = 9;

  constructor(color) {
    super(color, 'Q', 'queen');
  }

  isValidMove (board, from, to) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');
    BoardSquare.must_be(to);

    if (!PeiceInterface.pathIsClear(board, from, to)) {
      return false;
    }

    if (PeiceInterface.isLinearMove(from, to) ||
        PeiceInterface.isDiagonalMove(from, to)) {
      return true;
    }

    // Invalid
    return false;
  };

  getValidMoves(board, from) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');

    const validMoves = []; // Array of BoardSquares

    // Rook Moves
    

    // Bishop Moves

    return validMoves;
  }

}



export class King extends PeiceInterface {
  points = 0;

  constructor(color) {
    super(color, 'K', 'king');
  }

  isValidMove (board, from, to) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');
    BoardSquare.must_be(to);

    const rowDelta = Math.abs(from.row - to.row);
    const colDelta = Math.abs(from.column - to.column);

    // Move 1 Square
    if (rowDelta <= 1 && colDelta <= 1) {
      return true;
    }

    // Invalid Move
    return false;
  };
}

