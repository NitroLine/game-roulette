const playerSides = {first: "while", second: "black"};

let side = null;
let opponentSide = null;

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
    board.position(game.fen());
});

let board = Chessboard('game', 'start');
let $board = $('#game');
let game = new Chess();
let squareToHighlight = null;
let squareClass = 'square-55d63';
let whiteSquareGrey = '#a9a9a9';
let blackSquareGrey = '#696969';

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
    // get list of possible moves for this square
    let moves = game.moves({
        square: square,
        verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    greySquare(square);

    // highlight the possible squares for this piece
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
    // do not pick up pieces if the game is over
    if (game.game_over()) return false;
    if (piece && piece[0] === opponentSide) return false;
}

async function onDrop(source, target) {
    // see if the move is legal
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return 'snapback';

    let status = await socket.request({from: source, to: target, promotion: 'q'});
    if (status === MoveStatus.BAD_MOVE) return;

    // highlight white's move
    removeHighlights('white');
    $board.find('.square-' + source).addClass('highlight-white');
    $board.find('.square-' + target).addClass('highlight-white');
}

function onMoveEnd() {
    $board.find('.square-' + squareToHighlight).addClass('highlight-black');
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
    board.position(game.fen());
}
