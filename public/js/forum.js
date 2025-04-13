const express = require('express');
const { decode } = require('huffman-javascript'); // Added
const Message = require('../models/message');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Define manualDecode function
function manualDecode(encodedMessage, codesObj) {
    let decoded = '';
    let currentCode = '';
    for (let bit of encodedMessage) {
        currentCode += bit;
        if (codesObj[currentCode]) {
            decoded += codesObj[currentCode];
            currentCode = '';
        }
    }
    return decoded;
}

router.get('/messages', isAuthenticated, async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        const decodedMessages = messages.map(msg => {
            try {
                if (!msg.encodedMessage || !msg.codes || typeof msg.codes.entries !== 'function') {
                    throw new Error('Invalid message format');
                }
                const invertedCodes = new Map();
                for (const [char, code] of msg.codes.entries()) {
                    invertedCodes.set(code, char);
                }
                const codesObj = Object.fromEntries(invertedCodes);
                let decodedMessage;
                try {
                    decodedMessage = decode(msg.encodedMessage, invertedCodes);
                    if (decodedMessage) return { _id: msg._id, username: msg.username, message: decodedMessage, timestamp: msg.timestamp };
                } catch (mapError) {
                    console.error('Map decode failed:', mapError);
                }
                try {
                    decodedMessage = decode(msg.encodedMessage, codesObj);
                    if (decodedMessage) return { _id: msg._id, username: msg.username, message: decodedMessage, timestamp: msg.timestamp };
                } catch (objError) {
                    console.error('Object decode failed:', objError);
                }
                decodedMessage = manualDecode(msg.encodedMessage, codesObj);
                return {
                    _id: msg._id,
                    username: msg.username,
                    message: decodedMessage || '[Empty decode result]',
                    timestamp: msg.timestamp
                };
            } catch (decodeError) {
                console.error('Error decoding message:', decodeError);
                return {
                    _id: msg._id,
                    username: msg.username,
                    message: '[Error decoding message: ' + decodeError.message + ']',
                    timestamp: msg.timestamp
                };
            }
        });
        res.json(decodedMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Server error');
    }
});

router.delete('/messages/:id', isAuthenticated, async (req, res) => {
    if (req.session.user.username !== 'admin') {
        return res.status(403).send('Forbidden');
    }
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).send('Message deleted');
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;