import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function MessageList({ messages, socketId, activeRoom }) {

    const bottomRef = useRef(null);

    const visibleMessages = messages;

    useEffect(() => {

        bottomRef.current?.scrollIntoView({

            behavior: "smooth"

        });

    }, [visibleMessages]);

    return (

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-4">

            {

                visibleMessages.map((msg) => (

                    <MessageBubble

                        key={msg.messageId}
                        msg={msg}
                        isMe={msg.id === socketId}

                    />

                ))

            }

            <div ref={bottomRef}></div>

        </div>

    );

}

export default MessageList;