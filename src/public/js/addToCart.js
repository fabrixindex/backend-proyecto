const addToCart = async (event) => {
    const productId = event.target.dataset.id;
  
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      try {
        const response = await fetch('/api/carts', {
          method: 'POST'
        });
        const data = await response.json();
        cartId = data.cartId;
        localStorage.setItem('cartId', cartId);
      } catch (error) {
        console.error('Error al crear un nuevo carrito:', error);
        return;
      }
    }
  
    try {
      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.status === 1) {
        alert(`Producto agregado al carrito ${cartId} exitosamente!`);
      } else {
        alert('Error al agregar el producto al carrito');
      }
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
    }
  };
  