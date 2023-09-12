const button = document.getElementById('yourCart');

button.addEventListener('click', () => {
  window.location.href = '/cartsView/:cartId';
});