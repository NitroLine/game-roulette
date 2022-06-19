import { PlayerSide } from "../../services/enums.js";

/**
 * @typedef {Object} MoveResult
 * @property {String} status - MoveStatus Enum
 * @property {String} [side] - PlayerSide Enum
 */

class BaseGame {
    /**
     * Start game
     */
    start() {
    }

    /**
     * Handle move
     * @param {PlayerSide} player current player
     * @param {Object} step move
     * @return {String} Return MoveStatus enum
     */
    move(player, step) {
    }

    /**
     * @return {MoveResult}  Return GameStatus enum
     */
    getStatus() {
    }
}

export { BaseGame };
