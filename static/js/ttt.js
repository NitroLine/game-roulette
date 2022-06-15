const EMPTY = ' ';
const playerSides = {first: "X", second: "O"};

let side = null;
let opponentSide = null;
let currentMove = 'X';

let game = init();
renderGrid(3);


socket.on("startGame", async (peerId, playerSide) => {
    console.log(playerSide); //LOG
    side = playerSides[playerSide];
    opponentSide = side === 'X' ? 'O' : 'X';
    currentMove = 'X'
    startGame();
});

socket.on("move", (move) => {
    console.log(move);
    renderSymbolInCell(opponentSide, move.row, move.col);
    currentMove = side;
});

function init() {
    let game = document.getElementById('game');

    let container = document.createElement('div');
    container.className = 'container';

    let table = document.createElement('table');
    table.className = 'table';

    let tbody = document.createElement('tbody');
    tbody.id = 'fieldWrapper';

    table.append(tbody);
    container.append(table)
    game.append(container);
    return tbody;
}

function startGame() {
    game.innerHTML = "";
    renderGrid(3);
}

function renderGrid(dimension) {
    game.innerHTML = '';
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        game.appendChild(row);
    }
}

async function cellClickHandler(row, col) {
    if (currentMove !== side)
        return;
    let result = await socket.request({row, col});
    if (result === MoveStatus.BAD_MOVE) return;
    renderSymbolInCell(side, row, col);
    currentMove = opponentSide;
    console.log(`Clicked on cell: ${row}, ${col}`);
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = game.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}