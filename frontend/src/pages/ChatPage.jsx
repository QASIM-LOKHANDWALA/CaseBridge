import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ChatPage = () => {
    const { participantId } = useParams();
    const { token, user } = useSelector((state) => state.auth);
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [lastTimestamp, setLastTimestamp] = useState(null);
    const chatBoxRef = useRef(null);

    const scrollToBottom = () => {
        chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const startConversation = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/api/chat/start/",
                { participant_id: participantId },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setConversationId(res.data.conversation_id);
        } catch (err) {
            console.error("Error starting conversation", err);
        }
    };

    const fetchMessages = async () => {
        if (!conversationId) return;
        try {
            const res = await axios.get(
                `http://localhost:8000/api/chat/conversations/${conversationId}/messages/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    params: lastTimestamp ? { since: lastTimestamp } : {},
                }
            );
            if (res.data.length > 0) {
                setMessages((prev) => [...prev, ...res.data]);
                setLastTimestamp(res.data[res.data.length - 1].timestamp);
            }
        } catch (err) {
            console.error("Error fetching messages", err);
        }
    };

    const sendMessage = async () => {
        if (!text.trim() || !conversationId) return;
        try {
            const res = await axios.post(
                `http://localhost:8000/api/chat/conversations/${conversationId}/send/`,
                { text },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setMessages((prev) => [...prev, res.data]);
            setLastTimestamp(res.data.timestamp);
            setText("");
        } catch (err) {
            console.error("Error sending message", err);
        }
    };

    useEffect(() => {
        startConversation();
    }, [participantId]);

    useEffect(() => {
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [conversationId, lastTimestamp]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>
            <div className="h-80 overflow-y-auto border rounded p-2 bg-gray-50 mb-3">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10">
                        No messages yet
                    </p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`mb-2 p-2 rounded-md w-fit max-w-xs ${
                                msg.sender === user.id
                                    ? "bg-blue-500 text-white ml-auto"
                                    : "bg-gray-200 text-black"
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))
                )}
                <div ref={chatBoxRef}></div>
            </div>
            <div className="flex">
                <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
