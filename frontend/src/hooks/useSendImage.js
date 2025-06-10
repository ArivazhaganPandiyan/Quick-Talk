
import toast from "react-hot-toast";

const useSendImage = () => {
  const [loading, setLoading] = useState(false);

  const sendImage = async (file, receiverId) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/messages/send-image/${receiverId}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      return data;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendImage, loading };
};

export default useSendImage;