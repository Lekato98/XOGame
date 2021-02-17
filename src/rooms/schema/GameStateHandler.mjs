import {ArraySchema, defineTypes, Schema} from "@colyseus/schema";

const DRAW = 'DRAW';
const DRAW_VALUE = 'D';
const WINNER = 'WINNER';

const X_PLAYER_VALUE = 'X';
const O_PLAYER_VALUE = 'O';

const DEFAULT_GRID_VALUE = '.';
const DEFAULT_GRID_SIZE = 9;
const DEFAULT_TURN = 'D';

export class GameStateHandler extends Schema {
  constructor() {
    super();
    this.refreshGameStateHandler();
  }

  moveValidation(value, cellId) {
    return cellId > -1 && cellId < DEFAULT_GRID_SIZE &&
        this.isGameOver === false &&
        value === this.turn && this.grid[cellId] === DEFAULT_GRID_VALUE;
  }

  move(value, cellId) {
    if (this.moveValidation(value, cellId) === true) {
      this.grid[cellId] = value;
      if (this.checkIsGameOver() === true) {
        // do something ...
      } else {
        this.nextTurn();
      }

      return true; // valid move
    }

    return false; // invalid move
  }

  checkIsGameOver() {
    if (this.checkCols() === true || this.checkRows() === true
        || this.checkDiagonals() === true) {
      this.gameOver();
      return true;
    } else if (this.checkDraw() === true) {
      this.gameOver(true);
      return true;
    }

    return false;
  }

  gameOver(isDraw = false) {
    if (isDraw === true) {
      this.result = DRAW;
      this.winner = DRAW_VALUE;
    } else {
      this.result = WINNER;
      this.winner = this.turn;
    }

    this.turn = DEFAULT_TURN;
    this.isGameOver = true;
  }

  nextTurn() {
    if (this.turn === X_PLAYER_VALUE) {
      this.turn = O_PLAYER_VALUE;
    } else if (this.turn === O_PLAYER_VALUE) {
      this.turn = X_PLAYER_VALUE;
    } else {
      this.turn = X_PLAYER_VALUE;
    }
  }

  checkRows() {
    for (let i = 0; i < 7; i += 3) {
      if (this.grid[i] !== DEFAULT_GRID_VALUE && this.grid[i] === this.grid[i
      + 1] && this.grid[i] === this.grid[i + 2]) {
        return true;
      }
    }

    return false;
  }

  checkCols() {
    for (let i = 0; i < 3; i++) {
      if (this.grid[i] !== DEFAULT_GRID_VALUE && this.grid[i] === this.grid[i
      + 3] && this.grid[i] === this.grid[i + 6]) {
        return true;
      }
    }

    return false;
  }

  checkDiagonals() {
    if ((this.grid[0] !== DEFAULT_GRID_VALUE && this.grid[0] === this.grid[4]
        && this.grid[0] === this.grid[8]) ||
        (this.grid[2] !== DEFAULT_GRID_VALUE && this.grid[2] === this.grid[4]
            && this.grid[2] === this.grid[6])) {
      return true;
    }

    return false;
  }

  checkDraw() {
    return this.grid.some(value => value === DEFAULT_GRID_VALUE) !== true;
  }

  refreshGameStateHandler() {
    this.result = '';
    this.winner = '';
    this.isGameOver = false;
    this.turn = X_PLAYER_VALUE;
    this.resetGrid(DEFAULT_GRID_VALUE, DEFAULT_GRID_SIZE);
  }

  resetGrid(value, size) {
    this.grid = new ArraySchema();
    for (let i = 0; i < size; i++) {
      this.grid.push(value);
    }
  }
}

defineTypes(GameStateHandler, {
  result: 'string',
  winner: 'string',
  isGameOver: 'boolean',
  turn: 'string',
  grid: ['string']
});