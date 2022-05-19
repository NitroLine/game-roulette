import {Chess} from 'chess.js';
import {MoveStatus} from './enums.js';
import {BaseGame} from './base-game.js';


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
}

export {ChessGame};