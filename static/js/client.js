const socket = io(`${window.location.protocol}//${window.location.host}`);
const GameStatus = {WIN: "win", DRAW: "draw"};
const MoveStatus = {OK: "ok", BAD_MOVE: "bad move"};
const GameScript = {chess: "../js/chess.js", ttt: "../js/ttt.js"}
const PlayerSide = {FIRST: "first", SECOND: "second"};

let gameType = new URLSearchParams(window.location.search).get("type");
let username = new URLSearchParams(window.location.search).get("name");
viewPlayerUsernames(username);
let enemyUsername = null;

let script = document.createElement("script");
script.src = GameScript[gameType];
document.getElementById("scripts").appendChild(script);

let playerNumber = null;
let currentMove = PlayerSide.FIRST;

socket.request = function (arg) {
    return new Promise((resolve, reject) => {
        socket.emit("move", arg, (status) => {
            if (status === MoveStatus.BAD_MOVE) {
                resolve(status);
                return;
            }
            viewPlayerUsernames(username, enemyUsername);
            changeWhoMoveView(getOpponentSide(playerNumber), playerNumber);
            resolve(status);
        });
    });
}

socket.on("startGame", async (peerId, playerSide, opponentUsername) => {
    await video.connect(peerId);
    playerNumber = playerSide;
    enemyUsername = opponentUsername

    viewPlayerUsernames(username, enemyUsername);
    changeWhoMoveView(PlayerSide.FIRST, PlayerSide.SECOND);
});

socket.on("gameOver", (status, playerSide) => {
    switch (status) {
        case GameStatus.WIN:
            if (playerNumber === playerSide) {
                console.log("You Win"); //LOG
                document.getElementById('status').innerHTML = "You win";
            } else {
                console.log("You lose"); //LOG
                document.getElementById('status').innerHTML = "You lose";
            }
            break;
        case GameStatus.DRAW:
            console.log("Draw"); //LOG
            document.getElementById('status').innerHTML = "Draw";
            break;
        default:
            console.log("Nothing happened"); //LOG
            break;
    }
});

socket.on("invalidGame", (invalidGame) => {
    document.getElementById("status").innerText = `game ${invalidGame} does not exist`;
});

socket.on("move", () => {
    changeWhoMoveView(playerNumber, getOpponentSide(playerNumber));
});

function changeWhoMoveView(prevPlayer, nextPlayer) {
    let prevVideo = (prevPlayer === playerNumber) ? 'remote-video' : 'local-video';
    let nextVideo = (nextPlayer === playerNumber) ? 'remote-video' : 'local-video';
    console.log(prevVideo, nextVideo, prevPlayer, nextPlayer);
    document.getElementById(prevVideo).classList.remove('border');
    document.getElementById(nextVideo).classList.add('border');
}

function getOpponentSide(playerSide) {
    return (playerSide === PlayerSide.FIRST) ? PlayerSide.SECOND : PlayerSide.FIRST;
}

function viewPlayerUsernames(currName, enemyName = "...") {
    document.getElementById("player-name").innerText = currName;
    document.getElementById("enemy-name").innerText = enemyName;
}