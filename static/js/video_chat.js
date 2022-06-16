const video = new VideoClient(true);
let micOn = true;
let myPeerId = null;
let isFirst = true;
let isActive = true;
const statusEl = document.getElementById('status');
const btn = document.getElementById('start_btn');

async function init() {
    video.events.on('localstreamupdate', (stream) => {
        document.getElementById("local-video").srcObject = stream;
        document.getElementById("local-video").style.display = 'block';
        document.getElementById("noise_local").style.display = 'none';
    });

    video.events.on('remotestreamupdate', (stream) => {
        document.getElementById("remote-video").style.display = 'block';
        document.getElementById("remote-video").srcObject = stream;
        document.getElementById("noise_remote").style.display = 'none';
    });

    video.events.on('connected', () => {
        statusEl.innerHTML = "Connected";
        btn.disabled = false;
    });

    video.events.on('closed', () => {
        statusEl.innerHTML = "Opponent exit. ";
        btn.disabled = true;
        document.getElementById("remote-video").style.display = 'none';
        document.getElementById("remote-video").style.display = 'none';
        document.getElementById("noise_remote").style.display = 'block';
    });

    video.events.on('peerFound', (peerID) => {
        myPeerId = peerID;
        console.log("PEER FOUND");
        if (isFirst) {
            btn.disabled = false;
            btn.onclick = start;
            statusEl.innerHTML = "Press ready button";
            isFirst = false;
        } else if (isActive) {
            start();
        }
        else {
            btn.disabled = false
            btn.onclick = start
        }
    });
    video.events.on('data', (data) => {
        let chatElement = createChatElement(data);
        let messages = document.getElementById('messages');
        messages.append(chatElement);
        messages.scrollTop = messages.scrollHeight;
        chatList.push(chatElement);
    });
    try {
        await video.startLocalStream({video: true, audio: true});
    } catch (e) {
        try {
            await video.startLocalStream({video: false, audio: true});
        } catch (e) {
            document.getElementById('status').innerHTML = "Error while starting stream " + String(e);
        }
    }
    video.init();
}

function start() {
    console.log("START")
    socket.emit("addToQueue", myPeerId, gameType, username);
    statusEl.innerHTML = "Searching opponent...";
    btn.disabled = true;
    btn.onclick = nextOpponent;
    btn.innerHTML = "Next";
    video.active = true;
    isActive = true;
}

function nextOpponent() {
    console.log("NEXT OPPONENT");
    viewPlayerUsernames(username);
    video.close();
    video.active = true;
    socket.emit("leave");
    btn.disabled = true;
    isActive = true;
}

function createChatElement(message, answer = false) {
    let chatElement = document.createElement('div')
    chatElement.classList.add('chat-message')
    if (answer)
        chatElement.classList.add('chat-answer')
    let chatText = document.createElement('div');
    chatText.className = 'chat-message-text';
    let p = document.createElement('p')
    p.innerText = message;
    chatText.append(p);
    chatElement.append(chatText);
    return chatElement;
}

let chatList = [];
document.getElementById('inputmess').addEventListener('keyup', sendMessage)

function sendMessage(event) {
    if (event.key !== 'Enter')
        return
    let newMessage = document.getElementById('inputmess').value;
    document.getElementById('inputmess').value = '';
    if (newMessage.length <=1)
        return;
    if (video.conn && video.conn.open) {
        video.conn.send(newMessage);
    }
    let chatElement = createChatElement(newMessage, true)
    let messages = document.getElementById('messages');
    messages.append(chatElement);
    messages.scrollTop = messages.scrollHeight;
    chatList.push(chatElement);
}

function toggleMic() {
    let icon = document.getElementById('mic_icon');
    if (micOn) {
        icon.classList.remove('fa-microphone');
        icon.classList.add('fa-microphone-slash');
    } else {
        icon.classList.remove('fa-microphone-slash');
        icon.classList.add('fa-microphone');
    }
    micOn = !micOn;
    video.toggleAudio(micOn)
}

function openModal(message, info = "") {
    document.getElementsByTagName('body')[0].classList.add('modal-active');
    document.getElementById('modal-container').className = 'open';
    document.getElementById('modal-message').innerText = message;
    document.getElementById('modal-info').innerText = info;
    isActive = false;
}
init();