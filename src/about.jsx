import React from 'react';
import Navbar from './Navbar';
import bgImage from './assets/bg2.jpg';
const About = () => {

  return (
    <div
      style={{
        background: "linear-gradient(to right,rgb(248, 159, 238),rgb(135, 65, 137),rgb(81, 38, 79))",
        minHeight: "100vh"
       }}>
  
        <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>

        <p className="text-lg mb-6 text-gray-700 text-center" style={{ marginLeft: "20px", marginRight: "300px" }}>
          Welcome to <span className="font-semibold">StyleSense</span>, your personal fashion companion.
          We help you find the perfect outfit, stay on top of the latest trends, and make confident style choices –
          all powered by cutting-edge technology and a vibrant community of fashion experts.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-pink-600 mb-2">🌟 Our Mission</h2>
            <p className="text-gray-700" style={{ marginLeft: "20px", marginRight: "300px" }}>
              To make fashion accessible, fun, and personalized for everyone. Whether you're dressing for a casual day
              or a special event, we’re here to guide you with tailored suggestions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-pink-600 mb-2">🧰 What We Offer</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Smart Recommendations</strong> – Upload a photo and get instant outfit suggestions.</li>
              <li><strong>Style Search</strong> – Snap and find fashion items instantly.</li>
              <li><strong>AI + Trend Insights</strong> – Stay fashion-forward with real-time trends and AI help.</li>
              <li><strong>Ask a Fashion Influencer</strong> – Talk to style experts and solve your fashion dilemmas.</li>
              <li><strong>Safe & Supportive Community</strong> – With moderation and privacy tools, your experience stays respectful.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-pink-600 mb-2">💖 Why Choose Us?</h2>
            <p className="text-gray-700">
              We blend technology, fashion, and human connection. From AI recommendations to live chats with fashion influencers,
              we offer a one-of-a-kind styling experience.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
