import {Chess} from "chess.js";
import {socket} from "../client.js";
import {MoveStatus} from "../../../server/enums.js";

const playerSides = { first: "while", second: "black" };

let side = null;
let opponentSide = null;



socket.on("startGame", async(peerId, playerSide) => {
  console.log(playerSide); // LOG
  game = new Chess();
  const config = {
    draggable: true,
    position: "start",
    orientation: playerSides[playerSide],
    onDragStart,
    onDrop,
    onMoveEnd,
    onMouseoutSquare,
    onMouseoverSquare,
    onSnapEnd
  };
  side = playerSides[playerSide][0];
  opponentSide = side === "w" ? "b" : "w";
  board = Chessboard("game", config);
});

socket.on("move", (move) => {
  game.move(move);
  console.log(move);
  document.getElementById("move-sound").play();
  board.position(game.fen());
});

let board = null;
const $board = $("#game");
let game = null;
const squareToHighlight = null;
const squareClass = "square-55d63";
const whiteSquareGrey = "#a9a9a9";
const blackSquareGrey = "#696969";

export async function initGame() {
  addAudio();
  addStyles();
  await addScripts();
  board = Chessboard("game", "start");
  game = new Chess();
}

function addStyles() {
  $("head").append($(`
    <link crossorigin="anonymous"
          href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css"
          integrity="sha384-q94+BZtLrkL1/ohfjR8c6L+A6qzNH9R2hBLwyoAfu3i/WCvQjzL2RQJ3uNHDISdU"
          rel="stylesheet">
    `));
}

function removeGreySquares() {
  $("#game .square-55d63").css("background", "");
}

function greySquare(square) {
  const $square = $(`#game .square-${square}`);

  let background = whiteSquareGrey;
  if ($square.hasClass("black-3c85d")) {
    background = blackSquareGrey;
  }

  $square.css("background", background);
}

function onMouseoverSquare(square, piece) {
  if (piece && piece[0] === opponentSide) {
    return;
  }

  const moves = game.moves({
    square,
    verbose: true
  });

  if (moves.length === 0) {
    return;
  }

  greySquare(square);

  for (let i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
}

function onMouseoutSquare() {
  removeGreySquares();
}

function removeHighlights(color) {
  $board.find(`.${squareClass}`).removeClass(`highlight-${color}`);
}

function onDragStart(source, piece) {
  if (game.game_over()) {
    return false;
  }
  $(document).on('touchstart', function(e) {
    e.preventDefault();
  });

  if (piece && piece[0] === opponentSide) {
    return false;
  }
}

async function onDrop(source, target) {
  $(document).off('touchstart');
  const move = game.move({
    from: source,
    to: target,
    promotion: "q"
  });

  if (move === null) {
    return "snapback";
  }

  const status = await socket.move({ from: source, to: target, promotion: "q" });
  if (status === MoveStatus.BAD_MOVE) {
    return;
  }

  document.getElementById("move-sound").play();

  removeHighlights("white");
  $board.find(`.square-${source}`).addClass("highlight-white");
  $board.find(`.square-${target}`).addClass("highlight-white");
}

function onMoveEnd() {
  $board.find(`.square-${squareToHighlight}`).addClass("highlight-black");
}

function onSnapEnd() {
  board.position(game.fen());
}

function addAudio() {
  $("#audios").append($(`
        <audio id="move-sound">
            <source src="../assets/audio/chess_move.mp3" type="audio/mp3">
        </audio>
    `));
}

function loadScript(script) {
  return new Promise((resolve) => {
    $.getScript(script, resolve);
  });
}

async function addScripts() {
  await loadScript("https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js");
}
