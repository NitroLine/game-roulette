import assert from "assert";
import { TTTGame } from "../models/games/ttt-game.js";
import { MoveStatus, PlayerSide } from "../services/enums.js";

describe("All our tests", function() {
    it("super simple test", function() {
        assert.strictEqual(1 + 1, 2);
    });
});

describe("Test TTT Game", function() {
    it("Test isAnyMove when any move", function() {
        let game = new TTTGame();
        assert.strictEqual(game._isAnyMove(), true);
    });

    it("Test isAnyMove when not any move", function() {
        let game = new TTTGame();
        game.field = [["X", "O", "X"], ["O", "X", "O"], ["X", "O", "X"]];
        assert.strictEqual(game._isAnyMove(), false);
    });

    it("Test horizontal getWinnerSide", function() {
        let game = new TTTGame();
        game.field = [["X", "X", "X"], ["O", "X", "O"], ["X", "O", "O"]];
        assert.strictEqual(game._getWinnerSide(), "X");
    });

    it("Test vertical getWinnerSide", function() {
        let game = new TTTGame();
        game.field = [["O", "X", "X"], ["O", "X", "O"], ["O", "X", "O"]];
        assert.strictEqual(game._getWinnerSide(), "O");
    });

    it("Test major diagonal getWinnerSide", function() {
        let game = new TTTGame();
        game.field = [["X", "O", "X"], ["O", "X", "O"], ["O", "O", "X"]];
        assert.strictEqual(game._getWinnerSide(), "X");
    });

    it("Test minor diagonal getWinnerSide", function() {
        let game = new TTTGame();
        game.field = [["O", "X", "X"], ["O", "X", "O"], ["X", "O", "O"]];
        assert.strictEqual(game._getWinnerSide(), "X");
    });

    it("Test make move", function() {
        let game = new TTTGame();
        let moveResult = game.move(PlayerSide.FIRST, {
            row: 0,
            col: 0
        });
        assert.strictEqual(moveResult, MoveStatus.OK);
        assert.strictEqual(game.field[0][0], "X");
    });

    it("Test make bad move", function() {
        let game = new TTTGame();
        let moveResult = game.move(PlayerSide.SECOND, {
            row: 0,
            col: 0
        });
        assert.strictEqual(moveResult, MoveStatus.BAD_MOVE);
    });
});
