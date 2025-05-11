import { useEffect, useRef, useState } from "react";
import api from "./api";
import ChatWindow from "./chatWindow";
import { UserCircle, Send, ImagePlus } from "lucide-react";

export default function UserChatPage() {
  const [chatId, setChatId] = useState(null);
  const [influencer, setInfluencer] = useState("Influencer");
  const [newMessage, setNewMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    api.post('/get-or-create-chat')
      .then(res => {
        setChatId(res.data._id);
        setInfluencer(res.data.influencer?.username || "Influencer");
      })
      .catch(err => {
        console.error("❌ Failed to load or create chat:", err);
      });
  }, []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await api.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImageUrl(res.data.imageUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      await handleImageUpload(file);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() && !imageUrl) return;

    const token = localStorage.getItem("token");

    try {
      await api.post("/send-message", {
        chatId,
        message: newMessage,
        imageUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNewMessage("");
      setImageUrl(null);
      setSelectedFile(null);
      setRefresh(prev => !prev); 
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  return (
    <div className="container-fluid d-flex flex-column vh-100 p-0 bg-light">
      <nav className="navbar bg-white shadow-sm px-4">
        <div className="d-flex align-items-center gap-4">
          <UserCircle size={28} className="text-primary" />
          <h5 className="mb-0">Chat with {influencer}</h5>
        </div>
      </nav>

      <div className="flex-grow-1 overflow-auto p-4" style={{ background: "#f3f3f3" }}>
        <div className="shadow rounded bg-white p-3 h-100 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto">
            {chatId ? (
              <>
                <ChatWindow chatId={chatId} refresh={refresh} />

                {/* Message & Image Input */}
                <div className="d-flex mt-3 border-top pt-3 align-items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="imageInput"
                  />
                  <label htmlFor="imageInput" className="btn btn-outline-secondary d-flex align-items-center gap-1">
                    <ImagePlus size={18} />
                    <span>Image</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />

                  <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleSend}>
                    <Send size={18} />
                    <span>Send</span>
                  </button>
                </div>

                {imageUrl && (
                  <div className="mt-2 d-flex justify-content-start">
                    <img
                      src={`http://localhost:3000${imageUrl}`}
                      alt="Preview"
                      style={{ maxHeight: "100px", borderRadius: "10px" }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted mt-5">
                <p>Loading your chat... please wait.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
