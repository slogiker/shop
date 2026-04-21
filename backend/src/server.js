const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const sessionMiddleware = require('./middleware/session');
const { isAuthenticated } = require('./middleware/auth');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const server = http.createServer(app);
// Allow requests from the Angular dev server and Electron (file:// → null origin)
const allowedOrigins = ['http://localhost:4200', 'http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

const io = new Server(server, { cors: corsOptions });

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionMiddleware);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/shop', require('./routes/shop'));
app.use('/forum', require('./routes/forum'));

// API: Check authentication status
app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true, username: req.session.user.username });
    } else {
        res.json({ authenticated: false });
    }
});

// Serve built Angular frontend (Electron app mode only)
if (process.env.FRONTEND_DIST) {
    app.use(express.static(process.env.FRONTEND_DIST));
    app.get('*', (req, res) => {
        res.sendFile(path.join(process.env.FRONTEND_DIST, 'index.html'));
    });
}

// Socket.IO session middleware
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
    if (!socket.request.session || !socket.request.session.user) {
        // Allow connection but maybe restrict events? 
        // For now, strict disconnect if not auth, matching old logic
        // socket.disconnect(); 
        // Actually, let's keep it open but check auth on events if needed, 
        // or just disconnect if strict auth required for chat.
        // The old logic disconnected:
        // socket.disconnect();
        // return;
    }

    // Check if user exists in session for username
    const username = socket.request.session?.user?.username || 'Anonymous';

    socket.on('chatMessage', async (text) => {
        const { getCodesFromText, encode } = require('huffman-javascript');
        const Message = require('./models/message');
        try {
            const codes = getCodesFromText(text);
            const encoded = encode(text, codes).join('');
            const newMessage = new Message({
                username,
                encodedMessage: encoded,
                codes,
                timestamp: new Date()
            });
            await newMessage.save();
            io.emit('chatMessage', {
                _id: newMessage._id,
                username,
                message: text,
                timestamp: newMessage.timestamp
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});