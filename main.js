const express = require('express')
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const port = 3000;

const server = http.Server(app).listen(port);
const io = socketIO(server);

let queue = [];

io.on("connection", (socket) => {
    let roomId = null;
    socket.on("addToQueue", (peerId) => {
        console.log(queue);
        if (queue.length >= 1) {
            let opponentPeer = queue.pop();
            roomId = opponentPeer;
            socket.join(opponentPeer);
            socket.emit("joinGame", opponentPeer);
        } else {
            roomId = peerId;
            socket.join(peerId);
            queue.push(peerId);
        }
    });
    socket.on("disconnect", () => {
        queue = queue.filter(v => v !== roomId);
        socket.to(roomId).emit("leavePartner");
        console.log("disconnect");
    });
});


app.use('/', express.static(path.join(__dirname, 'static')))