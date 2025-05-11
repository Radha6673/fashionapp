const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Chat Schema
const ChatSchema = new mongoose.Schema({
  influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [
    {
      sender: { type: String, enum: ['user', 'influencer'], required: true },
      message: { type: String },
      imageUrl: { type: String }, 
      timestamp: { type: Date, default: Date.now },
    },
  ],
  
});

const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', ChatSchema);

module.exports = { User, Chat };
