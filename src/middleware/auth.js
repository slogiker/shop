function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
}
// Force cache reload
module.exports = { isAuthenticated };