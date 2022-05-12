const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || 0;

class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * @param {string} eventName
     * @param {Function} callback
     */
    on(eventName, callback) {
        !this.events[eventName] && (this.events[eventName] = []);
        this.events[eventName].push(callback);
    }

    /**
     * @param {string} eventName
     * @param {Function} callback
     */
    unsubscribe(eventName, callback) {
        this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
    }

    /**
     * @param {string} eventName
     * @param {any} args
     */
    emit(eventName, args) {
        const event = this.events[eventName];
        event && event.forEach(callback => callback.call(null, args));
    }
}

class VideoClient {
    constructor(_debug = true) {
        this.conn = null;
        this.myPeerId = null;
        this.peer = null;
        this.status = 'init'
        this.localStream = null;
        this._debug = _debug;
        this.remoteStream = null;
        this.events = new EventEmitter();
        this.call = null;
        this.active = false;

    }

    startLocalStream(constraints = {video: false, audio: true}) {
        return new Promise((resolve, reject) => {
            getUserMedia(constraints, (stream) => {
                this.localStream = stream;
                this.events.emit('localstreamupdate', stream);
                resolve(stream);
            }, (err) => reject(err))
        });
    }

    stopLocalStream() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
    }

    toggleAudio(audioState) {
        if (this.localStream)
            this.localStream.getAudioTracks()[0].enabled = audioState;
    }


    initPeer() {
        if (this.peer && !this.peer.destroyed) {
            this.peer.destroy()
            this.peer = null;
        }
        this.peer = new Peer();
        this.peer.on('open', (peerID) => {
            this.myPeerId = peerID;
            this.events.emit('peerFound', peerID);
            this.status = 'open';
        });


        this.peer.on('call', async (call) => {
            try {
                if (!this.localStream) {
                    await this.startLocalStream();
                }
                call.answer(this.localStream); // Answer the call with an A/V stream.
                call.on('stream', (remoteStream) => {
                    this.remoteStream = remoteStream;
                    this.events.emit('remotestreamupdate', remoteStream);
                });
                this.call = call;
            } catch (err) {
                console.error('Error on call invite', err);
            }
        });

        this.peer.on('connection', (c) => {
            this.conn = c;
            this.conn.on('open', () => {
                this.status = 'connected';
                this.events.emit('connected');
                this.conn.on('data', (data) => {
                    console.log(data);
                    this.events.emit('data', data);
                })
            });
            this.conn.on('close', () => {
                this.debug('close in conn 2')
                this.status = 'open';
                this.remoteStream = null;
                this.events.emit('closed');
                this.close();
            });
        });
    }

    sendMessage(message) {

    }

    init() {
        this.initPeer();
    }

    debug(message) {
        if (this._debug) {
            console.log('Video|| - ', message)
        }
    }

    async connect(peerId) {
        if (this.peer.destroyed) {
            this.debug(`Calling connect for destroyed peer with peerId ${peerId}`)
            return
        }
        this.debug(`connect with peerId ${peerId}`)
        this.conn = this.peer.connect(peerId);
        this.conn.on('open', () => {
            this.status = "connected";
            this.events.emit('connected');
        });
        this.conn.on('close', () => {
            this.debug('close in conn 1')
            this.status = 'open';
            this.remoteStream = null;
            this.events.emit('closed');
            this.close();
        });
        this.conn.on('data', (data) => {
            console.log(data);
            this.events.emit('data', data);
        })
        try {
            if (!this.localStream) {
                await this.startLocalStream();
            }
            let call = this.peer.call(peerId, this.localStream);
            this.call = call;
            call.on('stream', (remoteStream) => {
                this.remoteStream = remoteStream;
                this.events.emit('remotestreamupdate', remoteStream);
            });
        } catch (err) {
            console.error('Error on connect', err);
        }
    }

    close() {
        this.conn = null;
        this.call = null;
        this.peer.destroy();
        this.remoteStream = null;
        if (this.active)
            this.initPeer();
    }
}