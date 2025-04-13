document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    setupNavigation();
    setupFooter();
});

function setupNavigation() {
    const navBar = document.createElement('div');
    navBar.style.display = 'flex';
    navBar.style.justifyContent = 'space-between';
    navBar.style.alignItems = 'center';
    navBar.style.padding = '10px';
    navBar.style.backgroundColor = '#333';
    navBar.style.color = 'white';

    const logo = document.createElement('img');
    logo.src = '/images/logo.png';
    logo.id = 'logo';
    logo.alt = 'Logo';
    logo.style.width = '100px';
    logo.style.height = '100px';
    logo.style.objectFit = 'contain';
    logo.addEventListener('click', () => {
        window.location.href = '/shop.html';
    });
    navBar.appendChild(logo);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.alignItems = 'center';

    const loginButton = document.createElement('button');
    loginButton.id = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.className = 'custom-button';
    loginButton.style.marginRight = '10px';
    loginButton.addEventListener('click', () => {
        window.location.href = '/login.html';
    });

    const registerButton = document.createElement('button');
    registerButton.id = 'register-button';
    registerButton.textContent = 'Register';
    registerButton.className = 'custom-button';
    loginButton.style.marginRight = '10px';
    registerButton.addEventListener('click', () => {
        window.location.href = '/register.html';
    });

    const basketButton = document.createElement('button');
    basketButton.id = 'basket-button';
    basketButton.textContent = 'Basket';
    basketButton.className = 'custom-button';
    basketButton.style.marginRight = '10px';
    basketButton.style.display = 'none';
    basketButton.addEventListener('click', () => {
        window.location.href = '/basket.html';
    });

    const logoutButton = document.createElement('button');
    logoutButton.id = 'logout-button';
    logoutButton.textContent = 'Logout';
    logoutButton.className = 'custom-button';
    logoutButton.style.marginRight = '10px';
    logoutButton.style.display = 'none';
    logoutButton.addEventListener('click', () => {
        fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/login.html';
                } else {
                    alert('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error logging out:', error);
                alert('Error logging out');
            });
    });

    const forumButton = document.createElement('button');
    forumButton.id = 'forum-button';
    forumButton.textContent = 'Forum';
    forumButton.className = 'custom-button';
    forumButton.style.marginRight = '10px';
    forumButton.style.display = 'none';
    forumButton.addEventListener('click', () => {
        window.location.href = '/forum.html';
    });

    buttonContainer.append(loginButton, registerButton, basketButton, logoutButton, forumButton);
    navBar.appendChild(buttonContainer);
    document.body.prepend(navBar);

    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    while (document.body.childNodes.length > 1) {
        const child = document.body.childNodes[1];
        if (child.nodeName !== 'FOOTER') {
            mainContent.appendChild(child);
        } else {
            break;
        }
    }
    document.body.appendChild(mainContent);

    // Check authentication
    const currentPath = window.location.pathname;
    const isLoginOrRegister = currentPath.endsWith('login.html') || currentPath.endsWith('register.html');
    
    fetch('/check-auth', { credentials: 'include' })
        .then(response => {
            console.log('check-auth response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Auth check:', data);
            if (data.authenticated) {
                loginButton.style.display = 'none';
                registerButton.style.display = 'none';
                basketButton.style.display = 'inline-block';
                logoutButton.style.display = 'inline-block';
                forumButton.style.display = 'inline-block';
            } else {
                loginButton.style.display = 'inline-block';
                registerButton.style.display = 'inline-block';
                basketButton.style.display = 'none';
                logoutButton.style.display = 'none';
                forumButton.style.display = 'none';
                // Only redirect if not already on login or register page
                if (!isLoginOrRegister) {
                    console.log('Not authenticated, redirecting to login.html');
                    window.location.href = '/login.html';
                }
            }
        })
        .catch(error => {
            console.error('Auth check error:', error);
            loginButton.style.display = 'inline-block';
            registerButton.style.display = 'inline-block';
            basketButton.style.display = 'none';
            logoutButton.style.display = 'none';
            forumButton.style.display = 'none';
            // Only redirect if not on login or register page
            if (!isLoginOrRegister) {
                console.log('Auth check failed, redirecting to login.html');
                window.location.href = '/login.html';
            }
        });
}

function setupFooter() {
    const footer = document.createElement('footer');
    footer.style.backgroundColor = '#333';
    footer.style.color = 'white';
    footer.style.textAlign = 'center';
    footer.style.padding = '10px 0';

    const footerLogo = document.createElement('img');
    footerLogo.src = '/images/logo.png';
    footerLogo.id = 'footerLogo';
    footerLogo.alt = 'Footer Logo';
    footer.appendChild(footerLogo);

    const copyright = document.createElement('p');
    copyright.textContent = '© 2025 MyDrugs Online. All rights reserved.';
    footer.appendChild(copyright);

    const forumLink = document.createElement('p');
    forumLink.className = 'footerLink';
    forumLink.textContent = 'Forum';
    forumLink.addEventListener('click', () => {
        window.location.href = '/forum.html';
    });
    footer.appendChild(forumLink);

    document.body.appendChild(footer);
}