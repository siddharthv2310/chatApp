import Header from "./Header";
import RoomManager from "./RoomManager";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatScreen({ socket, username, socketId, messages, joinedRooms, activeRoom, setActiveRoom }) {

    return (

        <div className="h-screen bg-slate-100 p-6">

            <div className="h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                <Header username={username} activeRoom={activeRoom} socketId={socketId} />

                <div className="flex flex-1 overflow-hidden">

                    <div className="w-80 border-r bg-gray-100 overflow-y-auto">

                        <RoomManager
                            socket={socket}
                            username={username}
                            rooms={joinedRooms}
                            activeRoom={activeRoom}
                            setActiveRoom={setActiveRoom}
                        />

                    </div>

                    <div className="flex flex-col flex-1">

                        <MessageList messages={messages} socketId={socketId} activeRoom={activeRoom} />

                        <MessageInput  socket={socket} activeRoom={activeRoom} />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ChatScreen;