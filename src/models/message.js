const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    username: String,
    encodedMessage: String,
    codes: { type: Map, of: String },
    timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', messageSchema);