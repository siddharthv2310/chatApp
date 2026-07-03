import { useEffect, useRef, useState } from "react";

import socket from "./socket/socket";

import JoinScreen from "./components/JoinScreen";
import ChatScreen from "./components/ChatScreen";

function App() {

  const [joined, setJoined] = useState(false);

  const [username, setUsername] = useState("");

  const [room, setRoom] = useState("");

  const [socketId, setSocketId] = useState("");

  const [messages, setMessages] = useState({});

  const [joinedRooms, setJoinedRooms] = useState([]);

  const [activeRoom, setActiveRoom] = useState("");

  const [welcomeMessage, setWelcomeMessage] = useState("");

  const usernameRef = useRef(username);
  const joinedRef = useRef(joined);
  const joinedRoomsRef = useRef(joinedRooms);
  const hasConnectedBeforeRef = useRef(false);

  const createMessage = (message) => ({

    ...message,

    messageId: crypto.randomUUID()

  });

  useEffect(() => {

    usernameRef.current = username;

  }, [username]);

  useEffect(() => {

    joinedRef.current = joined;

  }, [joined]);

  useEffect(() => {

    joinedRoomsRef.current = joinedRooms;

  }, [joinedRooms]);

  useEffect(() => {

    const restoreSession = () => {

      if (!joinedRef.current || !usernameRef.current) return;

      joinedRoomsRef.current.forEach((roomName) => {

        socket.emit("join-room", {

          room: roomName,

          username: usernameRef.current

        });

      });

    };

    const onConnect = () => {

      setSocketId(socket.id);

      if (hasConnectedBeforeRef.current) {

        restoreSession();

      }

      hasConnectedBeforeRef.current = true;

    };

    const onWelcome = (data) => {
      setWelcomeMessage(data.message);
    };

    const onRoomList = ({ rooms }) => {

      setJoinedRooms(rooms);

      setActiveRoom((current) => {

        if (current && rooms.includes(current)) return current;

        return rooms.length ? rooms[rooms.length - 1] : "";

      });

    };

    const onUserJoined = (data) => {

      setMessages((prev) => ({
        ...prev,

        [data.room]: [...(prev[data.room] || []),
        createMessage({

          type: "join",
          room: data.room,
          text: `${data.username} joined ${data.room}`

        })]

      }));

    };

    const onUserLeft = (data) => {

      setMessages((prev) => ({ ...prev,

        [data.room]: [  ...(prev[data.room] || []),
          createMessage({

            type: "left",
            room: data.room,
            text: `${data.username} left ${data.room}`

          })

        ]

      }));

    };

    const onReceiveMessage = (data) => {

      setMessages((prev) => ({

        ...prev,

        [data.room]: [ ...(prev[data.room] || []),

          createMessage(data)

        ]

      }));

    };

    const onErrorMessage = (data) => {

      window.alert(data.message);

    };

    socket.on("connect", onConnect);
    socket.on("welcome", onWelcome);
    socket.on("room-list", onRoomList);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);
    socket.on("receive-message", onReceiveMessage);
    socket.on("error-message", onErrorMessage);

    if (socket.connected) {

      setSocketId(socket.id);

    }

    return () => {

      socket.off("connect", onConnect);
      socket.off("welcome", onWelcome);
      socket.off("room-list", onRoomList);
      socket.off("user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
      socket.off("receive-message", onReceiveMessage);
      socket.off("error-message", onErrorMessage);

    };

  }, []);

  const joinChat = () => {

    const trimmedUsername = username.trim();
    const trimmedRoom = room.trim();

    if (!trimmedUsername || !trimmedRoom) return;

    const emitJoin = () => {

      socket.emit("join-chat", {

        username: trimmedUsername,

        room: trimmedRoom

      });

      setJoined(true);

      setActiveRoom(trimmedRoom);

    };

    if (socket.connected) {

      emitJoin();

    } else {

      socket.once("connect", emitJoin);

      socket.connect();

    }

  };

  if (!joined) {

    return (

      <JoinScreen

        username={username}
        setUsername={setUsername}
        room={room}
        setRoom={setRoom}
        joinChat={joinChat}

      />

    );

  }

  return (

    <ChatScreen

      socket={socket}
      username={username}
      socketId={socketId}
      messages={messages[activeRoom] || []}
      joinedRooms={joinedRooms}
      activeRoom={activeRoom}
      setActiveRoom={setActiveRoom}

    />

  );

}

export default App;