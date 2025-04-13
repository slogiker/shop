document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const toggleButton = document.getElementById('toggle-register-password');
    const passwordInput = document.getElementById('register-password');
    const repeatPasswordInput = document.getElementById('register-password-repeat');

    if (toggleButton && passwordInput && repeatPasswordInput) {
        toggleButton.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            repeatPasswordInput.type = type;
            toggleButton.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const passwordRepeat = document.getElementById('register-password-repeat').value;

            fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, email, password, passwordRepeat })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Registration failed: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        window.location.href = '/shop.html';
                    } else {
                        alert(data.message || 'Registration failed');
                    }
                })
                .catch(error => {
                    console.error('Error registering:', error);
                    alert('Error registering: ' + error.message);
                });
        });
    }
});