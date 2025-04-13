function setupNavigation() {
    // Create navbar
    const navBar = document.createElement('div');
    navBar.style.display = 'flex';
    navBar.style.justifyContent = 'space-between';
    navBar.style.padding = '10px';
    navBar.style.backgroundColor = '#333';
    navBar.style.color = 'white';

    // Logo
    const logo = document.createElement('img');
    logo.src = "/images/logo.png";
    logo.id = "logo";
    logo.alt = "Logo";
    logo.addEventListener('click', () => {
        window.location.href = '/shop.html';
    });
    navBar.appendChild(logo);

    // Button container
    const buttonContainer = document.createElement('div');

    // Login button
    const loginButton = document.createElement('button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.className = 'custom-button';
    loginButton.style.marginRight = '10px';
    loginButton.addEventListener('click', () => {
        window.location.href = '/login.html';
    });
    buttonContainer.appendChild(loginButton);

    // Register button
    const registerButton = document.createElement('button');
    registerButton.id = 'register-button';
    registerButton.textContent = 'Register';
    registerButton.className = 'custom-button';
    loginButton.style.marginRight = '10px';
    registerButton.addEventListener('click', () => {
        window.location.href = '/register.html';
    });
    buttonContainer.appendChild(registerButton);

    // Basket button
    const basketButton = document.createElement('button');
    basketButton.id = 'basket-button';
    basketButton.textContent = 'Basket';
    basketButton.className = 'custom-button';
    basketButton.style.marginRight = '10px';
    basketButton.style.display = 'none';
    basketButton.addEventListener('click', () => {
        window.location.href = '/basket.html';
    });
    buttonContainer.appendChild(basketButton);

    // Logout button
    const logoutButton = document.createElement('button');
    logoutButton.id = 'logout-button';
    logoutButton.textContent = 'Logout';
    logoutButton.className = 'custom-button';
    logoutButton.style.marginRight = '10px';
    logoutButton.style.display = 'none';
    logoutButton.addEventListener('click', () => {
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
    });
    buttonContainer.appendChild(logoutButton);

    // Forum button
    const forumButton = document.createElement('button');
    forumButton.id = 'forum-button';
    forumButton.textContent = 'Forum';
    forumButton.className = 'custom-button';
    forumButton.style.marginRight = '10px';
    forumButton.style.display = 'none';
    forumButton.addEventListener('click', () => {
        window.location.href = '/forum.html';
    });
    buttonContainer.appendChild(forumButton);

    // Forum category placeholders
    const categories = ['General', 'Tech', 'Gaming', 'Off-Topic'];
    const categoryElements = [];
    categories.forEach(category => {
        const categorySpan = document.createElement('span');
        categorySpan.id = `category-${category.toLowerCase()}`;
        categorySpan.textContent = category;
        categorySpan.className = 'custom-button';
        categorySpan.style.marginRight = '10px';
        categorySpan.style.cursor = 'pointer';
        categorySpan.style.display = 'none';
        categorySpan.addEventListener('click', () => {
            alert(`Forum category: ${category} (coming soon)`);
        });
        buttonContainer.appendChild(categorySpan);
        categoryElements.push(categorySpan);
    });

    navBar.appendChild(buttonContainer);
    document.body.prepend(navBar);

    // Wrap content in main-content
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    while (document.body.childNodes.length > 1) {
        const child = document.body.childNodes[1]; // Skip navBar
        if (child.nodeName !== 'FOOTER') { // Avoid moving footer
            mainContent.appendChild(child);
        } else {
            break;
        }
    }
    document.body.appendChild(mainContent);

    // Authentication check
    fetch('/auth/check-auth')
        .then(response => response.json())
        .then(data => {
            console.log('Auth check result:', data);
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

                    // Add Welcome message
                    const welcomeSpan = document.createElement('span');
                    welcomeSpan.textContent = `Welcome, ${data.username}`;
                    welcomeSpan.className = 'custom-button';
                    welcomeSpan.style.marginRight = '10px';
                    buttonContainer.insertBefore(welcomeSpan, logoutBtn);
                }
            }
        })
        .catch(error => console.error('Error checking auth:', error));
}

function setupFooter() {
    // Create footer
    const footer = document.createElement('footer');
    footer.style.backgroundColor = '#333';
    footer.style.color = 'white';
    footer.style.textAlign = 'center';
    footer.style.padding = '10px 0';

    // Footer logo
    const footerLogo = document.createElement('img');
    footerLogo.src = '/images/logo.png';
    footerLogo.id = 'footerLogo';
    footerLogo.alt = 'Footer Logo';
    footer.appendChild(footerLogo);

    // Copyright text
    const copyright = document.createElement('p');
    copyright.textContent = '© 2025 MyDrugs Online. All rights reserved.';
    footer.appendChild(copyright);

    // Forum link
    const forumLink = document.createElement('p');
    forumLink.className = 'footerLink';
    forumLink.textContent = 'Forum';
    forumLink.addEventListener('click', () => {
        window.location.href = '/forum.html';
    });
    footer.appendChild(forumLink);

    document.body.appendChild(footer);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    setupNavigation();
    setupFooter();
});