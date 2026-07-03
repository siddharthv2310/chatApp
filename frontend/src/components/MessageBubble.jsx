function MessageBubble({ msg, isMe }) {

    if (msg.type === "system") {

        return (
            <div className="text-center text-gray-500 text-sm">
                {msg.text}
            </div>
        );

    }

    if (msg.type === "join") {

        return (
            <div className="text-center text-green-600 font-medium">
                {msg.text}
            </div>
        );

    } 

    if (msg.type === "left") {

        return (
            <div className="text-center text-red-500 font-medium">
                {msg.text}
            </div>
        );

    }

    return (

        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>

            <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl shadow ${
                    isMe
                        ? "bg-blue-600 text-white"
                        : "bg-white border"
                }`}
            >

                <p className="text-xs font-semibold mb-1">

                    {isMe ? "You" : (msg.username || "Unknown")}

                </p>

                <p className="break-words">

                    {msg.text}

                </p>

                <p
                    className={`text-[10px] mt-2 ${
                        isMe
                            ? "text-blue-100"
                            : "text-gray-400"
                    }`}
                >

                    {msg.time}

                </p>

            </div>

        </div>

    );

}

export default MessageBubble;