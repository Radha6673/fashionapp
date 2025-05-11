import Navbar from "./Navbar";
import UserChatPage from "./UserChatPage";
import Chatbot from "./searchbar";
import Sidebar from "./Sidebar";

function Explore() {
  return (
    <div className="d-flex vh-100">
      <Sidebar />

      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <div className="flex-grow-1 overflow-hidden mt-3 px-3">
          <UserChatPage />
        </div>
        <div className="border-top">
          <Chatbot />
        </div>
      </div>
    </div>
  );
}

export default Explore;
