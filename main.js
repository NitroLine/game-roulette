import express from 'express';
import path from 'path';
import http from 'http';
import {Server} from 'socket.io';
import {fileURLToPath} from 'url';

import {getRandomInt} from './utils.js';
import {Room} from './room.js';
import {PlayerSide, GameStatus} from './enums.js';

const app = express();
const port = 3000;
const server = http.Server(app).listen(port);
const io = new Server(server);


const playerSides = [PlayerSide.FIRST, PlayerSide.SECOND];
let queue = [];

io.on("connection", (socket) => {
    let room = null;

    socket.on("addToQueue", (peerId, gameType) => {
        socket.peerId = peerId;
        if (queue.some(r => r.gameType === gameType)) {
            room = queue.find(r => r.gameType === gameType);
            queue = queue.filter(r => r !== room);

            room.setPlayer2(socket);

            let index = getRandomInt(0, 2);
            room.player1.side = playerSides[index];
            room.player2.side = playerSides[1 - index];

            room.player1.emit("startGame", room.player2.peerId, room.player1.side);
            room.player2.emit("startGame", room.player1.peerId, room.player2.side);

            console.log("startGame"); //LOG
        } else {
            room = new Room(socket, gameType);
            queue.push(room);

            console.log("createRoom"); //LOG
        }
    });

    socket.on("disconnect", () => {
        if (queue.some(r => r.player1 === socket))
            queue = queue.filter(r => r.player1 === socket);

        room.player1.emit("gameOver", GameStatus.WIN, socket.side);
        room.player2.emit("gameOver", GameStatus.WIN, socket.side);
        
        console.log("disconnect"); //LOG
    });
});


app.use('/', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'static')))