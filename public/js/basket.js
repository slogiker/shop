document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    fetch('/check-auth', { credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Auth check failed');
            }
            return response.json();
        })
        .then(data => {
            if (!data.authenticated) {
                window.location.href = '/login.html';
            } else {
                console.log('User authenticated:', data.username);
                initializeBasket();
            }
        })
        .catch(error => {
            console.error('Error checking auth:', error);
            window.location.href = '/login.html';
        });

    function initializeBasket() {
        fetch('/shop/get-basket', { credentials: 'include' })
            .then(response => response.json())
            .then(basket => {
                const basketDiv = document.getElementById('basket');
                if (basket.length === 0) {
                    basketDiv.innerHTML = '<p>Your basket is empty.</p>';
                    return;
                }
                basket.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'basket-item';
                    itemDiv.innerHTML = `
                        <span>${item.name} x${item.quantity}</span>
                        <span>${item.priceBTC} BTC / ${item.priceETH} ETH</span>
                    `;
                    basketDiv.appendChild(itemDiv);
                });
            })
            .catch(error => {
                console.error('Error fetching basket:', error);
            });

        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const orderData = Object.fromEntries(formData);
                fetch('/shop/confirm-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(orderData)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Order confirmed');
                            window.location.href = '/shop.html';
                        } else {
                            alert(data.message || 'Order failed');
                        }
                    })
                    .catch(error => {
                        console.error('Error confirming order:', error);
                        alert('Error confirming order');
                    });
            });
        }
    }
});