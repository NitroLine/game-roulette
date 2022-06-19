import Peer from "peerjs";

const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || 0;

export class EventEmitter {
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
        this.events[eventName] = this.events[eventName].filter((eventCallback) => callback !== eventCallback);
    }

    /**
     * @param {string} eventName
     * @param {any} args
     */
    emit(eventName, args) {
        const event = this.events[eventName];
        event && event.forEach((callback) => callback(args));
    }
}

export class VideoClient {
    constructor(_debug = true) {
        this.conn = null;
        this.myPeerId = null;
        this.peer = null;
        this.status = "init";
        this.localStream = null;
        this._debug = _debug;
        this.remoteStream = null;
        this.cameras = [];
        this.microphones = [];
        this.events = new EventEmitter();
        this.call = null;
        this.active = false;
    }

    /**
     * Request for start local stream
     * @param {MediaStreamConstraints} constraints
     * @return {Promise}
     */
    startLocalStream(constraints = {
        video: false,
        audio: true
    }) {
        return new Promise((resolve, reject) => {
            getUserMedia(constraints, (stream) => {
                this.localStream = stream;
                this.events.emit("localstreamupdate", stream);
                if (this.microphones.length === 0 && this.cameras.length === 0) {
                    navigator.mediaDevices.enumerateDevices()
                      .then((devices) => {
                          devices.forEach((device) => {
                              if (device.deviceId === "") {
                                  return;
                              }

                              if (device.kind === "audioinput") {
                                  this.microphones.push(device);
                              }

                              if (device.kind === "videoinput") {
                                  this.cameras.push(device);
                              }
                          });
                          this.events.emit("devicesupdated", {
                              cameras: this.cameras,
                              microphones: this.microphones
                          });
                      });
                }

                resolve(stream);
            }, (err) => reject(err));
        });
    }

    /**
     * Stop local stream
     */
    stopLocalStream() {
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }

    /**
     * Replace tracks in sending stream
     */
    async replaceStream() {
        if (this.call && this.call.peerConnection) {
            const { peerConnection } = this.call;
            for (const sender of peerConnection.getSenders()) {
                if (sender.track.kind === "audio") {
                    if (this.localStream.getAudioTracks().length > 0) {
                        console.log(sender.track.kind);
                        await sender.replaceTrack(this.localStream.getAudioTracks()[0]);
                    }
                }

                if (sender.track.kind === "video") {
                    if (this.localStream.getVideoTracks().length > 0) {
                        console.log(sender.track.kind);
                        await sender.replaceTrack(this.localStream.getVideoTracks()[0]);
                    }
                }
            }
        }
    }

    /**
     * Toggle audio stream
     * @param {Boolean} audioState request stream state
     */
    toggleAudio(audioState) {
        if (this.localStream) {
            this.localStream.getAudioTracks()[0].enabled = audioState;
        }
    }

    /**
     * Toggle video stream
     * @param {Boolean} videoState request stream state
     */
    toggleVideo(videoState) {
        if (this.localStream) {
            this.localStream.getVideoTracks()[0].enabled = videoState;
        }
    }

    /**
     * Init peer connection
     */
    initPeer() {
        if (this.peer && !this.peer.destroyed) {
            this.peer.destroy();
            this.peer = null;
        }

        this.peer = new Peer({
            host: '/',
            path: '/peerjs/roapp'
        });
        this.peer.on("open", (peerID) => {
            this.myPeerId = peerID;
            this.events.emit("peerFound", peerID);
            this.status = "open";
        });

        this.peer.on("call", async(call) => {
            try {
                if (!this.localStream) {
                    await this.startLocalStream();
                }

                call.answer(this.localStream); // Answer the call with an A/V stream.
                call.on("stream", (remoteStream) => {
                    console.log(remoteStream.getVideoTracks());
                    console.log(remoteStream.getAudioTracks());
                    if (!this.remoteStream || remoteStream.getVideoTracks().length >= this.remoteStream.getVideoTracks().length) {
                        this.remoteStream = remoteStream;
                        this.events.emit("remotestreamupdate", remoteStream);
                    }
                });
                this.call = call;
            } catch (err) {
                console.error("Error on call invite", err);
            }
        });

        this.peer.on("connection", (c) => {
            this.conn = c;
            this.conn.on("open", () => {
                this.status = "connected";
                this.events.emit("connected");
                this.conn.on("data", (data) => {
                    this.events.emit("data", data);
                });
            });
            this.conn.on("close", () => {
                this.debug("close in conn 2");
                this.status = "open";
                this.remoteStream = null;
                this.events.emit("closed");
                this.close();
            });
        });
    }

    init() {
        this.initPeer();
    }

    debug(message) {
        if (this._debug) {
            console.log("Video|| - ", message);
        }
    }

    /**
     * Connect to another client by peer id
     * @param {String} peerId
     */
    async connect(peerId) {
        if (this.peer.destroyed) {
            this.debug(`Calling connect for destroyed peer with peerId ${peerId}`);
            return;
        }

        this.debug(`connect with peerId ${peerId}`);
        this.conn = this.peer.connect(peerId);
        this.conn.on("open", () => {
            this.status = "connected";
            this.events.emit("connected");
        });
        this.conn.on("close", () => {
            this.debug("close in conn 1");
            this.status = "open";
            this.remoteStream = null;
            this.events.emit("closed");
            this.close();
        });
        this.conn.on("data", (data) => {
            console.log(data);
            this.events.emit("data", data);
        });
        try {
            if (!this.localStream) {
                await this.startLocalStream();
            }

            const call = this.peer.call(peerId, this.localStream);
            this.call = call;
            call.on("stream", (remoteStream) => {
                console.log(remoteStream.getVideoTracks());
                console.log(remoteStream.getAudioTracks());
                if (!this.remoteStream || remoteStream.getVideoTracks().length >= this.remoteStream.getVideoTracks().length) {
                    this.remoteStream = remoteStream;
                    this.events.emit("remotestreamupdate", remoteStream);
                }
            });
        } catch (err) {
            console.error("Error on connect", err);
        }
    }

    /**
     * Close all connections and destroy peer
     */
    close() {
        if (this.conn !== null || !this.peer.destroyed) {
            this.conn = null;
            this.call = null;
            this.peer.destroy();
            this.remoteStream = null;
        }

        if (this.active) {
            this.initPeer();
        }
    }
}
