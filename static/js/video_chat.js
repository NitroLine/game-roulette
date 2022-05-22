const video = new VideoClient(true);

async function init() {
    video.events.on('localstreamupdate', (stream) => {
        document.getElementById("local-video").srcObject = stream;
    });

    video.events.on('remotestreamupdate', (stream) => {
        document.getElementById("remote-video").srcObject = stream;
    });

    video.events.on('connected', () => {
        document.getElementById('status').innerHTML = "connected";
    });

    video.events.on('closed', () => {
        document.getElementById('status').innerHTML = "closed";
    });

    video.events.on('peerFound', (peerID) => {
        socket.emit("addToQueue", peerID, gameType);
    });
    video.events.on('data', (data) => {
        chatList.push('2 ' + data);
        document.getElementById('messages').innerHTML = chatList.join("<br>");
    });
    try {
        await video.startLocalStream({video: true, audio: true});
    } catch (e) {
        await video.startLocalStream({video: false, audio: true});
    }
    video.init();
}

chatList = [];

function sendMessage() {
    let newmes = document.getElementById('inputmess').value;
    document.getElementById('inputmess').value = '';
    if (video.conn && video.conn.open) {
        video.conn.send(newmes);
    }
    chatList.push('1 ' + newmes);
    document.getElementById('messages').innerHTML = chatList.join("<br>");
}

init();