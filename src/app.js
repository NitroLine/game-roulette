import express from "express";
import path from "path";
import http from "http";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import config from "./config.js";
import registerGameHandlers from "./services/game-handlers.js";

const {
    port,
    isTls,
    sslKey,
    sslCrt
} = config;
const app = express();

if (isTls && (!fs.existsSync(sslKey) || !fs.existsSync(sslCrt))) {
    console.error("SSL files are not found. check your config.js file");
    process.exit(0);
}

const webServer = isTls ? https.createServer({
    cert: fs.readFileSync(sslCrt),
    key: fs.readFileSync(sslKey)
}, app) : http.Server(app);

webServer.on("error", (err) => {
    console.error("starting web server failed:", err.message);
});
const server = webServer.listen(port, config.host, () => {
    console.info("server is running");
    console.info(`open http${isTls ? "s" : ""}://${config.host}:${port} in your web browser`);
});

const io = new Server(server);

io.on("connection", (socket) => {
    registerGameHandlers(socket);
});

app.use("/v/", express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "static")));
app.use("/", (req, res) => {
    if (req.originalUrl !== "/") {
        return res.status(404).send("Sorry, we cannot find that!");
    }
    return res.redirect("/v/");
});
