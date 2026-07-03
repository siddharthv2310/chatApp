import { useState } from "react";

function RoomManager({ socket, username, rooms, activeRoom, setActiveRoom }) {

    const [roomName, setRoomName] = useState("");

    const joinRoom = () => {

        const trimmedRoom = roomName.trim();

        if (!trimmedRoom) return;

        socket.emit("join-room", { room: trimmedRoom, username });

        setActiveRoom(trimmedRoom);

        setRoomName("");

    };

    const leaveRoom = (room) => {

        socket.emit("leave-room", room);

    };

    return (

        <div className="p-4 h-full flex flex-col">

            <h2 className="text-xl font-bold mb-5">

                Rooms

            </h2>

            <div className="space-y-2 flex-1 overflow-y-auto">

                {

                    rooms.map((room) => (

                        <div

                            key={room}
                            className={`flex justify-between items-center rounded-lg p-3 transition ${
                                activeRoom === room
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border"
                            }`}

                        >

                            <button

                                onClick={() => setActiveRoom(room)}
                                className="flex-1 text-left font-medium"

                            >

                                {room}

                            </button>

                            <button

                                onClick={() => leaveRoom(room)}

                                className={`text-sm px-2 py-1 rounded ${
                                    activeRoom === room
                                        ? "bg-red-500"
                                        : "bg-red-100 text-red-600"
                                }`}

                            >

                                Leave

                            </button>

                        </div>

                    ))

                }

            </div>

            <div className="mt-5">

                <input

                    value={roomName}

                    onChange={(e) => setRoomName(e.target.value)}

                    placeholder="Join new room"

                    className="w-full border rounded-lg p-3"

                />

                <button

                    onClick={joinRoom}

                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3"

                >

                    Join Room

                </button>

            </div>

        </div>

    );

}

export default RoomManager;