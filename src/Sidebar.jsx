import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [comments, setComments] = useState([
    {
      username: "Alice",
      text: "It was a lovely experience! It really helped me get through my wardrobe confusion. Great service!",
    },
  ]);

  const [username, setUsername] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  const addComment = () => {
    if (username.trim() === "" || newComment.trim() === "") return;
    setComments([...comments, { username, text: newComment }]);
    setNewComment("");
  };

  return (
    <div className="fixed top-0 left-0 z-50">
    
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#b38dd0] text-black font-medium shadow-md  py-1" style={{borderRadius:"10px",marginTop:"30px",marginLeft:"8px"}}
      >
        💬 {isOpen ? "Close" : "Comments"}
      </button>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div
              className="d-flex flex-column"
              style={{
                width: "280px",
                backgroundColor: "#ebd7f4",
                padding: "20px",
                borderRight: "2px solid #f5eafb",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <h5
                className="mb-3"
                style={{
                  borderBottom: "2px solid #f5eafb",
                  paddingBottom: "10px",
                  color: "#5f4b8b",
                }}
              >
                User Comments
              </h5>

              <div
                className="flex-grow-1 overflow-auto"
                style={{ maxHeight: "55vh", marginBottom: "20px" }}
              >
                {comments.length === 0 ? (
                  <p className="text-muted">No comments yet.</p>
                ) : (
                  <ul className="list-unstyled">
                    {comments.map((comment, index) => (
                      <li
                        key={index}
                        style={{
                          background: "#ffffff",
                          borderRadius: "12px",
                          padding: "12px 15px",
                          marginBottom: "15px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <strong style={{ color: "#8b5fbf" }}>
                          {comment.username}:
                        </strong>
                        <div style={{ color: "#444" }}>{comment.text}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!!localStorage.getItem("username")}
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #d6cadd",
                  }}
                />

                <textarea
                  className="form-control"
                  placeholder="Write your comment..."
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #d6cadd",
                  }}
                />

                <button
                  className="btn mt-3 w-100"
                  onClick={addComment}
                  style={{
                    backgroundColor: "#b38dd0",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
