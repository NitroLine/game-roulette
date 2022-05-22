import {Chess} from 'chess.js';
import {GameStatus, MoveStatus} from './enums.js';
import {BaseGame} from './base-game.js';

const playerColor = {w: "First", b: "Second"};

class ChessGame extends BaseGame {

    constructor() {
        super();
        this.chessGame = null;
    }

    start() {
        this.chessGame = new Chess();
    }

    move(player, step) {
        let moveStatus = this.chessGame.move(step);
        if (moveStatus === null) return MoveStatus.BAD_MOVE;
        return MoveStatus.OK;
    }

    getStatus() {
        if (this.chessGame.in_checkmate())
            return {status: GameStatus.WIN, side: this._getPlayerSide(this.chessGame.turn())};
        else if (this._isDraw()) return {status: GameStatus.DRAW};
        else return {status: GameStatus.NOTHING};
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

export {ChessGame};