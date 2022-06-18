import { Chess } from "chess.js";
import { GameStatus, MoveStatus, PlayerSide } from "../server/enums.js";
import { BaseGame } from "./base-game.js";

const playerColor = { w: PlayerSide.FIRST, b: PlayerSide.SECOND };

class ChessGame extends BaseGame {
  constructor() {
    super();
    this.chessGame = null;
  }

  start() {
    this.chessGame = new Chess();
  }

  move(player, step) {
    if (this.chessGame.turn() === player[0]) {
      return MoveStatus.BAD_MOVE;
    }

    const moveStatus = this.chessGame.move(step);
    if (moveStatus === null) {
      return MoveStatus.BAD_MOVE;
    }

    return MoveStatus.OK;
  }

  getStatus() {
    if (this.chessGame.in_checkmate()) {
      return { status: GameStatus.WIN, side: this._getPlayerSide(this.chessGame.turn() === "w" ? "b" : "w") };
    }

    if (this._isDraw()) {
      return { status: GameStatus.DRAW };
    }

    return { status: GameStatus.NOTHING };
  }

  _getPlayerSide(side) {
    return playerColor[side];
  }

  _isDraw() {
    return this.chessGame.in_draw() ||
            this.chessGame.in_stalemate() ||
            this.chessGame.in_threefold_repetition() ||
            this.chessGame.insufficient_material();
  }
}

export { ChessGame };
