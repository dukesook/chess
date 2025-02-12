import ChessBoard from './ChessBoard.mjs';
import BoardSquare from './BoardSquare.mjs';
import Chess from './chess.mjs';

const PIECE_COLOR = Object.freeze({
  WHITE: 'white',
  BLACK: 'black',
  must_be: function(object) {
    if (!Object.values(this).includes(object)) {
      throw new Error(`Invalid PIECE_COLOR value: ${object}`);
    }
  }
})

export default class PeiceInterface {
  points = null;
  color = null;
  WHITE = PIECE_COLOR.WHITE;
  BLACK = PIECE_COLOR.BLACK;

  constructor(color) {
    
    PIECE_COLOR.must_be(color);
    this.color = color;


    // Prohibit Abstract class Instantiation
    if (new.target === PeiceInterface) {
      throw new TypeError("Attempting to instantiate Abstract Class: PeiceInterface");
    }

    // Validate Children
    const requiredMethods = ['isValidMove', 'get_name', 'get_short_name'];
    this.must_implement(requiredMethods);
  }
  

  isValidMove() {
    throw new Error('isValidMove() Not Overridden');
  };

  get_short_name() {
    throw new Error('get_short_name() Not Overridden');
  };

  must_implement(requiredMethods) {
    // Ensure each child implements the required methods
    for (const method of requiredMethods) {
      if (typeof this[method] !== 'function') {
        throw new Error(`${this.constructor.name} must implement ${method}()`);
      }
    }
  }
}

export class Pawn extends PeiceInterface {
  points = 1;
  hasMoved = false;

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'P';
  }

  get_name() {
    return 'pawn';
  }

  isValidMove(board, from, to) {
    ChessBoard.must_be(board);
    BoardSquare.must_be(from, 'occupied');
    BoardSquare.must_be(to);
    let delta = null;
    if (this.color == PIECE_COLOR.WHITE) {
      delta = -1;
    }
    else if (this.color == PIECE_COLOR.BLACK) {
      delta = 1;
    }
    else {
      throw new Error('Invalid piece color: ' + this.color);
    }

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
}

export class Rook extends PeiceInterface {
  points = 5;
  isValidMove = () => {};

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'R';
  }

  get_name() {
    return 'rook';
  }
}

export class Bishop extends PeiceInterface {
  points = 3;
  isValidMove = () => {};

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'B';
  }

  get_name() {
    return 'bishop';
  }
}

export class Knight extends PeiceInterface {
  points = 3;
  isValidMove = () => {};

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'N';
  }

  get_name() {
    return 'knight';
  }
}

export class Queen extends PeiceInterface {
  points = 9;
  isValidMove = () => {};

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'Q';
  }
  
  get_name() {
    return 'queen';
  }
}

export class King extends PeiceInterface {
  points = 0;
  isValidMove = () => {};

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'K';
  }

  get_name() {
    return 'king';
  }
}