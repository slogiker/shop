/*
###########TODO###########
# basket shranjuje v mongodb tud ce ni dokoncan nakup
# basket.html ni vredu narejen
# forum me preusmeri na login tudi če sem prijavljen (še vedno kaže logout, forum, basket gumbe)
# če si odjavljen te index preusmeri na login.html
# preuredi footer da bo isti ko učasih
*/
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const sessionMiddleware = require('./middleware/session');
const { isAuthenticated } = require('./middleware/auth');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, '..', 'public')));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/shop', require('./routes/shop'));
app.use('/forum', require('./routes/forum'));

// Check authentication status
app.get('/check-auth', (req, res) => {
    console.log('check-auth session:', req.session.user);
    if (req.session.user) {
        res.json({ authenticated: true, username: req.session.user.username });
    } else {
        res.json({ authenticated: false });
    }
});

// Protected routes
app.get('/shop.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'shop.html'));
});
app.get('/forum.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'forum.html'));
});
app.get('/basket.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'basket.html'));
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Socket.IO session middleware
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
    if (!socket.request.session || !socket.request.session.user) {
        socket.disconnect();
        return;
    }
    const username = socket.request.session.user.username;
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

server.listen(4200, () => {
    console.log('Server running on port 4200');
});