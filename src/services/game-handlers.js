import { getRandomInt } from "./utils.js";
import { games } from "../models/games.js";
import { GameStatus, MoveStatus, PlayerSide } from "./enums.js";
import { Room } from "../models/room.js";

const playerSides = [PlayerSide.FIRST, PlayerSide.SECOND];
let queue = [];

export default (socket) => {
    let room = null;

    const addToQueue = (peerId, gameType, username) => {
        socket.peerId = peerId;
        socket.username = username;
        if (!(gameType in games)) {
            socket.emit("invalidGame", gameType);
            socket.disconnect();
            return;
        }
        if (!queue.some((r) => r.gameType === gameType)) {
            room = new Room(socket, gameType);
            queue.push(room);
            console.log("createRoom"); // LOG
            return;
        }
        room = queue.find((r) => r.gameType === gameType);
        queue = queue.filter((r) => r !== room);
        room.setPlayer2(socket);

        let index = getRandomInt(0, 2);
        room.player1.side = playerSides[index];
        room.player2.side = playerSides[1 - index];

        room.player1.emit("startGame", room.player2.peerId, room.player1.side, room.player2.username);
        room.player2.emit("startGame", room.player1.peerId, room.player2.side, room.player1.username);

        console.log("startGame"); // LOG
        room.game.start();
    };

    const disconnect = () => {
        console.log("disconnect"); // LOG
        if (queue.some((r) => r.player1 === socket)) {
            queue = queue.filter((r) => r.player1 !== socket);
            return;
        }

        if (room === null || room.gameOver) {
            return;
        }

        room.player1.emit("gameOver", GameStatus.TECH_WIN);
        room.player2.emit("gameOver", GameStatus.TECH_WIN);
        room.gameOver = true;
        room = null;
    };

    const leave = () => {
        console.log("leave");
        if (room === null || room.gameOver) {
            return;
        }
        if (socket === room.player1) {
            room.player2.emit("gameOver", GameStatus.TECH_WIN);
        } else {
            room.player1.emit("gameOver", GameStatus.TECH_WIN);
        }

        room.gameOver = true;
        room = null;
    };

    const move = (move, callback) => {
        console.log("move", move);
        if (!room || !room.game || !room.player2 || room.gameOver) {
            return;
        }

        const status = room.game.move(socket.side, move);
        if (status === MoveStatus.BAD_MOVE) {
            callback(status);
            return;
        }

        if (room.player1.side === socket.side) {
            room.player2.emit("move", move);
        } else {
            room.player1.emit("move", move);
        }

        callback(status);
        const gameStatus = room.game.getStatus();
        if (gameStatus.status !== GameStatus.NOTHING) {
            room.player1.emit("gameOver", gameStatus.status, gameStatus.side);
            room.player2.emit("gameOver", gameStatus.status, gameStatus.side);
            room.gameOver = true;
        }
    };

    socket.on("addToQueue", addToQueue);
    socket.on("disconnect", disconnect);
    socket.on("leave", leave);
    socket.on("move", move);
};
