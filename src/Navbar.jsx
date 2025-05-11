import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // controls dropdown

  useEffect(() => {
    fetch("http://localhost:5000/check-auth", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (!data.isAuthenticated) navigate("/");
        else setUser(data.user);
      });
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include"
    });
    navigate("/login");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#D1A3CC", borderRadius: "30px" }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white fw-bold ms-3" to="/">
        StyleMate
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/contact">Contact</Link>
            </li>
            <li className="nav-item">
              <button
                className="bg-purple-400 hover:bg-purple-600 text-black py-2 px-4 rounded-xl flex gap-2 items-center transition-all"
                onClick={() => navigate("/explore")}
              >
                <Sparkles className="w-4 h-4" /> EXPLORE
              </button>
            </li>
          </ul>

          <div className="position-relative me-3">
            <button
              className="btn btn-outline-light"
              onClick={toggleDropdown}
            >
              Sign In
            </button>

            {dropdownOpen && (
              <ul className="position-absolute bg-white  p-2 rounded w-100 mt-2 z-10" style={{ right: 0 }}>
                <li>
                  <Link to="/login" className="dropdown-item" onClick={() => setDropdownOpen(false)}>User Signup</Link>
                </li>
                <li>
                  <Link to="/InfluencerLogin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Influencer Login</Link>
                </li>
              </ul>
            )}
          </div>

          {user && (
            <button
              onClick={handleLogout}
              className="btn btn-light rounded-pill px-3 me-3"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
