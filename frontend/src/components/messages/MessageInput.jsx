import { useState, useRef, useEffect } from "react";
import { BsSend, BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import useSendMessage from "../../hooks/useSendMessage";
import useConversation from "../../zustand/useConversation"; // Add this import

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { loading, sendMessage } = useSendMessage();
  const emojiPickerRef = useRef(null);
  const { selectedConversation } = useConversation(); // Now properly imported

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest('.emoji-picker-button')
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close emoji picker when conversation changes
  useEffect(() => {
    setShowEmojiPicker(false);
  }, [selectedConversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  return (
    <form className="px-4 my-3 relative" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <button
          type="button"
          className="emoji-picker-button absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <BsEmojiSmile className="w-5 h-5" />
        </button>
        
        {showEmojiPicker && (
          <div 
            className="absolute bottom-12 left-0 z-10"
            ref={emojiPickerRef}
          >
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              previewConfig={{ showPreview: false }}
              width="100%"
              height={350}
            />
          </div>
        )}
        
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 pl-10 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setShowEmojiPicker(false)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <BsSend />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;