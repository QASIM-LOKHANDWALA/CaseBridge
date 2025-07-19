import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Send,
    User,
    MessageCircle,
    Clock,
    Search,
    Phone,
    Video,
    MoreVertical,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const ChatPage = () => {
    const [contacts, setContacts] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newText, setNewText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const { token, user } = useAuth();

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/chat/contacts/", {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((res) => setContacts(res.data));
    }, [token]);

    const openConversation = async (contact) => {
        const res = await axios.post(
            "http://127.0.0.1:8000/api/chat/start/",
            {
                participant_id: contact.user_id,
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        setConversation({ id: res.data.conversation_id, ...contact });
        setMessages([]);
        fetchMessages(res.data.conversation_id);
    };

    const fetchMessages = async (conversationId) => {
        const res = await axios.get(
            `http://127.0.0.1:8000/api/chat/conversations/${conversationId}/messages/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        setMessages(res.data);
    };

    const sendMessage = async () => {
        if (!newText.trim()) return;
        const res = await axios.post(
            `http://127.0.0.1:8000/api/chat/conversations/${conversation.id}/send/`,
            {
                text: newText,
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        setMessages((prev) => [...prev, res.data]);
        setNewText("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.full_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar - Contacts List */}
            <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5 text-blue-400" />
                        <span>Messages</span>
                    </h2>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredContacts.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No contacts found</p>
                        </div>
                    ) : (
                        filteredContacts.map((contact) => (
                            <button
                                key={contact.user_id}
                                className={`w-full text-left p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                                    conversation?.user_id === contact.user_id
                                        ? "bg-gray-700 border-l-4 border-l-blue-500"
                                        : ""
                                }`}
                                onClick={() => openConversation(contact)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                                        {contact.profile_picture ? (
                                            <img
                                                src={contact.profile_picture}
                                                alt={contact.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-white truncate">
                                            {contact.full_name}
                                        </h3>
                                        <p className="text-sm text-gray-400 truncate">
                                            {contact.email}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-900">
                {conversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                                    {conversation.profile_picture ? (
                                        <img
                                            src={conversation.profile_picture}
                                            alt={conversation.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">
                                        {conversation.full_name}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Online
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-400 mt-20">
                                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>
                                        No messages yet. Start the conversation!
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isOwnMessage =
                                        msg.sender !== conversation.user_id;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${
                                                isOwnMessage
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                                                    isOwnMessage
                                                        ? "order-1"
                                                        : "order-2"
                                                }`}
                                            >
                                                <div
                                                    className={`px-4 py-2 rounded-2xl ${
                                                        isOwnMessage
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-700 text-white"
                                                    }`}
                                                >
                                                    <p className="text-sm">
                                                        {msg.text}
                                                    </p>
                                                </div>
                                                <div
                                                    className={`flex items-center mt-1 space-x-1 ${
                                                        isOwnMessage
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    }`}
                                                >
                                                    <Clock className="w-3 h-3 text-gray-500" />
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(
                                                            msg.timestamp
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-gray-800 border-t border-gray-700">
                            <div className="flex items-end space-x-3">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={newText}
                                        onChange={(e) =>
                                            setNewText(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="w-full p-3 pr-12 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="1"
                                        style={{
                                            minHeight: "44px",
                                            maxHeight: "120px",
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={sendMessage}
                                    disabled={!newText.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <MessageCircle className="w-20 h-20 mx-auto mb-6 opacity-30" />
                            <h3 className="text-xl font-medium text-white mb-2">
                                Welcome to Messages
                            </h3>
                            <p className="text-gray-400">
                                Select a contact from the sidebar to start
                                chatting
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
