const video = new VideoClient(true);
let micOn = true;
let videoOn = true;
let wasVideo = true;
let myPeerId = null;
let isFirst = true;
let isActive = true;
let deviceOpened = false;
let remoteView = true;
const statusEl = document.getElementById("status");
const btn = document.getElementById("start_btn");

async function initVideo() {
  video.events.on("localstreamupdate", (stream) => {
    const video = document.getElementById("local-video");
    video.style.display = "block";
    video.srcObject = stream;
    document.getElementById("noise_local").style.display = "none";
    if (stream.getVideoTracks().length === 0) {
      video.style.display = "none";
      const noVideoImage = document.getElementById("no_video_local");
      noVideoImage.style.display = "block";
      wasVideo = false;
      videoOn = false;
      document.getElementById("camera_disable").style.display = "none";
    }
  });

  video.events.on("remotestreamupdate", (stream) => {
    const video = document.getElementById("remote-video");
    video.style.display = "block";
    video.srcObject = stream;
    remoteView = true;
    document.getElementById("noise_remote").style.display = "none";
    document.getElementById("block_remote_btn").style.display = "block";
    if (stream.getVideoTracks().length === 0) {
      video.style.display = "none";
      document.getElementById("block_remote_btn").style.display = "none";
      const noVideoImage = document.getElementById("no_video_remote");
      noVideoImage.style.display = "block";
    }
  });

  video.events.on("devicesupdated", ({ cameras, microphones }) => {
    const audiosSelector = $("#audioSource");
    const videoSelector = $("#videoSource");
    cameras.forEach((device) => {
      videoSelector.append($(`<option value="${device.deviceId}">${device.label}</option>`));
    });
    microphones.forEach((device) => {
      audiosSelector.append($(`<option value="${device.deviceId}">${device.label}</option>`));
    });
  });

  video.events.on("connected", () => {
    statusEl.innerHTML = "Connected";
    btn.disabled = false;
  });

  video.events.on("closed", () => {
    statusEl.innerHTML = "Opponent exit. ";
    btn.disabled = true;
    const noVideoImage = document.getElementById("no_video_remote");
    noVideoImage.style.display = "none";
    const video = document.getElementById("remote-video");
    video.style.display = "none";
    video.style.display = "none";
    viewPlayerUsernames(username);
    $(".remote-player").removeClass("border");
    $(".local-player").removeClass("border");
    document.getElementById("noise_remote").style.display = "block";
    document.getElementById("block_remote_btn").style.display = "none";
  });

  video.events.on("peerFound", (peerID) => {
    myPeerId = peerID;
    console.log("PEER FOUND");
    if (isFirst) {
      btn.disabled = false;
      btn.onclick = start;
      statusEl.innerHTML = "Press ready button";
      isFirst = false;
    } else if (isActive) {
      start();
    } else {
      btn.disabled = false;
      btn.onclick = start;
    }
  });
  video.events.on("data", (data) => {
    const chatElement = createChatElement(data);
    const messages = document.getElementById("messages");
    messages.append(chatElement);
    messages.scrollTop = messages.scrollHeight;
    chatList.push(chatElement);
  });
  let success = true;
  try {
    await video.startLocalStream({ video: true, audio: true });
  } catch (e) {
    try {
      await video.startLocalStream({ video: false, audio: true });
    } catch (e) {
      document.getElementById("status").innerHTML = `Error while starting stream ${String(e)}`;
      openModal("No access for camera!", String(e));
      success = false;
    }
  }

  if (success) {
    video.init();
  }
}

function start() {
  console.log("START");
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
  const chatElement = document.createElement("div");
  chatElement.classList.add("chat-message");
  if (answer) {
    chatElement.classList.add("chat-answer");
  }

  const chatText = document.createElement("div");
  chatText.className = "chat-message-text";
  const p = document.createElement("p");
  p.innerText = message;
  chatText.append(p);
  chatElement.append(chatText);
  return chatElement;
}

