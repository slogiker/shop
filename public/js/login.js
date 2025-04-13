const { togglePassword } = require('./common');

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-login-password');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => togglePassword('login'));
    }
});