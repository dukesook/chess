import ChessBoard from './ChessBoard.mjs';
import BoardSquare from './BoardSquare.mjs';
import Gui from './ChessGui.mjs';
import { PieceColor } from './Piece.mjs';
import Timer from './Timer.mjs';
console.log('loading chess.mjs');

//************************************************* */
const socket = io(); // Connect to WebSocket server

socket.on('message', (message) => {
  console.log('server: ' + message);
})

let playerColor = null;
socket.on('playerColor', (color) => {
  console.log('the server assigned me to be: ' + color);
  playerColor = color;
  if (color != 'white' && color != 'black') {
    console.error('Invalid player color: ' + color);
  }
})

socket.on('forceMove', (from, to) => {
  console.log('forceMove: ');
  from = BoardSquare.object_constructor(from);
  to = BoardSquare.object_constructor(to);

  Chess.forceMovePiece(from, to);

})
//************************************************* */

// HTML Elements
const chessboardHTML = document.getElementById('chessboard');
const resetButton = document.getElementById('reset-button');
const endButton = document.getElementById('end-button');
const moveSound = new Audio('./audio/move.mp3');
const wrongSound = new Audio('./audio/wrong.mp3');
const endSong = new Audio('./audio/turn_down_for_what.mp3');
const whitesTimeHTML = document.getElementById('whites-time');
const blacksTimeHTML = document.getElementById('blacks-time');
const gameOverMessage = document.getElementById('game-over-message');


// State Machine
const State = Object.freeze({
  WHITES_TURN: 1,
  WHITE_MOVING: 2,
  BLACKS_TURN: 3,
  BLACK_MOVING: 4,
  GAME_OVER: 5,
})

