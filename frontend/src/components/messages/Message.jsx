import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { useState, useRef } from "react";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import useDeleteMessage from "../../hooks/useDeleteMessage";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const [showOptions, setShowOptions] = useState(false);
  const { deleteMessage } = useDeleteMessage();
  const messageRef = useRef(null);

  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";

  const handleDelete = async () => {
    await deleteMessage(message._id);
    setShowOptions(false);
  };

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="User avatar" src={profilePic} />
        </div>
      </div>
      <div className="flex items-end gap-1" ref={messageRef}>
        <div className={`chat-bubble text-white ${bubbleBgColor} pb-2 max-w-sm`}>
          {message.message}
          <div className="chat-footer opacity-50 text-xs flex gap-1 items-center mt-1">
            {formattedTime}
          </div>
        </div>
        
        {fromMe && (
          <div className="dropdown dropdown-left dropdown-bottom">
            <button
              tabIndex={0}
              className="btn btn-circle btn-ghost btn-xs text-gray-400 hover:text-white"
              onClick={() => setShowOptions(!showOptions)}
            >
              <FiMoreVertical size={16} />
            </button>
            
            <ul
              tabIndex={0}
              className={`dropdown-content z-[1] menu p-1 shadow bg-gray-700 rounded-box w-28 ${
                showOptions ? "" : "hidden"
              }`}
            >
              <li>
                <button
                  className="text-red-400 hover:text-red-500 text-sm"
                  onClick={handleDelete}
                >
                  <FiTrash2 size={14} className="mr-1" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;