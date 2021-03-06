import { socket } from "../client.js";
import { GameStatus, MoveStatus } from "../../services/enums.js";

let chamber = 1;
let side = null;
const playerSides = {
    first: "first",
    second: "second"
};
let currentMove = playerSides.first;

export function initGame() {
    addAudio();
    addStyles();
    $("#game").append($(`
        <div id="rus_roulette">
              <div id="title" style="display: none">
                   
              </div>
            <div id="gun">
                    :
              </div>
        </div>
    `));
  $("#rus_roulette").on("click", makeMove);
}

function addAudio() {
    $("#audios").append($(`
        <audio id="empty-shot">
            <source src="../assets/audio/empty-shot.mp3" type="audio/mp3">
        </audio>
        <audio id="death-shot">
            <source src="../assets/audio/inecraft_death.mp3" type="audio/mp3">
        </audio>
         <audio id="shot-sound">
            <source src="../assets/audio/revolver-6.mp3" type="audio/mp3">
        </audio>
    `));
}

function addStyles() {
    $("head").append($(`
        <link href="../css/rus-roullete/style.css" rel="stylesheet">
    `));
}

socket.on("startGame", async(peerId, playerSide) => {
    side = playerSide;
    currentMove = playerSides.first;
    chamber = 0;
    document.getElementById("title").style.display = "none";
    document.getElementById("gun").style.cssText = "-webkit-transform:rotate(" + chamber * 60 + "deg);-moz-transform:rotate(" + chamber * 60 + "deg);transform:rotate(" + chamber * 60 + "deg)";
    chamber++;
});

socket.on("move", () => {
    roundGun();
    console.log(currentMove);
    currentMove = side;
    $("#empty-shot").trigger("play");
});

socket.on("gameOver", (status, playerSide) => {
    if (status !== GameStatus.TECH_WIN) {
        $("#shot-sound").trigger("play");
        if (playerSide !== side) {
            $("#death-shot").trigger("play");
            document.getElementById("title").style.display = "block";
        }
    }
});

function roundGun() {
    if (chamber === 6) {
        chamber = 0;
    }
    document.getElementById("gun").style.cssText = "-webkit-transform:rotate(" + chamber * 60 + "deg);-moz-transform:rotate(" + chamber * 60 + "deg);transform:rotate(" + chamber * 60 + "deg)";
    chamber++;
}

async function makeMove() {
    console.log(currentMove, side);
    if (side !== currentMove) {
        return;
    }
    const result = await socket.move();
    if (result === MoveStatus.BAD_MOVE) return;
    currentMove = null;
    $("#empty-shot").trigger("play");
    roundGun();
}
