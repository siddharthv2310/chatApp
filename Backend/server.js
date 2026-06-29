import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

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

io.on("connection", (socket) => {

    console.log("------------------------------------");
    console.log("✅ User Connected");
    console.log("Socket ID :", socket.id);
    console.log("------------------------------------");

    socket.emit("welcome", {
        message: "Welcome to Socket.IO Chat!"
    });

    // ==========================
    // Join Chat
    // ==========================

    socket.on("join-chat", (username) => {

        socket.username = username;

        console.log(`${username} joined the chat`);

        socket.broadcast.emit("user-joined", {
            username
        });

    });

    // ==========================
    // Send Message
    // ==========================

    socket.on("send-message", (message) => {

        console.log(`${socket.username} : ${message}`);

        io.emit("receive-message", {
            id: socket.id,
            username: socket.username,
            text: message,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        });

    });

    // ==========================
    // Disconnect
    // ==========================

    socket.on("disconnect", () => {

        console.log("------------------------------------");
        console.log("❌ User Disconnected");
        console.log("Socket ID :", socket.id);

        if (socket.username) {

            console.log(`${socket.username} left the chat`);

            io.emit("user-left", {
                username: socket.username
            });

        }

        console.log("------------------------------------");

    });

});

server.listen(4000, () => {

    console.log("🚀 Server Running On Port 4000");

});