const Chess = {
  board: null, // class ChessBoard
  selectedSquare: null, // The square with the piece that player has selected to move
  state: State.WHITES_TURN,
  whitesTimer: new Timer(),
  blacksTimer: new Timer(),

  init: function() {
    Chess.board = new ChessBoard();
    Chess.board.print();
    Gui.initBoard(Chess.board, chessboardHTML, Chess.onclickSquare);
    Chess.setState(State.WHITES_TURN);
    endSong.pause();
    endSong.currentTime = 0;
    Chess.Timers.reset();
    gameOverMessage.classList.add('hidden');
    setInterval(() => {
      whitesTimeHTML.innerHTML = Chess.whitesTimer.to_string();
      blacksTimeHTML.innerHTML = Chess.blacksTimer.to_string();
      Chess.whitesTimer.timeupCallback = Chess.gameOver;
      Chess.blacksTimer.timeupCallback = Chess.gameOver;
    }, 10)
  },

  onclickSquare: function(square) {
    BoardSquare.must_be(square);

    Chess.Timers.debug();
    const state = Chess.state;
    if (state == State.WHITES_TURN) {
      Chess.handlePlayersTurn(square, PieceColor.WHITE); // White Selected Their Piece to Move
    }
    else if (state == State.WHITE_MOVING) {
      Chess.handlePlayerMoving(square, PieceColor.WHITE); // White selected a destination for their piece
    }
    else if (state == State.BLACKS_TURN) {
      Chess.handlePlayersTurn(square, 'black'); // Black Selected Their Piece to Move
    }
    else if (state == State.BLACK_MOVING) {
      Chess.handlePlayerMoving(square, PieceColor.BLACK); // Black selected a destination for their peice
    }
    else if (state == State.GAME_OVER) {
      // Do nothing, wait for game reset
    }
  },


  handlePlayersTurn: function(square, playerColor) {
    BoardSquare.must_be(square);

    // Select Square with Piece
    const piece = square.piece;
    if (!piece) {
      console.log('You can only select a square with a piece on it');
      return;
    }

    // Select Team piece
    const color = piece.color;
    if (color != playerColor) {
      console.log('You must select your own pieces');
      return;
    }

    // Success
    Chess.selectedSquare = square;
    Gui.highlightSquare(square);
    Chess.state = Chess.getNextState();

  },


  handlePlayerMoving: function(toSquare, playerColor) {
    const fromSquare = Chess.selectedSquare;
    BoardSquare.must_be(toSquare);
    BoardSquare.must_be(fromSquare);
    
    const isValidMove = Chess.board.is_valid_move(fromSquare, toSquare);
    if (isValidMove) {
      console.log('emmiting move:')
      socket.emit('moveAttempt', fromSquare, toSquare);
    }
    else if (!isValidMove) {
      console.error(e);
      Chess.resetPlayerTurn(playerColor);
      wrongSound.play();
    }

    Gui.unhighlightSquare(fromSquare);

  },

  forceMovePiece(fromSquare, toSquare) {
    BoardSquare.must_be(toSquare);
    BoardSquare.must_be(fromSquare);

    const originalName = fromSquare.piece.name;
    Chess.board.move_piece(fromSquare, toSquare); // throws error if invalid
    Chess.board.print();

    // Play Sound
    moveSound.play();

    // Update Gui
    Gui.movePiece(fromSquare.container, toSquare.container);

    // Pawn Promotion
    if (originalName == 'pawn' && toSquare.piece.name == 'queen') {
      Gui.promotePawn(toSquare);
    }

    // Update State
    let gameOver = Chess.board.kingCaptured;
    if (gameOver) {
      Chess.setState(State.GAME_OVER);
    }
    else {
      const nextState = Chess.getNextState();
      Chess.setState(nextState);
    }


  },

  resetPlayerTurn(playerColor) {
    if (playerColor == PieceColor.WHITE) {
      Chess.state = State.WHITES_TURN;
    }
    else if (playerColor == PieceColor.BLACK) {
      Chess.state = State.BLACKS_TURN;
    }
  },


  setState(state) {
    Chess.state = state;
    if (state == State.WHITES_TURN) {
      Gui.displayWhitesTurn(PieceColor.WHITE);
      Chess.Timers.startWhite();
    }
    else if (state == State.WHITE_MOVING) {
      Gui.displayWhitesTurn(PieceColor.WHITE);
    }
    else if (state == State.BLACKS_TURN) {
      Gui.displayBlacksTurn(PieceColor.BLACK);
      Chess.Timers.startBlack();
    }
    else if (state == State.BLACK_MOVING) {
      Gui.displayBlacksTurn(PieceColor.BLACK);
    }
    else if (state == State.GAME_OVER) {
      Chess.gameOver();
    }
  },


  gameOver() {
    Chess.Timers.pause();
    Chess.state = State.GAME_OVER;
    gameOverMessage.classList.remove('hidden');
    console.log('GAME OVER!');
    endSong.play();
  },


  getNextState: function() {
    const state = Chess.state;
    if (state == State.WHITES_TURN) {
      return State.WHITE_MOVING;
    }
    else if (state == State.WHITE_MOVING) {
      return State.BLACKS_TURN;
    }
    else if (state == State.BLACKS_TURN) {
      return State.BLACK_MOVING;
    }
    else if (state == State.BLACK_MOVING) {
      return State.WHITES_TURN;
    }
  },

  Timers: {
    reset: function() {
      Chess.whitesTimer.reset();
      Chess.blacksTimer.reset(); 
    },

    startWhite: function() {
      Chess.whitesTimer.start();
      Chess.blacksTimer.pause();
    },

    startBlack: function() {
      Chess.whitesTimer.pause();
      Chess.blacksTimer.start();
    },

    pause: function() {
      Chess.whitesTimer.pause();
      Chess.blacksTimer.pause();
    },

    debug: function() {
      console.log('white: ' + Chess.whitesTimer.to_string());
      console.log('black: ' + Chess.blacksTimer.to_string());
    },

  },

}

Chess.init();
resetButton.onclick = Chess.init;
endButton.onclick = Chess.gameOver;


export default Chess;
