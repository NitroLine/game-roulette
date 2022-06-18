import {ChessGame} from "./chess-game.js";
import {TTTGame} from "./ttt-game.js";
import {RusRouletteGame} from "./rus-roulette-game.js";

const games = {chess: ChessGame, ttt: TTTGame, rusRoulette: RusRouletteGame};

export {games};