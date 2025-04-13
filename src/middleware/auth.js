function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
}
console.log('is authenticated in auth.js', isAuthenticated);
module.exports = { isAuthenticated };