export default class PeiceInterface {
  points = null;
  color = null;
  move() {
    throw new Error('move() Not Overridden');
  };
  get_short_name() {
    throw new Error('get_short_name() Not Overridden');
  };

  constructor(color) {
    this.color = color;
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