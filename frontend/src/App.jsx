import { useEffect, useRef, useState } from "react";
import socket from "./socket/socket";

function App() {

  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState("");
  const [socketId, setSocketId] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  useEffect(() => {

    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("welcome", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          text: data.message
        }
      ]);
    });

    socket.on("user-joined", (data) => {

      setMessages((prev) => [
        ...prev,
        {
          type: "join",
          text: `${data.username} joined the chat`
        }
      ]);

    });

    socket.on("user-left", (data) => {

      setMessages((prev) => [
        ...prev,
        {
          type: "left",
          text: `${data.username} left the chat`
        }
      ]);

    });

    socket.on("receive-message", (data) => {

      setMessages((prev) => [
        ...prev,
        data
      ]);

    });

    return () => {

      socket.off("connect");
      socket.off("welcome");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("receive-message");

      socket.disconnect();

    };

  }, []);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);

  const joinChat = () => {

    if (!username.trim()) return;

    socket.connect();

    socket.emit("join-chat", username);

    setJoined(true);

  };

  const sendMessage = () => {

    if (!input.trim()) return;

    socket.emit("send-message", input);

    setInput("");

  };

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      sendMessage();

    }

  };

  if (!joined) {

    return (

      <div className="min-h-screen bg-slate-900 flex items-center justify-center">

        <div className="bg-white rounded-2xl shadow-2xl p-10 w-[420px]">

          <h1 className="text-4xl font-bold text-center mb-2">
            💬 Chat App
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Join the realtime chat
          </p>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") joinChat();
            }}
            placeholder="Enter Username"
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={joinChat}
            className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold transition"
          >
            Join Chat
          </button>

        </div>

      </div>

    );

  }

  return (

    <div className="h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}

        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold">
              💬 Socket.IO Chat
            </h1>

            <p className="text-sm text-blue-100 mt-1">
              Logged in as <span className="font-semibold">{username}</span>
            </p>

          </div>

          <div className="text-right">

            <p className="text-xs uppercase tracking-wide text-blue-200">
              Socket ID
            </p>

            <p className="text-sm font-mono">
              {socketId}
            </p>

          </div>

        </div>

        {/* Messages */}

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-4">

          {

            messages.map((msg, index) => {

              if (msg.type === "system") {

                return (

                  <div
                    key={index}
                    className="text-center text-gray-500 text-sm"
                  >
                    {msg.text}
                  </div>

                );

              }

              if (msg.type === "join") {

                return (

                  <div
                    key={index}
                    className="text-center text-green-600 font-medium"
                  >
                     {msg.text}
                  </div>

                );

              }

              if (msg.type === "left") {

                return (

                  <div
                    key={index}
                    className="text-center text-red-500 font-medium"
                  >
                     {msg.text}
                  </div>

                );

              }

              const isMe = msg.id === socketId;

              return (

                <div
                  key={index}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >

                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl shadow ${isMe
                        ? "bg-blue-600 text-white"
                        : "bg-white border"
                      }`}
                  >

                    <p className="text-xs font-semibold mb-1">

                      {isMe ? "You" : msg.username}

                    </p>

                    <p className="break-words">

                      {msg.text}

                    </p>

                    <p
                      className={`text-[10px] mt-2 ${isMe
                          ? "text-blue-100"
                          : "text-gray-400"
                        }`}
                    >

                      {msg.time}

                    </p>

                  </div>

                </div>

              );

            })

          }

          <div ref={bottomRef}></div>

        </div>

        {/* Footer */}

        <div className="border-t bg-white p-4">

          <div className="flex gap-3">

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-semibold transition"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default App;