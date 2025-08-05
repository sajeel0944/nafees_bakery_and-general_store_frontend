"use client";
import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FiMic, FiVolume2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { VoiceAiAssistant } from "./BackendApi";
import { useRouter } from "next/navigation";

// is ko meny ChatBot component main dia  hai
type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

interface OpenChatBotProps {
  onOpenChatBot: () => void;
}

const VoiceAgent = (props: OpenChatBotProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const route = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // is main sary message aye gy
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };


  const handleStopListening = async () => {
    SpeechRecognition.stopListening();
    if (!transcript) return;

    const newMessage: Message = {
      role: "user",
      content: transcript,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages); // user ka message setMessages ky andar ja raha hai

    setIsProcessing(true);
    try {
      //
      const aiResponseText = await VoiceAiAssistant(updatedMessages);

      // Clean the chatbot marker (if present)
      let cleanedResponse = aiResponseText;
      if (aiResponseText.includes("__dairy__")) {
        cleanedResponse = aiResponseText.replace("__dairy__", "").trim();
        route.push("/dairy");
      } else if (aiResponseText.includes("__snacks__")) {
        cleanedResponse = aiResponseText.replace("__snacks__", "").trim();
        route.push("/snacks");
      } else if (aiResponseText.includes("__bakery__")) {
        cleanedResponse = aiResponseText.replace("__bakery__", "").trim();
        route.push("/bakery");
      } else if (aiResponseText.includes("__contact__")) {
        cleanedResponse = aiResponseText.replace("__contact__", "").trim();
        route.push("/contact");
      } else if (aiResponseText.includes("__chatbot__")) {
        cleanedResponse = aiResponseText.replace("__chatbot__", "").trim();
        props.onOpenChatBot();
      }

      const aiMessage: Message = {
        role: "assistant",
        content: cleanedResponse,
      };

      setMessages((prev) => [...prev, aiMessage]); // ai ka response ko format kai hai wo is main araha hai setMessages

      const utterance = new SpeechSynthesisUtterance(cleanedResponse);
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsProcessing(false);
      };
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-center text-red-500">
        Browser does not support speech recognition.
      </div>
    );
  }

  return (
    <div className="fixed top-[74px] [@media(max-width:640px)]:right-5 sm:left-5 z-50">
      {/* Main Voice Agent Button */}

      <>
        {/* Idle Button */}
        {!listening && !isSpeaking && !isProcessing && (
          <motion.div
            className="relative rounded-full p-4 bg-blue-600 text-white shadow-xl cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartListening}
          >
            <FiMic className="w-6 h-6" />
          </motion.div>
        )}

        {/* Listening Button */}
        {listening && (
          <motion.div
            className="relative rounded-full p-4 bg-red-500 text-white shadow-xl cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStopListening}
          >
            <FiMic className="w-6 h-6" />
            {/* Pulsing animation */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-current opacity-70"
              animate={{
                scale: [1, 1.3],
                opacity: [0.7, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </motion.div>
        )}

        {/* Processing Button */}
        {!listening && !isSpeaking && isProcessing && (
          <motion.div
            className="relative rounded-full p-4 bg-yellow-500 text-white shadow-xl cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartListening}
          >
            <FiMic className="w-6 h-6" />
            {/* Rotating animation */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-current"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        )}
      </>

      {/* Speaking Button */}
      {!listening && isSpeaking && (
        <motion.div
          className="relative rounded-full p-4 bg-green-500 text-white shadow-xl cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartListening}
        >
          <span className="text-2xl">🤖</span>
          {/* Pulsing animation */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-current opacity-70"
            animate={{
              scale: [1, 1.3],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </motion.div>
      )}
      {/* AI Speaking Visualization */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute -top-1 [@media(max-width:640px)]:right-[75px] sm:left-20 bg-white p-3 rounded-lg shadow-lg border border-gray-200"
          >
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-6 bg-green-500 rounded-full"
                    animate={{
                      height: [10, 20, 10],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <FiVolume2 className="text-green-600" />
              <span className="text-sm text-gray-700">AI is responding</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceAgent;
