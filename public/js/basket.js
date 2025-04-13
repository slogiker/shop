document.addEventListener('DOMContentLoaded', () => {
    let basket = [];
    const basketItemsDiv = document.getElementById('basket-items');
    const totalPriceSpan = document.getElementById('total-price');
    const currencySpan = document.getElementById('currency');
    const paymentMethodSelect = document.getElementById('payment-method');
    const sameAsBillingCheckbox = document.getElementById('same-as-billing');
    const shippingFields = document.getElementById('shipping-fields');

    fetch('/shop/get-basket', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            basket = data;
            basketItemsDiv.innerHTML = '';
            if (basket.length === 0) {
                basketItemsDiv.innerHTML = '<p>Your basket is empty.</p>';
                document.getElementById('order-form').style.display = 'none';
            } else {
                basket.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'basket-item';
                    itemDiv.innerHTML = `
                        <span>${item.name} x ${item.quantity}</span>
                        <span>${item.priceBTC} BTC / ${item.priceETH} ETH</span>
                    `;
                    basketItemsDiv.appendChild(itemDiv);
                });
            }
            updateTotalPrice();
        })
        .catch(error => {
            console.error('Error fetching basket:', error);
            basketItemsDiv.innerHTML = '<p>Error loading basket.</p>';
        });

    sameAsBillingCheckbox.addEventListener('change', () => {
        shippingFields.style.display = sameAsBillingCheckbox.checked ? 'none' : 'block';
        const inputs = shippingFields.querySelectorAll('input');
        inputs.forEach(input => {
            input.required = !sameAsBillingCheckbox.checked;
        });
    });

    paymentMethodSelect.addEventListener('change', updateTotalPrice);

    document.getElementById('order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            firstName: document.getElementById('first-name').value.trim(),
            lastName: document.getElementById('last-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            billingStreet: document.getElementById('billing-street').value.trim(),
            billingCity: document.getElementById('billing-city').value.trim(),
            billingPostal: document.getElementById('billing-postal').value.trim(),
            billingCountry: document.getElementById('billing-country').value.trim(),
            shippingStreet: sameAsBillingCheckbox.checked ? document.getElementById('billing-street').value.trim() : document.getElementById('shipping-street').value.trim(),
            shippingCity: sameAsBillingCheckbox.checked ? document.getElementById('billing-city').value.trim() : document.getElementById('shipping-city').value.trim(),
            shippingPostal: sameAsBillingCheckbox.checked ? document.getElementById('billing-postal').value.trim() : document.getElementById('shipping-postal').value.trim(),
            shippingCountry: sameAsBillingCheckbox.checked ? document.getElementById('billing-country').value.trim() : document.getElementById('shipping-country').value.trim(),
            paymentMethod: paymentMethodSelect.value,
            notes: document.getElementById('notes').value.trim()
        };

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
            !formData.billingStreet || !formData.billingCity || !formData.billingPostal || !formData.billingCountry ||
            (!sameAsBillingCheckbox.checked && (!formData.shippingStreet || !formData.shippingCity || !formData.shippingPostal || !formData.shippingCountry)) ||
            !formData.paymentMethod) {
            alert('Please fill in all required fields');
            return;
        }
        if (basket.length === 0) {
            alert('Your basket is empty');
            return;
        }

        fetch('/shop/confirm-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Order confirmed! Thank you for your purchase.');
                window.location.href = '/shop.html';
            } else {
                alert(data.message || 'Error confirming order');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error confirming order');
        });
    });

    function updateTotalPrice() {
        const paymentMethod = paymentMethodSelect.value;
        let total = 0;
        if (paymentMethod && basket.length > 0) {
            basket.forEach(item => {
                total += item.quantity * (paymentMethod === 'BTC' ? item.priceBTC : item.priceETH);
            });
            currencySpan.textContent = paymentMethod;
        } else {
            currencySpan.textContent = '';
        }
        totalPriceSpan.textContent = total.toFixed(4);
    }
});