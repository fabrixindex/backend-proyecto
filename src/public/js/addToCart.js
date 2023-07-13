const addListeners = () => {
  const addToCartButtons = document.querySelectorAll(".addToCart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
};

const addToCart = async (event) => {
  const productId = event.target.dataset.id;

  let cartId = localStorage.getItem("cartId");

  /**** OBTENCIÓN DEL cartId DE localStorage ****/

  if (!cartId) {
    try {
      const response = await fetch("/api/carts", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Error al crear un nuevo carrito");
      }

      const data = await response.json();
      cartId = data.cartId;
      localStorage.setItem("cartId", cartId);
    } catch (error) {
      console.error("Error al crear un nuevo carrito:", error);
      return;
    }
  }

  /**** AGREGAR PRODUCTO AL CARRITO ****/

  try {
    //NOTA: ${cartId} deberá ocupar el lugar del ID del carrito de prueba
    const response = await fetch(
      `/api/carts/64a5ec9181ff2fa9fbe9a31a/producto/${productId}`,
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
