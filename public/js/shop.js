document.addEventListener('DOMContentLoaded', () => {
    const addToBasketButtons = document.querySelectorAll('.add-to-basket');
    addToBasketButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.item');
            const name = item.getAttribute('data-name');
            const quantity = parseInt(item.querySelector('.quantity').value);
            const priceBTC = parseFloat(item.getAttribute('data-price-btc'));
            const priceETH = parseFloat(item.getAttribute('data-price-eth'));

            if (quantity < 1) {
                alert('Please select a valid quantity');
                return;
            }

            fetch('/shop/add-to-basket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, quantity, priceBTC, priceETH })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.success ? 'Added to basket' : 'Error adding to basket');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding to basket');
            });
        });
    });
});