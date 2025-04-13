function setupNavigation() {
    const navBar = document.createElement('div');
    navBar.style.display = 'flex';
    navBar.style.justifyContent = 'space-between';
    navBar.style.padding = '10px';
    navBar.style.backgroundColor = '#333';
    navBar.style.color = 'white';

    const logo = document.createElement('img');
    logo.src = "/images/logo.png";
    logo.id = "logo";
    logo.addEventListener('click', () => window.location.href = '/shop.html');
    navBar.appendChild(logo);

    const buttonContainer = document.createElement('div');
    const buttons = [
        { id: 'login', text: 'Login', href: '/login.html', display: 'inline-block' },
        { id: 'register', text: 'Register', href: '/register.html', display: 'inline-block' },
        { id: 'basket', text: 'Basket', href: '/basket.html', display: 'none' },
        { id: 'logout', text: 'Logout', display: 'none', action: logout },
        { id: 'forum', text: 'Forum', href: '/forum.html', display: 'none' }
    ];

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.id = `${btn.id}-button`;
        button.textContent = btn.text;
        button.className = 'custom-button';
        button.style.marginRight = '10px';
        button.style.display = btn.display;
        if (btn.href) {
            button.addEventListener('click', () => window.location.href = btn.href);
        } else if (btn.action) {
            button.addEventListener('click', btn.action);
        }
        buttonContainer.appendChild(button);
    });

    const categories = ['General', 'Tech', 'Gaming', 'Off-Topic'];
    const categoryElements = [];
    categories.forEach(category => {
        const span = document.createElement('span');
        span.textContent = category;
        span.className = 'custom-button';
        span.style.marginRight = '10px';
        span.style.cursor = 'pointer';
        span.style.display = 'none';
        span.addEventListener('click', () => alert(`Forum category: ${category} (coming soon)`));
        buttonContainer.appendChild(span);
        categoryElements.push(span);
    });

    navBar.appendChild(buttonContainer);
    document.body.prepend(navBar);

    fetch('/check-auth')
        .then(response => response.json())
        .then(data => {
            console.log('Auth check result:', data); // Debug log
            const isForumPage = window.location.pathname.endsWith('forum.html');
            const loginBtn = document.getElementById('login-button');
            const registerBtn = document.getElementById('register-button');
            const basketBtn = document.getElementById('basket-button');
            const logoutBtn = document.getElementById('logout-button');
            const forumBtn = document.getElementById('forum-button');

            if (data.authenticated) {
                loginBtn.style.display = 'none';
                registerBtn.style.display = 'none';
                basketBtn.style.display = 'inline-block';
                if (isForumPage) {
                    logoutBtn.style.display = 'none';
                    forumBtn.style.display = 'none';
                    categoryElements.forEach(span => span.style.display = 'inline-block');
                } else {
                    logoutBtn.style.display = 'inline-block';
                    forumBtn.style.display = 'inline-block';
                    categoryElements.forEach(span => span.style.display = 'none');
                }
            }
        })
        .catch(error => console.error('Error checking auth:', error));
}

function setupFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div>
            <img src="/images/logo.png" alt="Logo" id="footerLogo">
            <p>© 2025 MyDrugs Online. All rights reserved.</p>
            <p class="footerLink" onclick="window.location.href='/forum.html';">Forum</p>
        </div>
    `;
    document.body.appendChild(footer);
}

function logout() {
    fetch('/auth/logout', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                alert('Odjavleni ste');
                window.location.href = '/login.html';
            } else {
                alert('Napaka pri odjavi');
            }
        })
        .catch(error => console.error('Error logging out:', error));
}

function togglePassword(section) {
    let passwordFields, toggleButton;
    if (section === 'login') {
        passwordFields = [document.getElementById("password")];
        toggleButton = document.getElementById("toggle-login-password");
    } else if (section === 'register') {
        passwordFields = [
            document.getElementById("register-password"),
            document.getElementById("register-password-repeat")
        ];
        toggleButton = document.getElementById("toggle-register-password");
    }
    if (!passwordFields || !toggleButton) return;

    passwordFields.forEach(field => {
        if (field) {
            field.type = field.type === "password" ? "text" : "password";
        }
    });
    toggleButton.textContent = passwordFields[0]?.type === "password" ? "Show" : "Hide";
}

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupFooter();
});

module.exports = { togglePassword };