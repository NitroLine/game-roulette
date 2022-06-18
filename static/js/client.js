const socket = io(`${window.location.protocol}//${window.location.host}`);
const GameStatus = {WIN: "win", DRAW: "draw", TECH_WIN: "technical win"};
const MoveStatus = {OK: "ok", BAD_MOVE: "bad move"};
const PlayerSide = {FIRST: "first", SECOND: "second"};

const GameScript = {
    chess: "../js/games/chess.js",
    ttt: "../js/games/ttt.js",
    rusRoulette: "../js/games/rusRoulette.js"
}

const winMessage = "You Win!";
const loseMessage = "You Lose!";
const drawMessage = "Draw!";
const technicalMessage = "You opponent left this game!";

let gameType = new URLSearchParams(window.location.search).get("type");
let username = new URLSearchParams(window.location.search).get("name");
viewPlayerUsernames(username);
let enemyUsername = null;
let isGameStartMove = false;
let script = document.createElement("script");
script.src = GameScript[gameType];
document.getElementById("scripts").appendChild(script);

let playerNumber = null;

socket.request = function (arg) {
    return new Promise((resolve) => {
        socket.emit("move", arg, (status) => {
            if (status === MoveStatus.BAD_MOVE) {
                resolve(status);
                return;
            }
            isGameStartMove = true;
            viewPlayerUsernames(username, enemyUsername);
            changeWhoMoveView(getOpponentSide(playerNumber), playerNumber);
            resolve(status);
        });
    });
}

socket.on("startGame", async (peerId, playerSide, opponentUsername) => {
    isGameStartMove = false;
    await video.connect(peerId);
    playerNumber = playerSide;
    enemyUsername = opponentUsername
    document.getElementById('start-game-sound').play();
    viewPlayerUsernames(username, enemyUsername);
    changeWhoMoveView(PlayerSide.FIRST, PlayerSide.SECOND);
});

socket.on("gameOver", (status, playerSide) => {
    switch (status) {
        case GameStatus.WIN:
            if (playerNumber === playerSide) {
                console.log("You Win"); //LOG
                openModal(winMessage);
                document.getElementById('status').innerHTML = "You win";
            } else {
                console.log("You lose"); //LOG
                openModal(loseMessage);
                document.getElementById('status').innerHTML = "You lose";
            }
            break;
        case GameStatus.DRAW:
            console.log("Draw"); //LOG
            openModal(drawMessage);
            document.getElementById('status').innerHTML = "Draw";
            break;
        case GameStatus.TECH_WIN:
            console.log("TECH WIN"); //LOG
            if (isGameStartMove){
                openModal(winMessage, technicalMessage);
            }
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
    isGameStartMove = true;
});

function changeWhoMoveView(prevPlayer, nextPlayer) {
    let prevVideo = (prevPlayer === playerNumber) ? '.remote-player' : '.local-player';
    let nextVideo = (nextPlayer === playerNumber) ? '.remote-player' : '.local-player';
    console.log(prevVideo, nextVideo, prevPlayer, nextPlayer);
    $(prevVideo).removeClass('border');
    $(nextVideo).addClass('border');
}

function getOpponentSide(playerSide) {
    return (playerSide === PlayerSide.FIRST) ? PlayerSide.SECOND : PlayerSide.FIRST;
}

function viewPlayerUsernames(currName, enemyName = "...") {
    document.getElementById("player-name").innerText = currName;
    document.getElementById("enemy-name").innerText = enemyName;
}

