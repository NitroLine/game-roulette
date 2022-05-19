const socket = io("ws://localhost:3000");

let chessboard = Chessboard('game', 'start');

socket.on("joinGame", async (peerId) => {
    await video.connect(peerId);
});

socket.on("leavePartner", () => {
    // ...
    console.log("Opponent leave");
});

socket.on("startGame", async (peerId, playerSide) => {
    await video.connect(peerId);
    console.log(playerSide);

    let config = {
        position: 'start',
        orientation: playerSide
    }
    chessboard = Chessboard('game', config);
});
