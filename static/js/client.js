const socket = io("ws://localhost:3000");

let chessboard = null;

socket.on("joinGame", async (peerId) => {
    await video.connect(peerId);
});

socket.on("leavePartner", () => {
    // ...
    console.log("Opponent leave");
});

socket.on("startGame", (gameOrientation) => {
    console.log(gameOrientation);

    let config = {
        position: 'start',
        orientation: gameOrientation
    }
    chessboard = Chessboard('game', config);
})
