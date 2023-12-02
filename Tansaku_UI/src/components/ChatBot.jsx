import CHATBOT_ICON from "@/assets/chatbot.png";
import PROFILE_ICON from "@/assets/profile.png";
import { useReducer, useRef, useState } from "react";
import Api from "@/Api/Api.jsx";

export default function ChatBot() {
    const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
    const [isChatsAvailable, setIsChatAvailable] = useState(false);
    const [textMessage, setTextMessage] = useState("");
    const [chats, setChats] = useState([]);
    const [isBotTyping, setIsBotTyping] = useState(true);

    const chatBoxId = useRef(null);

    const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

    function sendMessage() {
        let chatMessages = [...chats];

        let userMessage = {
            user_name: "User",
            text: textMessage,
        };

        chatMessages.push(userMessage);
        setChats(chatMessages);
        setIsChatAvailable(true);

        setTextMessage("");
        setIsBotTyping(true);

        if (chatBoxId.current !== "undefined" || chatBoxId.current !== null) {
            setTimeout(() => {
                chatBoxId.current.scrollTo(0, chatBoxId.current.scrollHeight);
            }, 180);
        }

        let payload = {
            parameters: {
                user_message: textMessage,
            },
        };

        Api.post("/chat_bot", payload)
            .then((res) => {
                let previousScrollHeight = chatBoxId.current.scrollHeight;
                chatMessages.push(res.data);
                setChats(chatMessages);
                displayChats();
                setIsBotTyping(false);

                if (chatBoxId.current !== "undefined" || chatBoxId.current !== null) {
                    let scrolledHeight =
                        (chatBoxId.current.scrollHeight - previousScrollHeight);
                    setTimeout(() => {
                        chatBoxId.current.scrollTo(
                            0,
                            chatBoxId.current.scrollHeight - scrolledHeight
                        );
                    }, 180);
                }

                forceUpdate();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function displayChats() {
        let allChats = [];

        if (chats.length) {
            chats.map((chat, index) => {
                if (chat.user_name === "Chatbot") {
                    allChats.push(
                        <div className="flex items-start mb-4" key={index}>
                            <div className="flex-none flex flex-col items-center space-y-1 mr-2">
                                <img className="rounded-full w-6 h-6" src={CHATBOT_ICON} />
                            </div>
                            <div className="bg-pink-600 text-white p-2 rounded-tr-lg rounded-br-lg rounded-bl-lg mb-2 relative">
                                <p className="text-xs">{chat.text}</p>
                            </div>
                        </div>
                    );
                } else {
                    allChats.push(
                        <div className="flex items-start flex-row-reverse mb-4" key={index}>
                            <div className="flex-none flex flex-col items-center space-y-1 ml-2">
                                <img
                                    className="rounded-full w-6 h-6 opacity-80"
                                    src={PROFILE_ICON}
                                />
                            </div>
                            <div className="bg-pink-100 text-gray-800 p-2 rounded-tl-lg rounded-bl-lg rounded-br-lg mb-2 relative">
                                <p className="text-xs">{chat.text}</p>
                            </div>
                        </div>
                    );
                }
            });

            return allChats;
        }

        return;
    }

    return (
        <div
            className={`w-80 ${isChatBoxOpen ? "h-96" : "h-12"
                } flex flex-col border shadow-md bg-white rounded-lg duration-150`}
        >
            <div
                className="py-1 px-2 flex items-center justify-between border-b cursor-pointer"
                onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
            >
                <div className="flex items-center">
                    <img className="rounded-full w-10 h-10" src={CHATBOT_ICON} />
                    <div className="pl-2">
                        <div className="font-semibold">
                            <p className="text-sm">Bot</p>
                        </div>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>Online
                        </div>
                    </div>
                </div>
                <div>
                    {!isChatBoxOpen ? (
                        <button
                            className="inline-flex hover:bg-pink-50 rounded-full p-2"
                            onClick={() => setIsChatBoxOpen(true)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                />
                            </svg>
                        </button>
                    ) : (
                        <button
                            className="inline-flex hover:bg-pink-50 rounded-full p-2"
                            type="button"
                            onClick={() => setIsChatBoxOpen(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {!isChatsAvailable && (
                <div className="my-4 h-full">
                    <img
                        src={CHATBOT_ICON}
                        alt="chatbot-icon"
                        className="w-32 h-32 mx-auto"
                    />
                    <div className="font-medium text-center mx-4">
                        <p className="text-xs text-gray-600">Hello there,</p>
                        <p className="text-xs text-gray-600">
                            I am your AI assistant and here to help you out.
                        </p>
                        <p className="text-xs text-gray-600">
                            If you need any help, let me know for sure.
                        </p>
                        <p className="text-xs text-gray-600">I will be around here.</p>
                    </div>
                </div>
            )}

            {isChatsAvailable && (
                <div ref={chatBoxId} className="flex-1 px-4 py-4 overflow-y-auto">
                    {displayChats()}
                    {isBotTyping && (
                        <div className="flex items-start mb-4">
                            <div className="flex-none flex flex-col items-center space-y-1 mr-2">
                                <img className="rounded-full w-8 h-8" src={CHATBOT_ICON} />
                            </div>
                            <div className="mt-2 inline-block bg-pink-300 text-white pt-1.5 pb-1 px-4 rounded-tr-md rounded-br-md rounded-bl-md">
                                <div className="typing">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="p-2 border-t">
                <div className="flex justify-center border border-gray-200 hover:border-gray-300 rounded-full">
                    <input
                        className="px-2 py-2 w-full text-xs outline-none rounded-full"
                        type="text"
                        placeholder="Type your message..."
                        autoFocus
                        value={textMessage}
                        onChange={(e) => setTextMessage(e.target.value)}
                        onKeyDown={(e) => {
                            e.key === "Enter" && sendMessage();
                        }}
                    />
                    <button
                        className="px-2 py-1.5 hover:bg-green-200 rounded-full"
                        type="button"
                        onClick={sendMessage}
                    >
                        <i className="fa-regular fa-paper-plane fa-fw"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}