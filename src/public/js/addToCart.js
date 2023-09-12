const addListeners = () => {
  const addToCartButtons = document.querySelectorAll(".addToCart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
};

function getCookie() {
  const value = `${document.cookie}`;
  const parts = value.split('cart=');
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const addToCart = async (event) => {
  console.log("Botón de agregar al carrito clickeado."); 

  const productId = event.target.dataset.id;
  console.log("ID del producto:", productId);

  // Obtener el cart
  const cartId = getCookie();
  console.log("Valor de la cookie 'cart':", cartId); 

  if (!cartId) {
    console.error("No se encontró el carrito en la cookie.");
    return;
  }

  try {
    const response = await fetch(
      `/api/carts/${cartId}/producto/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      Swal.fire({
        title: `Producto agregado al carrito exitosamente! 😀`,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Error al agregar el producto al carrito 😡",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
};

addListeners(); 