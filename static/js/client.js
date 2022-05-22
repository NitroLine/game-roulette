const socket = io("ws://localhost:3000");

const GameStatus = {WIN: "win", DRAW: "draw"};
const MoveStatus = {OK: "ok", BAD_MOVE: "bad move"};
const GameType = {CHESS: "chess", TTT: "tic tac toe"};
let gameType = GameType.CHESS; //TODO: доставать из урла

let playerNumber = null;

socket.request = function (event, arg) {
    return new Promise(resolve => {
        socket.emit(event, arg, (answer) => {
            resolve(answer);
        });
    });
}

socket.on("startGame", async (peerId, playerSide) => {
    await video.connect(peerId);
    playerNumber = playerSide;
});

socket.on("gameOver", (status, playerSide) => {
    switch (status) {
        case GameStatus.WIN:
            if (playerNumber === playerSide) {
                console.log("You Win"); //LOG
            } else {
                console.log("You lose"); //LOG
            }
            break;
        case GameStatus.DRAW:
            console.log("Draw"); //LOG
            break;
        default:
            console.log("Nothing happened"); //LOG
            break;
    }
});
