import express from 'express';
import path from 'path';
import http from 'http';
import {Server} from 'socket.io';
import {fileURLToPath} from 'url';

import {getRandomInt} from './utils.js';
import {Room} from './room.js';
import {PlayerSide} from './static/js/enums.js';

const app = express();
const port = 3000;
const server = http.Server(app).listen(port);
const io = new Server(server);


const playerSides = [PlayerSide.FIRST, PlayerSide.SECOND];
let queue = [];

io.on("connection", (socket) => {
    socket.on("addToQueue", (peerId, gameType) => {
        socket.peerId = peerId;
        if (queue.some(r => r.gameType === gameType)) {
            let room = queue.find(r => r.gameType === gameType);
            queue = queue.filter(r => r !== room);

            room.setPlayer2(socket);

            let index = getRandomInt(0, 2);
            room.player1.emit("startGame", room.player2.peerId, playerSides[index]);
            room.player2.emit("startGame", room.player1.peerId, playerSides[1 - index]);

            console.log("startGame"); //LOG
        } else {
            let room = new Room(socket, gameType);
            queue.push(room);

            console.log("createRoom"); //LOG
        }
    });

    socket.on("disconnect", () => {
        if (queue.some(r => r.player1 === socket))
            queue = queue.filter(r => r.player1 === socket);
        // TODO: техническое поражение
        console.log("disconnect");
    });
});


app.use('/', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'static')))