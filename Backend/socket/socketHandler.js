import { joinRoom, leaveRoom, getJoinedRooms } from "./roomHandler.js";

export default function socketHandler(io) {

    io.on("connection", (socket) => {

        console.log("------------------------------------");
        console.log("✅ User Connected");
        console.log("Socket ID :", socket.id);
        console.log("------------------------------------");

        socket.emit("welcome", {
            message: "Welcome to Socket.IO Chat!"
        });

        // ============================
        // Join chat
        // ============================

        socket.on("join-chat", ({ username, room }) => {

            socket.username = username?.trim();

            joinRoom(socket, room);

        });

        // ============================
        // Join Room
        // ============================

        socket.on("join-room", ({ room, username }) => {

            if (username) {

                socket.username = username.trim();

            }

            joinRoom(socket, room);

        });

        // ============================
        // Leave Room
        // ============================

        socket.on("leave-room", (room) => {

            leaveRoom(socket, room);

        });

        // ============================
        // Get Joined Rooms
        // ============================

        socket.on("get-rooms", () => {

            socket.emit("room-list", {

                rooms: getJoinedRooms(socket)

            });

        });

        // ============================
        // Send Message
        // ============================

        socket.on("send-message", ({ room, message }) => {

            if (!socket.rooms.has(room)) {

                socket.emit("error-message", {

                    message: `You are not a member of room : ${room}`

                });

                return;

            }

            console.log(`${socket.username} (${room}) : ${message}`);

            io.to(room).emit("receive-message", {

                id: socket.id,

                username: socket.username || "Unknown",

                room,

                text: message,

                time: new Date().toLocaleTimeString([], {

                    hour: "2-digit",

                    minute: "2-digit"

                })

            });

        });

        // ============================
        // Disconnect
        // ============================

        socket.on("disconnect", () => {

            console.log("------------------------------------");
            console.log("❌ User Disconnected");
            console.log("Socket ID :", socket.id);

            if(!socket.username) return;

            const rooms = getJoinedRooms(socket);

            rooms.forEach((room) => {

                socket.to(room).emit("user-left", {

                    username: socket.username,
                    room

                });

            });

            console.log(`${socket.username} disconnected`);

            console.log("------------------------------------");

        });

    });

}