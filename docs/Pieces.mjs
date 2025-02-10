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
    const requiredMethods = ['move', 'get_short_name'];
    this.must_implement(requiredMethods);
  }
  

  move() {
    throw new Error('move() Not Overridden');
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
  move() {
    console.log('Pawn Move');
  };

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'P';
  }
}

export class Rook extends PeiceInterface {
  points = 5;
  move = () => {};

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'R';
  }
}

export class Bishop extends PeiceInterface {
  points = 3;
  move = () => {};

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'B';
  }
}

export class Knight extends PeiceInterface {
  points = 3;
  move = () => {};

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'N';
  }
}

export class Queen extends PeiceInterface {
  points = 9;
  move = () => {};

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'Q';
  }
}

export class King extends PeiceInterface {
  points = 0;
  move = () => {};

  constructor(color) {
    super(color);
  }

  get_short_name() {
    return 'K';
  }
}