document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let currentUser = null;

    fetch('/check-auth')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                currentUser = data.username;
                fetchMessages();
            } else {
                window.location.href = '/login.html';
            }
        })
        .catch(error => {
            console.error('Error checking auth:', error);
            window.location.href = '/login.html';
        });

    function fetchMessages() {
        fetch('/forum/messages', { credentials: 'include' })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch messages');
                return response.json();
            })
            .then(messages => {
                const chatBox = document.getElementById('chatBox');
                chatBox.innerHTML = '';
                messages.forEach(displayMessage);
                chatBox.scrollTop = chatBox.scrollHeight;
            })
            .catch(error => console.error('Error loading messages:', error));
    }

    socket.on('chatMessage', (data) => {
        displayMessage(data);
        const chatBox = document.getElementById('chatBox');
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    function displayMessage(msg) {
        const chatBox = document.getElementById('chatBox');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        if (msg.username === 'admin') {
            messageDiv.classList.add('admin-message');
        }
        messageDiv.innerHTML = `<strong>${msg.username}:</strong> ${msg.message} <span class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</span>`;
        messageDiv.dataset.id = msg._id;
        if (currentUser === 'admin') {
            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'x';
            deleteBtn.onclick = () => deleteMessage(msg._id);
            messageDiv.appendChild(deleteBtn);
        }
        chatBox.appendChild(messageDiv);
    }

    function sendMessage() {
        const input = document.getElementById('messageInput');
        if (input.value.trim()) {
            socket.emit('chatMessage', input.value);
            input.value = '';
        }
    }

    function deleteMessage(id) {
        fetch(`/forum/messages/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    document.querySelector(`[data-id="${id}"]`).remove();
                } else {
                    alert('Failed to delete message');
                }
            })
            .catch(error => console.error('Error deleting message:', error));
    }

    const sendButton = document.getElementById('send-message');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
});