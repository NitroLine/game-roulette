const socket = io("ws://localhost:3000");

// send a message to the server
socket.emit("hello from client", 5, "6", {7: Uint8Array.from([8])});

// receive a message from the server
socket.on("hello from server", (...args) => {
    // ...
    console.log(args);
});

socket.on("joinGame", peerId => {
    connect(peerId);
})

socket.on("leavePartner", () => {
    document.getElementById('uuid').innerHTML = "You lose. Loser";
    console.log("Opponent leave");
});