import { games } from "./games.js";

export class Room {
  constructor(player1, gameType) {
    this.player1 = player1;
    this.player2 = null;
    this.gameType = gameType;
    this.gameOver = false;
    this.game = new games[gameType]();
  }

  setPlayer2(player2) {
    this.player2 = player2;
  }
}
