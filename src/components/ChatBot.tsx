// is ko har page main dia hai

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiAssistant } from "./BackendApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import { useUser } from "@clerk/nextjs";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

interface VoiceAgentOpen {
  OpenChatBot: boolean;
  RestartIsOpen: () => void;
}

const ChatBotUI = (props: VoiceAgentOpen) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]); // is main sary message aye gy
  const [inputValue, setInputValue] = useState(""); //
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [waitMessage, setWaitMessage] = useState<boolean>(false);

  // ye jab cahly ga jab voice agent is ko open karny ka boly ga
  useEffect(() => {
    if (props.OpenChatBot) {
      setIsOpen(true);
    }
  }, [props.OpenChatBot]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // jab from fill hoye ga to ye chaly ga
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    //  spinner ON
    setWaitMessage(true);
    // jab tak clerk sy email nhi aye gi us time tak ye nhi chaly ga
    if (!isLoaded || !isSignedIn || !user) {
      // Handle case when user is not signed in
      alert("Please sign in to add items to cart");
      return;
    }

    // agar input field main "" ye ye cahly ga
    if (inputValue.trim() === "") return;

    // user ka message is format main aye ga
    const newMessage: Message = {
      role: "user",
      content: inputValue,
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages); // user ka message setMessages ky andar ja raha hai
    setInputValue(""); // is main input field MT ho raha hai
    // console.log(messages);

    try {
      // is main ai ka response araha hai is ky andar updatedMessages or user ka email arahe hai
      const aiResponseText = await AiAssistant(
        updatedMessages,
        `${user.emailAddresses[0].emailAddress}`
      );
      // console.log(aiResponseText);

      // is main jo ai ka response araha hai wo is format main ho raha hai
      const aiMessage: Message = {
        role: "assistant",
        content: aiResponseText,
      };
      setMessages((prev) => [...prev, aiMessage]); // ai ka response ko format kai hai wo is main araha hai setMessages
    } catch (error) {
      console.log(error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // 2️⃣ spinner OFF
      setWaitMessage(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat bubble button */}
      {!isOpen && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat}
          className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-xl cursor-pointer flex items-center justify-center relative group"
        >
          {/* Animated chat icon that appears on hover is par hover karro ky ye show hoye ga */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-full right-0 mb-3 hidden sm:block"
          >
            <div className="bg-white text-gray-800 text-sm px-3 py-2 rounded-lg shadow-md whitespace-nowrap border border-gray-200">
              <div className="font-medium text-indigo-600">
                Nafees Bakery AI Assistant
              </div>
              <div className="text-xs text-gray-500">
                Get information about our products
              </div>
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
          </motion.div>

          {/* Chat icon with hover effect  // ye chat ka logo hai */}
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </motion.div>

          <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
        </motion.div>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute sm:bottom-[-1.9rem] sm:right-[-1.89rem] sm:w-[29rem] sm:h-[535px] bg-white sm:rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 [@media(max-width:640px)]:fixed [@media(max-width:640px)]:mx-auto [@media(max-width:640px)]:my-auto [@media(max-width:640px)]:max-w-full [@media(max-width:640px)]:h-screen [@media(max-width:640px)]:overflow-hidden [@media(max-width:640px)]:inset-0 "
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center [@media(max-width:640px)]:pt-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Nafees Bakery AI Assistant
                  </h3>
                  <p className="text-xs text-indigo-100">Online</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-white hover:text-gray-200 focus:outline-none cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={()=>{toggleChat();props.RestartIsOpen();}}
                  className="text-white hover:text-gray-200 focus:outline-none cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="sm:h-5 sm:w-5 h-7 w-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages container */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="text-center mb-4">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Today
                </span>
              </div>

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-4 flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {/* -------- ASSISTANT bubble -------- */}
                    {message.role === "assistant" ? (
                      <div className="text-sm prose dark:prose-invert">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]} // ← allows raw HTML
                          /* -------------- custom renderers -------------- */
                          components={{
                            a: (props) => (
                              <a
                                {...props}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            ),
                            table: (props) => (
                              <div className="overflow-x-auto">
                                <table
                                  className="min-w-full border-collapse"
                                  {...props}
                                />
                              </div>
                            ),
                            th: (props) => (
                              <th
                                {...props}
                                className="border px-2 py-1 text-left bg-gray-100"
                              />
                            ),
                            td: (props) => (
                              <td {...props} className="border px-2 py-1" />
                            ),
                            blockquote: (props) => (
                              <blockquote
                                {...props}
                                className="border-l-4 border-gray-300 pl-4 italic"
                              />
                            ),
                            /* optional: sanitize every raw HTML node */
                            html: ({ ...value }) => (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(value as string),
                                }}
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      /* -------- USER bubble -------- */
                      <div className="text-sm">{message.content}</div>
                    )}

                    {/* time‑stamp */}

                    <div
                      className={`text-xs mt-1 text-right ${
                        message.role === "user"
                          ? "text-indigo-200"
                          : "text-gray-400"
                      }`}
                    >
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
              {waitMessage ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-600 ml-6 mb-4"></div>
              ) : (
                ""
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="relative flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border text-gray-700 border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800 focus:outline-none cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                AI assistant may produce inaccurate information.
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBotUI;
