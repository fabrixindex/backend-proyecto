const yourCartButton = document.getElementById("yourCart");

yourCartButton.addEventListener("click", redirectToCart);

function redirectToCart() {
  const cartId = yourCartButton.dataset.cart;
  window.location.href = `/cartsView/${cartId}`;
};