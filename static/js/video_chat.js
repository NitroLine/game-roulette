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
        let chatElement = createChatElement(data)
        let messages = document.getElementById('messages');
        messages.append(chatElement);
        messages.scrollTop = messages.scrollHeight;
        chatList.push(chatElement);
    });
    try {
        await video.startLocalStream({video: true, audio: true});
    } catch (e) {
        await video.startLocalStream({video: false, audio: true});
    }
    video.init();
}

function createChatElement(message, answer=false){
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
    if (video.conn && video.conn.open) {
        video.conn.send(newMessage);
    }
    let chatElement = createChatElement(newMessage, true)
    let messages = document.getElementById('messages');
    messages.append(chatElement);
    messages.scrollTop = messages.scrollHeight;
    chatList.push(chatElement);
}

init();