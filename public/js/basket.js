document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkoutForm');
    const basketSection = checkoutForm.querySelector('.form-section:first-child'); // The "Your Basket" section
    const sameAsBilling = document.getElementById('sameAsBilling');
    const shippingFields = document.getElementById('shippingFields');

    fetch('/shop/get-basket')
        .then(response => response.json())
        .then(basket => {
            if (basket.length === 0) {
                basketSection.innerHTML = '<h2>Your Basket</h2><p>Your basket is empty.</p>';
                return;
            }
            basketSection.innerHTML = '<h2>Your Basket</h2>';
            basket.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'basket-item';
                itemDiv.textContent = `${item.name} x${item.quantity} ${item.priceBTC} BTC / ${item.priceETH} ETH`;
                basketSection.appendChild(itemDiv);
            });
            checkoutForm.style.display = 'block';
        })
        .catch(error => console.error('Error fetching basket:', error));

    sameAsBilling.addEventListener('change', () => {
        shippingFields.style.display = sameAsBilling.checked ? 'none' : 'block';
        const shippingInputs = shippingFields.querySelectorAll('input');
        shippingInputs.forEach(input => input.required = !sameAsBilling.checked);
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            billingStreet: document.getElementById('billingStreet').value,
            billingCity: document.getElementById('billingCity').value,
            billingPostal: document.getElementById('billingPostal').value,
            billingCountry: document.getElementById('billingCountry').value,
            shippingStreet: sameAsBilling.checked ? document.getElementById('billingStreet').value : document.getElementById('shippingStreet').value,
            shippingCity: sameAsBilling.checked ? document.getElementById('billingCity').value : document.getElementById('shippingCity').value,
            shippingPostal: sameAsBilling.checked ? document.getElementById('billingPostal').value : document.getElementById('shippingPostal').value,
            shippingCountry: sameAsBilling.checked ? document.getElementById('billingCountry').value : document.getElementById('shippingCountry').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            notes: document.getElementById('notes').value
        };

        fetch('/shop/confirm-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Order confirmed!');
                    window.location.href = '/shop.html';
                } else {
                    alert('Error confirming order: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    });
});