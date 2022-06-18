import { BaseGame } from "./base-game.js";
import { GameStatus, MoveStatus, PlayerSide } from "../server/enums.js";

export class RusRouletteGame extends BaseGame {
  constructor() {
    super();
    this.currentPlayer = PlayerSide.FIRST;
    this.dead = null;
    this.size = 6;
    this.drum = new Array(this.size).fill(0);
  }

  start() {
    this.drum[Math.floor(Math.random() * this.drum.length)] = 1;
  }

  move(player, step) {
    if (this.dead || player !== this.currentPlayer) { return MoveStatus.BAD_MOVE; }
    const isBullet = this.drum.pop() === 1;
    if (isBullet) { this.dead = this.currentPlayer; }
    this.currentPlayer = this._getOppositeSide(this.currentPlayer);
    return MoveStatus.OK;
  }

  getStatus() {
    if (this.dead === null) {
      return { status: GameStatus.NOTHING };
    }
    return { status: GameStatus.WIN, side: this._getOppositeSide(this.dead) };
  }

  _getOppositeSide(side) {
    return (side === PlayerSide.FIRST) ? PlayerSide.SECOND : PlayerSide.FIRST;
  }
}
