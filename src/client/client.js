import io from 'socket.io-client'
import {GameStatus} from "../services/enums.js";
import {MoveStatus} from "../services/enums.js";
import {PlayerSide} from "../services/enums.js";
import {openModal, video} from "./video-chat.js";

export const socket = io(`${window.location.protocol}//${window.location.host}`);


const GameScript = {
  chess: () => import(/* webpackChunkName: "chess" */ './games/chess.js'),
  ttt: () => import(/* webpackChunkName: "ttt" */ './games/ttt.js'),
  rusRoulette: () => import(/* webpackChunkName: "rusRoulette" */ './games/rus-roulette.js')
};

const winMessage = "You Win!";
const loseMessage = "You Lose!";
const drawMessage = "Draw!";
const technicalMessage = "You opponent left this game!";

const searchParams = new URLSearchParams(window.location.search)
export const gameType = searchParams.get("type");
export const username = searchParams.get("name");

let enemyUsername = null;
let isGameStartMove = false;

window.addEventListener('load', ()=>{
  viewPlayerUsernames(username);
  GameScript[gameType]().then(module=>{
    module.initGame()
  });
})


let playerNumber = null;

socket.move = function(arg) {
  return new Promise((resolve) => {
    socket.emit("move", arg, (status) => {
      if (status === MoveStatus.BAD_MOVE) {
        resolve(status);
        return;
      }
      isGameStartMove = true;
      changeWhoMoveView(getOpponentSide(playerNumber), playerNumber);
      resolve(status);
    });
  });
};

socket.on("startGame", async(peerId, playerSide, opponentUsername) => {
  isGameStartMove = false;
  await video.connect(peerId);
  playerNumber = playerSide;
  enemyUsername = opponentUsername;
  document.getElementById("start-game-sound").play();
  viewPlayerUsernames(username, enemyUsername);
  changeWhoMoveView(PlayerSide.FIRST, PlayerSide.SECOND);
});

socket.on("gameOver", (status, playerSide) => {
  switch (status) {
    case GameStatus.WIN:
      if (playerNumber === playerSide) {
        console.log("You Win"); // LOG
        openModal(winMessage);
        isGameStartMove = false;
        document.getElementById("status").innerHTML = "You win";
      } else {
        console.log("You lose"); // LOG
        openModal(loseMessage);
        isGameStartMove = false;
        document.getElementById("status").innerHTML = "You lose";
      }

      break;
    case GameStatus.DRAW:
      console.log("Draw"); // LOG
      openModal(drawMessage);
      isGameStartMove = false;
      document.getElementById("status").innerHTML = "Draw";
      break;
    case GameStatus.TECH_WIN:
      console.log("TECH WIN"); // LOG
      if (isGameStartMove) {
        openModal(winMessage, technicalMessage);
        isGameStartMove = false;
      }

      break;
    default:
      console.log("Nothing happened"); // LOG
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
  const prevVideo = (prevPlayer === playerNumber) ? ".remote-player" : ".local-player";
  const nextVideo = (nextPlayer === playerNumber) ? ".remote-player" : ".local-player";
  console.log(prevVideo, nextVideo, prevPlayer, nextPlayer);
  document.querySelector(prevVideo).classList.remove("border");
  document.querySelector(nextVideo).classList.add("border");
}

export function getOpponentSide(playerSide) {
  return (playerSide === PlayerSide.FIRST) ? PlayerSide.SECOND : PlayerSide.FIRST;
}

export function viewPlayerUsernames(currName, enemyName = "...") {
  document.getElementById("player-name").innerText = currName;
  document.getElementById("enemy-name").innerText = enemyName;
}
