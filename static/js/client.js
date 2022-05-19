import {GameStatus} from "./enums";

const socket = io("ws://localhost:3000");

let chessboard = Chessboard('game', 'start');

let side = null;

socket.on("startGame", async (peerId, playerSide) => {
    await video.connect(peerId);

    side = playerSide;
    console.log(playerSide); //LOG

    let config = {
        position: 'start',
        orientation: playerSide
    }
    chessboard = Chessboard('game', config);
});

socket.on("gameOver", (status, playerSide) => {
    switch (status) {
        case GameStatus.WIN && side === playerSide:
            console.log("You Won!"); //LOG
            break;
        case GameStatus.WIN && side !== playerSide:
            console.log("You lose"); //LOG
            break
        case GameStatus.DRAW:
            console.log("Draw"); //LOG
            break;
        default:
            console.log("Nothing happened"); //LOG
            break;
    }
})
