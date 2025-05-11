import { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

export default function InfluencerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });

      localStorage.setItem('token', res.data.token);

      navigate('/InfluencerHome');
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(to right,rgb(113, 193, 234),rgb(238, 128, 212), #8a2387)",
      minHeight: "100vh"
    }}>
      <div className="form-signin w-100 m-auto " style={{ maxWidth: "400px" }}>
        <form onSubmit={handleLogin}>
          <h1 className="h3 mb-3 fw-normal text-center">Log in</h1>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="floatingInput">Username</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
