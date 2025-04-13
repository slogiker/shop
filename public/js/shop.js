document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    fetch('/check-auth', { credentials: 'include' })
        .then(response => {
            console.log('Shop check-auth status:', response.status);
            if (!response.ok) {
                throw new Error('Auth check failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Shop auth check:', data);
            if (!data.authenticated) {
                window.location.href = '/login.html';
            } else {
                console.log('User authenticated:', data.username);
                initializeShop();
            }
        })
        .catch(error => {
            console.error('Error checking auth:', error);
            window.location.href = '/login.html';
        });

    function initializeShop() {
        const addToBasketButtons = document.querySelectorAll('.add-to-basket');
        addToBasketButtons.forEach(button => {
            button.addEventListener('click', () => {
                const item = button.closest('.item');
                const name = item.dataset.name;
                const quantity = parseInt(item.querySelector('.quantity').value, 10);
                const priceBTC = parseFloat(item.dataset.priceBtc);
                const priceETH = parseFloat(item.dataset.priceEth);

                console.log('Adding to basket:', { name, quantity, priceBTC, priceETH });

                if (!name || isNaN(quantity) || quantity < 1 || isNaN(priceBTC) || isNaN(priceETH)) {
                    console.error('Invalid item data:', { name, quantity, priceBTC, priceETH });
                    alert('Please enter valid item details');
                    return;
                }

                fetch('/shop/add-to-basket', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ name, quantity, priceBTC, priceETH })
                })
                    .then(response => {
                        console.log('Add-to-basket response status:', response.status);
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Add-to-basket response:', data);
                        if (data.success) {
                            alert('Added to basket');
                        } else {
                            console.error('Failed to add to basket:', data.message);
                            alert(data.message || 'Failed to add to basket');
                        }
                    })
                    .catch(error => {
                        console.error('Error adding to basket:', error);
                        alert('Error adding to basket: ' + error.message);
                    });
            });
        });
    }
});