import React, { useEffect, useState, useRef } from "react";
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
    ArrowLeft,
    Bot,
    CheckCheck,
    Check,
    Paperclip,
    Smile,
    X,
    Users,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

const ChatPage = () => {
    const [contacts, setContacts] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newText, setNewText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

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

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
        }
    }, [newText]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        console.log(conversation);
    }, [conversation]);

    useEffect(() => {
        return () => {
            clearPollingInterval();
        };
    }, []);

    const openConversation = async (contact) => {
        try {
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
            setIsBotTyping(false);
            setShowMobileChat(true);
            fetchMessages(res.data.conversation_id);
            startPollingMessages(res.data.conversation_id);
        } catch (error) {
            console.error("Failed to start conversation:", error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/chat/conversations/${conversationId}/messages/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setMessages(res.data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    const pollingIntervalRef = useRef(null);

    const clearPollingInterval = () => {
        if (pollingIntervalRef.current) {
            console.log("Clearing previous polling interval");
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    const startPollingMessages = (conversationId) => {
        console.log("Started Polling for conversation", conversationId);

        clearPollingInterval();

        pollingIntervalRef.current = setInterval(() => {
            console.log("Updating Conversations");
            fetchMessages(conversationId);
        }, 5000);
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

    const sendMessage = async () => {
        if (!newText.trim()) return;

        const isBot = conversation?.isBot === true;
        const url = isBot
            ? `http://127.0.0.1:8000/api/chat/conversations/${conversation.id}/legal-bot/`
            : `http://127.0.0.1:8000/api/chat/conversations/${conversation.id}/send/`;

        console.log("Sending to:", url, "IsBot:", isBot);

        const tempMessage = {
            id: Date.now(),
            sender: user.id,
            sender_email: user.email,
            text: newText,
            timestamp: new Date().toISOString(),
            status: "sending",
        };

        setMessages((prev) => [...prev, tempMessage]);

        if (isBot) {
            setIsBotTyping(true);
        }

        const messageText = newText;
        setNewText("");

        try {
            const res = await axios.post(
                url,
                { text: messageText },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (isBot) {
                setMessages((prev) => [
                    ...prev.slice(0, -1),
                    res.data.user_message,
                    res.data.bot_reply,
                ]);
                setIsBotTyping(false);
            } else {
                // setMessages((prev) => [...prev.slice(0, -1)]);
            }
        } catch (err) {
            console.error("Message failed", err);
            setMessages((prev) => prev.slice(0, -1));
            setNewText(messageText);
            setIsBotTyping(false);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatMessageDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        }
    };

    const openBotConversation = async () => {
        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/chat/bot/init/",
                {},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            const botInfo = {
                user_id: 9,
                full_name: "Legal Assistant",
                email: "legalbot@casebridge.com",
                isBot: true,
            };
            setConversation({ id: res.data.conversation_id, ...botInfo });
            setMessages([]);
            setIsBotTyping(false);
            setShowMobileChat(true);
            fetchMessages(res.data.conversation_id);
            startPollingMessages(res.data.conversation_id);
        } catch (err) {
            console.error("Bot init failed", err);
        }
    };

    const isOnline = (userId) => {
        return onlineUsers.has(userId);
    };

    const getLastSeen = (contact) => {
        if (isOnline(contact.user_id)) return "Online";
        return "Last seen recently";
    };

    const ContactItem = ({ contact, isBot = false }) => (
        <button
            className={`w-full text-left p-4 hover:bg-gray-700 transition-all duration-200 ${
                conversation?.user_id === contact.user_id ||
                (conversation?.isBot && isBot)
                    ? "bg-gray-700 border-r-4 border-r-blue-500"
                    : ""
            }`}
            onClick={() => {
                isBot ? openBotConversation() : openConversation(contact);
                console.log(isBot, contact);
            }}
        >
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${
                            isBot
                                ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                : "bg-gray-600"
                        }`}
                    >
                        {isBot ? (
                            <Bot className="w-6 h-6 text-white" />
                        ) : contact.profile_picture ? (
                            <img
                                src={contact.profile_picture}
                                alt={contact.full_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    {!isBot && isOnline(contact.user_id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white truncate">
                            {isBot ? "Legal Assistant" : contact.full_name}
                        </h3>
                        <span className="text-xs text-gray-400">2:30 PM</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                        {isBot
                            ? "AI Legal Assistant • Always available"
                            : getLastSeen(contact)}
                    </p>
                </div>
            </div>
        </button>
    );

    const MessageBubble = ({ msg, isOwnMessage }) => (
        <div
            className={`flex mb-4 ${
                isOwnMessage ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`flex items-end space-x-2 max-w-xs lg:max-w-md xl:max-w-lg ${
                    isOwnMessage
                        ? "flex-row-reverse space-x-reverse"
                        : "flex-row"
                }`}
            >
                {!isOwnMessage && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {conversation?.isBot ? (
                            <Bot className="w-4 h-4 text-white" />
                        ) : (
                            <User className="w-4 h-4 text-gray-400" />
                        )}
                    </div>
                )}
                <div className="flex flex-col">
                    <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                            isOwnMessage
                                ? "bg-blue-600 text-white"
                                : conversation?.isBot
                                ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                                : "bg-gray-700 text-white"
                        } ${isOwnMessage ? "rounded-br-md" : "rounded-bl-md"}`}
                    >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                        </p>
                    </div>
                    <div
                        className={`flex items-center mt-1 space-x-1 ${
                            isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                    >
                        <span className="text-xs text-gray-500">
                            {formatTime(msg.timestamp)}
                        </span>
                        {isOwnMessage && (
                            <div className="text-gray-500">
                                {msg.status === "sending" ? (
                                    <Clock className="w-3 h-3" />
                                ) : msg.status === "sent" ? (
                                    <Check className="w-3 h-3" />
                                ) : (
                                    <CheckCheck className="w-3 h-3 text-blue-400" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className={`flex h-screen bg-gray-900 `}>
                <div
                    className={`${
                        showMobileChat ? "hidden" : "flex"
                    } md:flex w-full md:w-80 bg-gray-800 border-r border-gray-700 flex-col`}
                >
                    <div className="p-4 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="w-6 h-6 text-blue-400" />
                                <h2 className="text-xl font-semibold text-white">
                                    Messages
                                </h2>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/home"
                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="border-b border-gray-700">
                            <ContactItem contact={{}} isBot={true} />
                        </div>

                        {filteredContacts.length === 0 ? (
                            <div className="p-6 text-center text-gray-400">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="font-medium">No contacts found</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {searchTerm
                                        ? "Try a different search term"
                                        : "Your conversations will appear here"}
                                </p>
                            </div>
                        ) : (
                            filteredContacts.map((contact) => (
                                <ContactItem
                                    key={contact.user_id}
                                    contact={contact}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div
                    className={`${
                        showMobileChat ? "flex" : "hidden"
                    } md:flex flex-1 flex-col bg-gray-900`}
                >
                    {conversation ? (
                        <>
                            <div className="p-4 bg-gray-800 border-b border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                            onClick={() =>
                                                setShowMobileChat(false)
                                            }
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <div className="relative">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                                                    conversation.isBot
                                                        ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                                        : "bg-gray-600"
                                                }`}
                                            >
                                                {conversation.isBot ? (
                                                    <Bot className="w-5 h-5 text-white" />
                                                ) : (
                                                    <User className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            {!conversation.isBot &&
                                                isOnline(
                                                    conversation.user_id
                                                ) && (
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                                )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">
                                                {conversation.full_name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {conversation.isBot
                                                    ? "AI Assistant • Always available"
                                                    : getLastSeen(conversation)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <div
                                            className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                                                conversation.isBot
                                                    ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20"
                                                    : "bg-gray-800"
                                            }`}
                                        >
                                            {conversation.isBot ? (
                                                <Bot className="w-10 h-10 text-blue-400" />
                                            ) : (
                                                <MessageCircle className="w-10 h-10 text-gray-500" />
                                            )}
                                        </div>
                                        <h3 className="text-xl font-medium text-white mb-2">
                                            {conversation.isBot
                                                ? "Legal Assistant"
                                                : `Chat with ${conversation.full_name}`}
                                        </h3>
                                        <p className="text-center text-gray-500 max-w-sm">
                                            {conversation.isBot
                                                ? "Ask me any legal questions. I'm here to help with Indian law queries, case analysis, and legal advice."
                                                : "No messages yet. Start the conversation!"}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg, index) => {
                                            const isOwnMessage =
                                                msg.sender !==
                                                conversation.user_id;
                                            const showDateHeader =
                                                index === 0 ||
                                                formatMessageDate(
                                                    messages[index - 1]
                                                        .timestamp
                                                ) !==
                                                    formatMessageDate(
                                                        msg.timestamp
                                                    );

                                            return (
                                                <React.Fragment key={msg.id}>
                                                    {showDateHeader && (
                                                        <div className="flex justify-center my-4">
                                                            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                                                                {formatMessageDate(
                                                                    msg.timestamp
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <MessageBubble
                                                        msg={msg}
                                                        isOwnMessage={
                                                            isOwnMessage
                                                        }
                                                    />
                                                </React.Fragment>
                                            );
                                        })}

                                        {conversation.isBot && isBotTyping && (
                                            <div className="flex items-center space-x-2 mb-4">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                    <Bot className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div
                                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                            style={{
                                                                animationDelay:
                                                                    "0.1s",
                                                            }}
                                                        ></div>
                                                        <div
                                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                            style={{
                                                                animationDelay:
                                                                    "0.2s",
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            <div className="p-4 bg-gray-800 border-t border-gray-700">
                                <div className="flex items-end space-x-3">
                                    <div className="flex-1 relative">
                                        <textarea
                                            ref={textareaRef}
                                            value={newText}
                                            onChange={(e) =>
                                                setNewText(e.target.value)
                                            }
                                            onKeyPress={handleKeyPress}
                                            placeholder={`Message ${conversation.full_name}...`}
                                            className="w-full p-3 pr-12 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent scrollbar-thin scrollbar-thumb-gray-600"
                                            rows="1"
                                            style={{
                                                maxHeight: "120px",
                                                minHeight: "48px",
                                                overflow: "hidden",
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={sendMessage}
                                        disabled={!newText.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 flex items-center justify-center transform hover:scale-105 active:scale-95"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center text-gray-400 max-w-md">
                                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MessageCircle className="w-12 h-12 text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-3">
                                    Welcome to CaseBridge Messages
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Select a conversation from the sidebar to
                                    start chatting with your legal team or use
                                    our AI Legal Assistant for instant help.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatPage;
