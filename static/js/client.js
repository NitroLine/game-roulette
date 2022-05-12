const socket = io("ws://localhost:3000");

socket.on("joinGame", async (peerId) => {
    await video.connect(peerId);
});

socket.on("leavePartner", () => {
    document.getElementById('uuid').innerHTML = "You lose. Loser";
    console.log("Opponent leave");
});
