
let chamber = 1;
let side = null;
const playerSides = {first: "first", second: "second"};
let currentMove = playerSides.first
initGame()

function initGame() {
    $('#game').append($(`
        <div id="rus_roulette" onclick="makeMove()">
              <div id="title" style="display: none">
                   
              </div>
            <div id="gun">
                    :
              </div>
        </div>
    `));
}

socket.on("startGame", async (peerId, playerSide) => {
    side = playerSide;
    currentMove = playerSides.first
    chamber = 0
    document.getElementById('title').style.display = 'none';
    document.getElementById('gun').style.cssText='-webkit-transform:rotate('+chamber*60+'deg);-moz-transform:rotate('+chamber*60+'deg);transform:rotate('+chamber*60+'deg)';
});

socket.on("move", () => {
    roundGun();
    console.log(currentMove)
    currentMove = side;
});

socket.on("gameOver", (status, playerSide) => {
    if (playerSide === side){
        document.getElementById('title').style.display = 'block';
    }
})

function roundGun(){
    if(chamber === 6)
        chamber = 0
    document.getElementById('gun').style.cssText='-webkit-transform:rotate('+chamber*60+'deg);-moz-transform:rotate('+chamber*60+'deg);transform:rotate('+chamber*60+'deg)';
    chamber++;
}

async function makeMove(){
    console.log(currentMove, side)
    if (side !== currentMove)
        return
    let result = await socket.request()
    if (result === MoveStatus.BAD_MOVE) return;
    currentMove = null;
    roundGun();
}

