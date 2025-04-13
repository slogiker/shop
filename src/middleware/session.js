const session = require('express-session');
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'ganja',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
});
module.exports = sessionMiddleware;