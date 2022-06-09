import express from 'express';
import path from 'path';
import http from 'http';
import https from 'https';
import {Server} from 'socket.io';
import {fileURLToPath} from 'url';

import {games} from "./games/games.js";
import {getOpponentSide, getRandomInt} from './server/utils.js';
import {Room} from './server/room.js';
import {GameStatus, PlayerSide} from './server/enums.js';
import config from './server/config.js';
import fs from "fs";

const app = express();
const port = config.listenPort;
const {isTls, sslKey, sslCrt} = config;
if (isTls && (!fs.existsSync(sslKey) || !fs.existsSync(sslCrt))) {
    console.error('SSL files are not found. check your config.js file');
    process.exit(0);
}

const webServer = isTls ? https.createServer({
    cert: fs.readFileSync(sslCrt),
    key: fs.readFileSync(sslKey)
}, app) : http.Server(app);
webServer.on('error', (err) => {
    console.error('starting web server failed:', err.message);
});

const server = webServer.listen(port, config.listenIp, () => {
    console.info('server is running');
    console.info(`open http${isTls ? 's' : ''}://${config.listenIp}:${port} in your web browser`);
});


const io = new Server(server);

const playerSides = [PlayerSide.FIRST, PlayerSide.SECOND];
let queue = [];

io.on("connection", (socket) => {
    let room = null;

    socket.on("addToQueue", (peerId, gameType, username) => {
        socket.peerId = peerId;
        socket.username = username;
        if (!(gameType in games)) {
            socket.emit("invalidGame", gameType);
            socket.disconnect();
            return;
        }
        if (queue.some(r => r.gameType === gameType)) {
            room = queue.find(r => r.gameType === gameType);
            queue = queue.filter(r => r !== room);

            room.setPlayer2(socket);

            let index = getRandomInt(0, 2);
            room.player1.side = playerSides[index];
            room.player2.side = playerSides[1 - index];

            room.player1.emit("startGame", room.player2.peerId, room.player1.side, room.player2.username);
            room.player2.emit("startGame", room.player1.peerId, room.player2.side, room.player1.username);

            room.game.start();
            console.log("startGame"); //LOG
        } else {
            room = new Room(socket, gameType);
            queue.push(room);

            console.log("createRoom"); //LOG
        }
    });

    socket.on("disconnect", () => {
        console.log("disconnect"); //LOG
        if (queue.some(r => r.player1 === socket)) {
            queue = queue.filter(r => r.player1 !== socket);
            return;
        }
        if (room === null) return;

        room.player1.emit("gameOver", GameStatus.WIN, getOpponentSide(socket.side));
        room.player2.emit("gameOver", GameStatus.WIN, getOpponentSide(socket.side));
    });

    socket.on("move", (move, callback) => {
        console.log("move", move);
        let status = room.game.move(socket.side, move);
        if (room.player1.side === socket.side)
            room.player2.emit("move", move);
        else room.player1.emit("move", move);
        callback(status);

        let gameStatus = room.game.getStatus();
        if (gameStatus.status !== GameStatus.NOTHING) {
            room.player1.emit("gameOver", gameStatus.status, gameStatus.side);
            room.player2.emit("gameOver", gameStatus.status, gameStatus.side);
        }
    });
});


app.use('/v/', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'static')))
app.use('/', (req, res) => {
    if (req.originalUrl !== '/') {
        res.status(404).send('Sorry, we cannot find that!');
    }
    res.redirect('/v/')
})
