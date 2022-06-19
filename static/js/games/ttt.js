import {socket} from "../client.js";
import {MoveStatus} from "../../../server/enums.js";

const EMPTY = " ";
const playerSides = { first: "X", second: "O" };

let side = null;
let opponentSide = null;
let currentMove = "X";
let game = null;

export function initGame(){
  addAudios();
  addStyles();
  game = initField()
  renderGrid(3);
}


socket.on("startGame", async(peerId, playerSide) => {
  console.log(playerSide); // LOG
  side = playerSides[playerSide];
  opponentSide = side === "X" ? "O" : "X";
  currentMove = "X";
  startGame();
});

socket.on("move", (move) => {
  console.log(move);
  renderSymbolInCell(opponentSide, move.row, move.col);
  currentMove = side;
});

function initField() {
  $("#game").append($(`
        <div class="container">
            <table class="table">
                <tbody id="fieldWrapper"></tbody>
            </table>
        </div>
    `));
  return document.getElementById("fieldWrapper");
}

function addStyles() {
  $("head").append($(`
        <link href="../css/ttt/style.css" rel="stylesheet">
    `));
}

function startGame() {
  game.innerHTML = "";
  renderGrid(3);
}

function renderGrid(dimension) {
  game.innerHTML = "";
  for (let i = 0; i < dimension; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < dimension; j++) {
      const cell = document.createElement("td");
      cell.textContent = EMPTY;
      cell.addEventListener("click", () => cellClickHandler(i, j));
      row.appendChild(cell);
    }

    game.appendChild(row);
  }
}

async function cellClickHandler(row, col) {
  if (currentMove !== side) {
    return;
  }

  const result = await socket.move({ row, col });
  if (result === MoveStatus.BAD_MOVE) {
    return;
  }

  renderSymbolInCell(side, row, col);
  currentMove = opponentSide;
  console.log(`Clicked on cell: ${row}, ${col}`);
}

function renderSymbolInCell(symbol, row, col, color = "#333") {
  $("#move-sound").trigger("play");
  const targetCell = findCell(row, col);
  targetCell.textContent = symbol;
  targetCell.style.color = color;
}

function findCell(row, col) {
  const targetRow = game.querySelectorAll("tr")[row];
  return targetRow.querySelectorAll("td")[col];
}

function addAudios() {
  $("#audios").append($(`
        <audio id="move-sound">
            <source src="../assets/audio/ttt_move.mp3" type="audio/mp3">
        </audio>
    `));
}
