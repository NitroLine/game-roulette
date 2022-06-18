import { BaseGame } from "./base-game.js";
import { GameStatus, MoveStatus, PlayerSide } from "../server/enums.js";

const Field = { CROSS: "X", ZERO: "O", EMPTY: " " };
const symbolPlayer = { X: PlayerSide.FIRST, O: PlayerSide.SECOND };

export class TTTGame extends BaseGame {
  constructor () {
    super();

    this.dimention = 3;
    this.currentPlayer = Field.CROSS;
    this.isEnded = false;
    this.field = [];
    for (let row = 0; row < this.dimention; ++row) {
      const tempArr = [];
      for (let col = 0; col < this.dimention; ++col) { tempArr.push(Field.EMPTY); }
      this.field.push(tempArr);
    }
  }

  start () {
  }

  move (player, step) {
    const row = step.row;
    const col = step.col;
    if (this.isEnded || player !== symbolPlayer[this.currentPlayer] || this.field[row][col] !== Field.EMPTY) { return MoveStatus.BAD_MOVE; }
    this.field[row][col] = this.currentPlayer;
    this.currentPlayer = (this.currentPlayer === Field.CROSS) ? Field.ZERO : Field.CROSS;
    return MoveStatus.OK;
  }

  getStatus () {
    const winner = this._getWinnerSide();
    if (winner === Field.EMPTY) {
      const anyMove = this._isAnyMove();
      if (anyMove) { return { status: GameStatus.NOTHING }; }
      this.isEnded = true;
      return { status: GameStatus.DRAW };
    }
    this.isEnded = true;
    return { status: GameStatus.WIN, side: this._getPlayerSide(winner) };
  }

  _getWinnerSide () {
    for (let i = 0; i < this.dimention; ++i) {
      let crossHorCount = 0;
      let zerosHorCount = 0;
      let crossVerCount = 0;
      let zerosVerCount = 0;
      for (let j = 0; j < this.dimention; ++j) {
        if (this.field[i][j] === Field.CROSS) crossHorCount++;
        if (this.field[i][j] === Field.ZERO) zerosHorCount++;

        if (this.field[j][i] === Field.CROSS) crossVerCount++;
        if (this.field[j][i] === Field.ZERO) zerosVerCount++;

        if (crossHorCount === this.dimention || crossVerCount === this.dimention) { return Field.CROSS; }
        if (zerosHorCount === this.dimention || zerosVerCount === this.dimention) { return Field.ZERO; }
      }
    }

    let crossMajorCount = 0;
    let zerosMajorCount = 0;
    let crossMinorCount = 0;
    let zerosMinorCount = 0;
    for (let i = 0; i < this.dimention; ++i) {
      if (this.field[i][i] === Field.CROSS) crossMajorCount++;
      if (this.field[i][i] === Field.ZERO) zerosMajorCount++;

      if (this.field[i][this.dimention - i - 1] === Field.CROSS) crossMinorCount++;
      if (this.field[i][this.dimention - i - 1] === Field.ZERO) zerosMinorCount++;
    }

    if (crossMajorCount === this.dimention || crossMinorCount === this.dimention) { return Field.CROSS; }
    if (zerosMajorCount === this.dimention || zerosMinorCount === this.dimention) { return Field.ZERO; }
    return Field.EMPTY;
  }

  _isAnyMove () {
    for (let row = 0; row < this.dimention; ++row) {
      for (let col = 0; col < this.dimention; ++col) {
        if (this.field[row][col] === Field.EMPTY) { return true; }
      }
    }
    return false;
  }

  _getPlayerSide (side) {
    return symbolPlayer[side];
  }
}
