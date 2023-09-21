const addListeners = () => {
  const addToCartButtons = document.querySelectorAll(".addToCart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
};

const addToCart = async (event) => {

  const productId = event.target.dataset.id;
  const cartId = event.target.dataset.cart;

  if (!cartId) {
    console.error("No se encontró el carrito");
    return;
  };

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