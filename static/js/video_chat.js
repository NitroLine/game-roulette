const video = new VideoClient(true);

async function init(){
    await video.startLocalStream();
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

    video.events.on('peerFound', (peerID)=>{
        document.getElementById('uuid').innerHTML = peerID;
        socket.emit("addToQueue", peerID);
    })
    video.events.on('data', (data) => {
        chatList.push('2 ' + data);
        document.getElementById('messages').innerHTML = chatList.join("<br>");
    });
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
// const peer = new Peer();
//
// const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// let conn;
//
// peer.on('open', function (peerID) {
//     document.getElementById('uuid').innerHTML = peerID;
//     socket.emit("addToQueue", peerID);
// });
//
// function connect(peerId) {
//     conn = peer.connect(peerId);
//     conn.on('open', function () {
//         document.getElementById('status').innerHTML = "connected";
//     });
//     conn.on('data', function (data) {
//         chatList.push('2 ' + data);
//         document.getElementById('messages').innerHTML = chatList.join("<br>");
//     })
//     getUserMedia({screen: true, audio: true}, function (stream) {
//         document.getElementById("local-video").srcObject = stream;
//         //document.getElementById("local-video").play();
//         let call = peer.call(peerId, stream);
//         call.on('stream', function (remoteStream) {
//             document.getElementById("remote-video").srcObject = remoteStream;
//             //document.getElementById("remote-video").play();
//         });
//     })
//
// }
//
// peer.on('call', function (call) {
//     getUserMedia({screen: true, audio: true}, function (stream) {
//         document.getElementById("local-video").srcObject = stream;
//         //document.getElementById("local-video").play();
//         call.answer(stream); // Answer the call with an A/V stream.
//         call.on('stream', function (remoteStream) {
//             document.getElementById("remote-video").srcObject = remoteStream;
//             //document.getElementById("remote-video").play();
//         });
//     }, function (err) {
//         console.log('Failed to get local stream', err);
//     });
// });
//
//
//

//
// peer.on('connection', function (c) {
//     conn = c;
//     conn.on('open', function () {
//         document.getElementById('status').innerHTML = 'connected';
//
//         conn.on('data', function (data) {
//             chatList.push('2 ' + data);
//             document.getElementById('messages').innerHTML = chatList.join("<br>");
//         })
//     });
// })