const chatList = [];
document.getElementById("inputmess").addEventListener("keyup", sendMessage);

/**
 * Sending message
 */
function sendMessage(event) {
  if (event.key !== "Enter") {
    return;
  }

  const newMessage = document.getElementById("inputmess").value;
  document.getElementById("inputmess").value = "";
  if (newMessage.length <= 1) {
    return;
  }

  if (video.conn && video.conn.open) {
    video.conn.send(newMessage);
  }

  const chatElement = createChatElement(newMessage, true);
  const messages = document.getElementById("messages");
  messages.append(chatElement);
  messages.scrollTop = messages.scrollHeight;
  chatList.push(chatElement);
}

/**
 * Toggle local audio track
 */
function toggleMic() {
  const icon = document.getElementById("mic_icon");
  if (micOn) {
    icon.classList.remove("fa-microphone");
    icon.classList.add("fa-microphone-slash");
  } else {
    icon.classList.remove("fa-microphone-slash");
    icon.classList.add("fa-microphone");
  }

  micOn = !micOn;
  video.toggleAudio(micOn);
}

/**
 * Toggle remote video player
 */
function toggleRemoteVideo() {
  const video = document.getElementById("remote-video");
  const noVideoImage = document.getElementById("no_video_remote");
  remoteView = !remoteView;
  if (!remoteView) {
    video.style.display = "none";
    noVideoImage.style.display = "block";
  } else {
    video.style.display = "block";
    noVideoImage.style.display = "none";
  }
}

/**
 * Toggle local video track
 */
function toggleLocalVideo() {
  videoOn = !videoOn;
  video.toggleVideo(videoOn);
  const icon = document.getElementById("camera_disable");
  if (videoOn) {
    icon.classList.remove("disabled");
  } else {
    icon.classList.add("disabled");
  }
}

async function changeDevice() {
  const audio = $("#audioSource").val();
  const camera = $("#videoSource").val();
  console.log(audio);
  console.log(camera);
  let constraints = {
    audio: {
      deviceId: {
        exact: audio
      }
    }
  };
  if (camera && wasVideo) {
    constraints = {
      video: {
        deviceId: {
          exact: camera
        }
      },
      ...constraints
    };
  }

  video.stopLocalStream();
  try {
    await video.startLocalStream(constraints);
  } catch (err) {
    console.error(err);
    delete constraints.video;
    await video.startLocalStream(constraints).catch((err) => openModal("No access!", String(err)));
  }

  await video.replaceStream();
  video.toggleAudio(micOn);
  if (wasVideo) {
    video.toggleVideo(videoOn);
  }
}

/**
 * Open modal window
 * @param {String} message title message in modal
 * @param {String} info additional information in modal
 */
function openModal(message, info = "") {
  document.getElementsByTagName("body")[0].classList.add("modal-active");
  document.getElementById("modal-container").className = "open";
  document.getElementById("modal-message").innerText = message;
  document.getElementById("modal-info").innerText = info;
  isActive = false;
  isGameStartMove = false;
  document.getElementById("game-over-sound").play();
}

function toggleDevicePanel(event) {
  console.log("open");
  deviceOpened = !deviceOpened;
  if (deviceOpened) {
    document.getElementById("device_panel").classList.remove("hidden");
  } else {
    document.getElementById("device_panel").classList.add("hidden");
  }
}

function closeDevicePanel(event) {
  if (!deviceOpened) {
    return;
  }

  if (!event.target.closest("#device_toggler") &&
        !event.target.closest("#device_panel")) {
    deviceOpened = false;
    document.getElementById("device_panel").classList.add("hidden");
  }
}

document.getElementById("device_toggler").addEventListener("click", toggleDevicePanel);
document.getElementsByTagName("body")[0].addEventListener("click", closeDevicePanel, false);

initVideo();
