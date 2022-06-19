import { ChessGame } from "./games/chess-game.js";
import { TTTGame } from "./games/ttt-game.js";
import { RusRouletteGame } from "./games/rus-roulette-game.js";

const games = {
    chess: ChessGame,
    ttt: TTTGame,
    rusRoulette: RusRouletteGame
};

export { games };
