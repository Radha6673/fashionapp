import { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [image, setImage] = useState(null);

  const sendMessage = async () => {
    if (!message.trim() && !image) return;

    const userMsg = {
      sender: "user",
      text: message,
      ...(image && { imageUrl: URL.createObjectURL(image) }) 
    };
    setChat(prevChat => [...prevChat, userMsg]);

    const formData = new FormData();
    formData.append("message", message);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const botMsg = { sender: "bot", text: response.data.reply || "No response from AI." };
      setChat(prevChat => [...prevChat, botMsg]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setChat(prevChat => [...prevChat, { sender: "bot", text: "Error: Could not get response." }]);
    }

    setMessage("");
    setImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4" style={{ borderRadius: "50px" }}>
        <div className="hidden" style={{ backgroundColor: "#D7F4E9" }}>
          {chat.map((msg, index) => (
            <div key={index} className={`p-2 rounded ${msg.sender === "user" ? "text-right bg-blue-200" : "text-left bg-gray-200"}`}>
              {msg.text}
              {msg.imageUrl && <img src={msg.imageUrl} alt="uploaded" className="mt-2 max-w-xs rounded" />}
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center">
          <label className="cursor-pointer text-2xl text-purple-500" htmlFor="image-upload">
            <FaPlus />
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <input
            style={{ backgroundColor: "#D7F4E9", width: "60rem", borderRadius: "40px", marginLeft: "10px" }}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2"
            placeholder="Ask fashion advice..."
          />
          <button
            onClick={sendMessage}
            className="ml-2 text-black px-4 py-2"
            style={{ backgroundColor: "#ebd7f4", borderRadius: "40px", marginLeft: "4px" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
