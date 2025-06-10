import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useDeleteMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useConversation();

  const deleteMessage = async (messageId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setMessages(messages.filter(msg => msg._id !== messageId));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteMessage };
};
export default useDeleteMessage;