import { useEffect, useRef, useState } from 'react';
import api from './api';
import './ChatWindow.css';

export default function ChatWindow({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    api.get(`/chat/${chatId}`)
      .then(res => setMessages(res.data.messages || []))
      .catch(err => console.error('Error fetching messages:', err));
  }, [chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(res.data.imageUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  const handleSend = async () => {
    if (!chatId || (!newMessage.trim() && !imageUrl)) {
      console.error('❌ Cannot send — message or image is empty');
      return;
    }

    const messageData = {
      chatId,
      message: newMessage,
      imageUrl,
    };

    try {
      const res = await api.post('/send-message', messageData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setMessages(prev => [...prev, res.data.message]);
      setNewMessage('');
      setSelectedFile(null);
      setImageUrl(null);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      await handleImageUpload(file);
    }
  };

  if (!chatId) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 text-muted">
        <div className="spinner-border text-primary me-2" role="status"></div>
        <span>Loading chat...</span>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* Chat messages */}
      <div className="flex-grow-1 overflow-auto mb-3 p-3 bg-white rounded shadow-sm" style={{ maxHeight: '70vh' }}>
        <div className="d-flex flex-column gap-3">
          {messages.length === 0 && (
            <div className="text-center text-muted mt-5">👋 Be the first to say hi!</div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded px-3 py-2 shadow-sm ${
                msg.sender === 'influencer'
                  ? 'bg-primary text-white align-self-end'
                  : 'bg-light text-dark align-self-start'
              }`}
              style={{ maxWidth: '70%' }}
            >
              {msg.message && <div>{msg.message}</div>}
              {msg.imageUrl && (
                <div className="mt-2">
                  <img
                    src={`http://localhost:3000${msg.imageUrl}`}
                    alt="sent"
                    style={{ maxWidth: '100%', borderRadius: '10px' }}
                  />
                </div>
              )}
              <div className="text-end text-muted small mt-1" style={{ fontSize: '10px' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Image upload */}
      <div className="input-group mt-auto p-2">
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>

      {/* Message input */}
      <div className="input-group p-2">
        <input
          type="text"
          className="form-control rounded-start"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn btn-primary rounded-end" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
