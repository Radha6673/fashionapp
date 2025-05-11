import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import bgImage from "./assets/bg1.jpg"; 


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =  () => {
    try {
       axios.post('http://localhost:5000/contact', formData, {
        withCredentials: true
      });
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again later.');
    }
  };

  return (
    <div 
    
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
          }}
        >
      <Navbar />
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-gradient text-light p-5" style={{ background: 'linear-gradient(to top right, #8e77dd, #98ff98)' }}>
        <div className="card shadow-lg w-100" style={{ maxWidth: '600px',background:'linear-gradient(to top right,rgb(213, 192, 212),rgb(223, 189, 215))' }}>
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Contact Us</h2>

            {success && (
              <div className="alert alert-success" role="alert">
                Thank you! Your message has been sent.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block mt-3"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
