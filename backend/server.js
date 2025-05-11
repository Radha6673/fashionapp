const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MongoStore = require('connect-mongo');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();

const { User, Chat } = require('./createChat');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }
}));

// CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Serve static uploads
app.use('/uploads', express.static('uploads'));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// MongoDB connections
mongoose.connect(process.env.MONGO_URI1)
  .then(() => console.log('Connected to Main MongoDB'))
  .catch((err) => console.error('Main MongoDB error:', err));



const externalConnection = mongoose.createConnection(process.env.MONGO_URI);

const ExternalUser = externalConnection.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
}));



app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const influencer = await User.findOne({ username }).select('+password');
    if (!influencer) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, influencer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: influencer._id, username: influencer.username }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/chat/:id', async (req, res) => {
  try {
    const chatId = req.params.id;

    const authHeader = req.headers.authorization;
    let isInfluencer = false;
    let userId;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const influencer = await User.findById(decoded.id);
      if (influencer) {
        isInfluencer = true;
        userId = influencer._id;
      }
    }

    if (!isInfluencer && req.session.user) {
      const sessionUser = await ExternalUser.findOne({ username: req.session.user.username });
      if (!sessionUser) {
        return res.status(403).json({ message: 'Unauthorized session' });
      }
      userId = sessionUser._id;
    }

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const chat = await Chat.findById(chatId)
      .populate('user', 'username email')
      .populate('influencer', 'username email');

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    
    // if (
    //   (!isInfluencer && String(chat.user._id) !== String(userId)) ||
    //   (isInfluencer && String(chat.influencer._id) !== String(userId))
    // ) {
    //   return res.status(403).json({ message: 'Access denied to this chat' });
    // }

    res.json(chat);
  } catch (err) {
    console.error('Error fetching chat:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/chat-list', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let isInfluencer = false;
    let userId;

    // JWT - Influencer
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const influencer = await User.findById(decoded.id);
      if (influencer) {
        isInfluencer = true;
        userId = influencer._id;
      }
    }

    if (!isInfluencer && req.session.user) {
      const sessionUser = await ExternalUser.findOne({ username: req.session.user.username });
      if (!sessionUser) return res.status(403).json({ message: 'Unauthorized session' });
      userId = sessionUser._id;
    }

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const query = isInfluencer ? { influencer: userId } : { user: userId };

    const chats = await Chat.find(query)
      .populate('user', 'username email')
      .populate('influencer', 'username email')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error('Error fetching chat list:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const jwt = require("jsonwebtoken");

app.post('/send-message', async (req, res) => {
  try {
    const { chatId, message, imageUrl } = req.body;

    if (!chatId || (!message && !imageUrl)) {
      return res.status(400).json({ message: 'Message or image is required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Determine sender
    let senderRole = 'user';
    let senderId = req.session.userId || null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      senderRole = decoded.role || 'influencer';
      senderId = decoded.id;
    }

    const newMessage = {
      sender: {
        _id: senderId,
        role: senderRole
      },
      message: message || '',
      imageUrl: imageUrl || null,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(200).json({ message: newMessage });
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/get-or-create-chat', async (req, res) => {
  try {
    const sessionUser = req.session.user;
    if (!sessionUser || !sessionUser.username) {
      return res.status(403).json({ message: 'Not authenticated' });
    }

    const username = sessionUser.username;
    const user = await ExternalUser.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let chat = await Chat.findOne({ user: user._id });

    if (!chat) {
      const defaultInfluencer = await User.findOne(); 
      if (!defaultInfluencer) {
        return res.status(500).json({ message: 'No influencer found in the system' });
      }


      // Predefined messages from MongoDB
      const predefinedMessages = [
        {
          sender: 'influencer',
          message: "Hey there! Welcome to Stylemate💫",
          timestamp: new Date('2025-04-22T03:16:52.042+00:00'),
        },
        {
          sender: 'influencer',
          message: "Need help with styling your outfit today?",
          timestamp: new Date('2025-04-22T03:16:52.042+00:00'),
        }
      ];

      chat = await Chat.create({
        user: user._id,
        influencer: defaultInfluencer._id, 
        messages: predefinedMessages,
      });
    }

    res.json(chat);
  } catch (err) {
    console.error("Error in /get-or-create-chat:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
