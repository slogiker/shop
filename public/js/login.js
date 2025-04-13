document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const toggleButton = document.getElementById('toggle-login-password');
    const passwordInput = document.getElementById('password');

    if (toggleButton && passwordInput) {
        toggleButton.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            toggleButton.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            console.log('Submitting login:', { username });

            fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            })
                .then(response => {
                    console.log('Login response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`Login failed: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Login response:', data);
                    if (data.success) {
                        window.location.href = '/shop.html';
                    } else {
                        alert(data.message || 'Login failed');
                    }
                })
                .catch(error => {
                    console.error('Error logging in:', error);
                    alert('Error logging in: ' + error.message);
                });
        });
    }
});