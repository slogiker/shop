const { togglePassword } = require('./common');

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-register-password');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => togglePassword('register'));
    }
});