$(document).ready(function() {
    fetchCartItems();

    $('#checkoutForm').submit(function(event) {
        event.preventDefault();

        const fullName = $('#fullName').val();
        const email = $('#email').val();



        const orderData = {
            fullName: fullName,
            email: email,
            cartItems: cartItems
        };

        $.ajax({
            url: '/checkout/placeOrder',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderData),
            success: function(data) {
                console.log('Order placed successfully:', data);


            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error placing order:', textStatus, errorThrown);
            }
        });
    });
});

function fetchCartItems() {

    $.get('/cart', function(data) {
        console.log('Cart items received:', data);


        updateCheckoutItems(data);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching cart items:', textStatus, errorThrown);
    });
}

function updateCheckoutItems(cartItems) {
    const checkoutItemsContainer = $('#checkoutItemsContainer');
    checkoutItemsContainer.empty();

    let totalPrice = 0;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });

    cartItems.forEach(function (item) {
        const itemPrice = parseFloat(item.price);

        if (!isNaN(itemPrice)) {
            const formattedPrice = formatter.format(itemPrice);
            const listItem = $('<li>').text(`${item.name}: ${formattedPrice}`);
            checkoutItemsContainer.append(listItem);

 
            totalPrice += itemPrice;
        } else {
            console.error(`Invalid price for item ${item.name}: ${item.price}`);
        }
    });

    if (!isNaN(totalPrice)) {
        const formattedTotalPrice = formatter.format(totalPrice);
        const totalElement = $('<p>').text(`Total Price: ${formattedTotalPrice}`);
        checkoutItemsContainer.append(totalElement);
        window.cartItems = cartItems;
        window.totalPrice = totalPrice;
    } else {
        console.error('Total price calculation resulted in NaN');
    }
}
