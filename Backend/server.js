import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import socketHandler from "./socket/socketHandler.js";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => {
    res.send("Socket.IO Server Running");
});

socketHandler(io);

server.listen(4000, () => {

    console.log("🚀 Server Running On Port 4000");

});