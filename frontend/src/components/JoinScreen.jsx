function JoinScreen({username,setUsername,room, setRoom,joinChat}) {

    const handleEnter = (e) => {

        if (e.key !== "Enter") return;

        if (!username.trim() || !room.trim()) {

            window.alert("Please fill all fields.");

            return;

        }

        joinChat();

    };

    return (

        <div className="min-h-screen bg-slate-900 flex items-center justify-center">

            <div className="bg-white rounded-2xl shadow-2xl p-10 w-[420px]">

                <h1 className="text-4xl font-bold text-center mb-2">

                    💬 What_Chat

                </h1>

                <p className="text-center text-gray-500 mb-8">

                    Join realtime chat

                </p>

                <input

                    value={username}

                    onChange={(e) => setUsername(e.target.value)}

                    onKeyDown={handleEnter}

                    placeholder="Username"

                    className="w-full border rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"

                />

                <input

                    value={room}

                    onChange={(e) => setRoom(e.target.value)}

                    onKeyDown={handleEnter}

                    placeholder="Room Name"

                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"

                />

                <button

                    onClick={joinChat}

                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold"

                >

                    Join Chat

                </button>

            </div>

        </div>

    );

}

export default JoinScreen;