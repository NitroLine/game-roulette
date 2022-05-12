const express = require('express')
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const port = 3000;

const server = http.Server(app).listen(port);
const io = socketIO(server);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

let queue = [];

io.on("connection", (socket) => {
    let roomId = null;
    socket.on("addToQueue", (peerId) => {
        console.log(queue.length);
        if (queue.length >= 1) {
            let opponentSocket = queue.pop();
            roomId = opponentSocket.peerId;
            socket.join(opponentSocket.peerId);
            socket.emit("joinGame", opponentSocket.peerId);

            let chessOrientation = ["white", "black"];
            let randIndex = getRandomInt(0, 2);
            socket.emit("startGame", chessOrientation[randIndex]);
            opponentSocket.emit("startGame", chessOrientation[1 - randIndex]);
        } else {
            roomId = peerId;
            socket.join(peerId);
            socket.peerId = peerId;
            queue.push(socket);
        }
    });
    socket.on("disconnect", () => {
        queue = queue.filter(s => s.peerId !== roomId);
        socket.to(roomId).emit("leavePartner");
        console.log("disconnect");
    });
});


app.use('/', express.static(path.join(__dirname, 'static')))