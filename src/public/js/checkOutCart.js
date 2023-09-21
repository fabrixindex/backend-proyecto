const checkoutCart = async () => {
  const cartId = checkoutButton.dataset.cart;

  try {
    const response = await fetch(
      `/api/carts/${cartId}/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
        Swal.fire({
          title: `Compra finalizada exitosamente! 😀`,
          icon: "success",
        }).then(() => {
            window.location.href = '/products';
          });
      } else {
        Swal.fire({
          title: "Hemos tenido un error 😡",
          icon: "error",
        });
    };

}catch(error){
    console.log(error)
}
};

const checkoutButton = document.getElementById("checkout");
checkoutButton.addEventListener("click", checkoutCart);