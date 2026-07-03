import { useState } from "react";

function MessageInput({socket, activeRoom }) {

    const [message, setMessage] = useState("");

    const sendMessage = () => {

        if (!message.trim()) return;

        if (!activeRoom) {

            window.alert("Select a room first.");

            return;

        }

        socket.emit("send-message", {

            room: activeRoom,

            message

        });

        setMessage("");

    };

    const handleEnter = (e) => {

        if (e.key === "Enter") {

            sendMessage();

        }

    };

    return (

        <div className="border-t bg-white p-4">

            <div className="flex gap-3">

                <input

                    value={message}

                    onChange={(e) => setMessage(e.target.value)}

                    onKeyDown={handleEnter}

                    placeholder="Type message..."

                    className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"

                />

                <button

                    onClick={sendMessage}

                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl"

                >

                    Send

                </button>

            </div>

        </div>

    );

}

export default MessageInput;