const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema (for both influencer and user)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:{type:String,require:true},
  password: { type: String, required: true }
});

// Chat Schema
const ChatSchema = new mongoose.Schema({
  influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [
    {
      sender: { type: String, enum: ['user', 'influencer'], required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model('User', UserSchema); 
const Chat = mongoose.model('Chat', ChatSchema);

// Async initializer
async function init() {
  try {
    await mongoose.connect(process.env.MONGO_URI1);
    console.log("✅ Connected to MongoDB");

    // Create influencer
    let influencer = await User.findOne({ username: 'influencer1' });
    if (!influencer) {
      const hashed = await bcrypt.hash('password123', 10);
      influencer = await User.create({ username: 'influencer1',email:'influncer@sample.com', password: hashed });
      console.log('✅ Influencer created');
    }

    // Create user
    let user = await User.findOne({ username: 'user1' });
    if (!user) {
      const hashed = await bcrypt.hash('test123', 10);
      user = await User.create({ username: 'user1',email:'user@sample.com', password: hashed });
      console.log('✅ User created');
    }

    // Create chat
    let chat = await Chat.findOne({ influencer: influencer._id, user: user._id });
    if (!chat) {
      chat = await Chat.create({
        influencer: influencer._id,
        user: user._id,
        messages: [
          { sender: 'user', message: 'Hi, can you help me with outfit advice?' }
        ]
      });
      console.log('✅ Chat created:', chat._id);
    } else {
      console.log('⚠️ Chat already exists:', chat._id);
    }

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

init();
