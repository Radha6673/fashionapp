import { useEffect, useState } from 'react';
import api from './api';
import ChatWindow from './chatWindow';
import { UserCircle } from 'lucide-react';
import Navbar from './Navbar';

export default function InfluencerHome() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    api.get('/chat-list')
      .then(res => {
        console.log("📥 Chat list:", res.data);
        setChats(res.data);
        const firstValidChat = res.data.find(chat => chat && chat._id);
        if (firstValidChat) {
          setSelectedChat(firstValidChat._id);
        }
      })
      .catch(err => console.error("Error loading chat list:", err));
  }, []);

  return (
    <div>
      <Navbar/>
    <div className="container-fluid h-100 d-flex p-0" style={{ background: '#f8f9fa' }}>
      <div className="col-md-4 col-lg-3 bg-white border-end shadow-sm d-flex flex-column p-3">
        <div className="d-flex align-items-center mb-4">
          <UserCircle size={36} className="text-primary me-2" />
          <div>
            <h5 className="mb-0">Influencer</h5>
            <small className="text-muted">{chats.length} active chats</small>
          </div>
        </div>

        <h6 className="text-secondary fw-bold border-bottom pb-2 mb-3">Chats</h6>
        <div className="flex-grow-1 overflow-auto">
          {chats.length === 0 ? (
            <p className="text-muted">No chats available</p>
          ) : (
            chats.map(chat => (
              <div
                key={chat._id}
                className={`p-2 rounded mb-2 ${selectedChat === chat._id ? 'bg-primary text-white' : 'bg-light'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedChat(chat._id)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{chat.user?.username || 'User'}</span>
                  <small className="text-muted">🟢</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="col-md-8 col-lg-9 bg-light d-flex flex-column p-3">
        {selectedChat ? (
          <ChatWindow chatId={selectedChat} />
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center text-muted h-100">
            <UserCircle size={80} className="mb-3 text-secondary" />
            <p>Select a chat to give fashion advice 💬</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
