export function joinRoom(socket, room) {

    const roomName = room?.trim();

    if (!roomName) {
        socket.emit("error-message",{
            message:"room name required"
        });
        return;
    }

    if(socket.rooms.has(roomName)){
        socket.emit("error-message",{
            message:"you are Already joined"
        });
        return;
    }

    socket.join(roomName);

    const rooms = [...socket.rooms].filter((r) => r !== socket.id);

    socket.to(roomName).emit("user-joined", {
        username: socket.username,
        room: roomName
    });

    socket.emit("room-list", {
        rooms
    });

    console.log(`${socket.username} joined room : ${roomName}`);

}

export function leaveRoom(socket, room) {

    const roomName = room?.trim();

    if (!roomName) return;

    if (!socket.rooms.has(roomName)) return;

    socket.leave(roomName);

    const rooms = [...socket.rooms].filter((r) => r !== socket.id);

    socket.to(roomName).emit("user-left", {
        username: socket.username,
        room: roomName
    });

    socket.emit("room-list", {
        rooms
    });

    console.log(`${socket.username} left room : ${roomName}`);

}

export function getJoinedRooms(socket) {

    return [...socket.rooms].filter((room) => room !== socket.id);

}