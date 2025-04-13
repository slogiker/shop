document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    fetch('/check-auth', { credentials: 'include' })
        .then(response => {
            console.log('Forum check-auth status:', response.status);
            if (!response.ok) {
                throw new Error('Auth check failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Forum auth check:', data);
            if (!data.authenticated) {
                window.location.href = '/login.html';
            } else {
                console.log('User authenticated:', data.username);
                initializeForum();
            }
        })
        .catch(error => {
            console.error('Error checking auth:', error);
            window.location.href = '/login.html';
        });

    function initializeForum() {
        const socket = io();
        const chatBox = document.getElementById('chatBox');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');

        socket.on('chatMessage', (msg) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.textContent = `${msg.username}: ${msg.message}`;
            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        });

        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                socket.emit('chatMessage', message);
                messageInput.value = '';
            }
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && messageInput.value.trim()) {
                socket.emit('chatMessage', messageInput.value.trim());
                messageInput.value = '';
            }
        });
    }
});