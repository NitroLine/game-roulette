import {GameType} from './enums.js';
import {ChessGame} from './chess-game.js';

class Room {
    constructor(player1, gameType) {
        this.player1 = player1;
        this.player2 = null;
        this.gameType = gameType;
        this.game = null;

        switch (gameType) {
            case GameType.CHESS:
                this.game = ChessGame();
                break;
            case GameType.TTT:
                this.game = TTTGame();
        }
    }

    setPlayer2(player2) {
        this.player2 = player2;
    }
}

export {Room};