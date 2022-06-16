const playerSides = {first: "while", second: "black"};

let side = null;
let opponentSide = null;


initGame();

socket.on("startGame", async (peerId, playerSide) => {
    console.log(playerSide); //LOG
    game = new Chess();
    let config = {
        draggable: true,
        position: 'start',
        orientation: playerSides[playerSide],
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMoveEnd: onMoveEnd,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };
    side = playerSides[playerSide][0];
    opponentSide = side === 'w' ? 'b' : 'w';
    board = Chessboard('game', config);
});

socket.on("move", (move) => {
    game.move(move);
    console.log(move);
    document.getElementById('move-sound').play();
    board.position(game.fen());
});


let board = null;
let $board = $('#game');
let game = null;
let squareToHighlight = null;
let squareClass = 'square-55d63';
let whiteSquareGrey = '#a9a9a9';
let blackSquareGrey = '#696969';

async function initGame() {
    addAudio();
    await addScripts();
    board = Chessboard('game', 'start');
    game = new Chess();
}

function removeGreySquares() {
    $('#game .square-55d63').css('background', '');
}

function greySquare(square) {
    let $square = $('#game .square-' + square);

    let background = whiteSquareGrey;
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey;
    }

    $square.css('background', background);
}

function onMouseoverSquare(square, piece) {
    if (piece && piece[0] === opponentSide) return;
    let moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (let i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
}

function onMouseoutSquare() {
    removeGreySquares();
}


function removeHighlights(color) {
    $board.find('.' + squareClass).removeClass('highlight-' + color);
}

function onDragStart(source, piece) {
    if (game.game_over()) return false;
    if (piece && piece[0] === opponentSide) return false;
}

async function onDrop(source, target) {
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    let status = await socket.request({from: source, to: target, promotion: 'q'});
    if (status === MoveStatus.BAD_MOVE) return;

    document.getElementById('move-sound').play();

    removeHighlights('white');
    $board.find('.square-' + source).addClass('highlight-white');
    $board.find('.square-' + target).addClass('highlight-white');
}

function onMoveEnd() {
    $board.find('.square-' + squareToHighlight).addClass('highlight-black');
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
    return new Promise(resolve => {
        $.getScript(script, resolve);
    });
}

async function addScripts() {
    await loadScript("https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js");
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.12.0/chess.js");
}