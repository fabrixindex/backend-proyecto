/*------------------------------------ ACTUALIZACION DE PRODUCTOS EN TIEMPO REAL ----------------------------------------*/
socket.on("emmit-products", productos => {
    
    const productList = document.getElementById("product-list");
  
    productList.innerHTML = "";
      
    productos.forEach(producto => {
      
      const productCard = document.createElement("div");
      
      const titleElement = document.createElement("h3");
      titleElement.textContent = producto.title;
  
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = producto.description;
  
     
      const priceElement = document.createElement("p");
      priceElement.textContent = `Precio: $${producto.price}`;
  
      li.appendChild(titleElement);
      li.appendChild(descriptionElement);
      li.appendChild(priceElement);
  
      productList.appendChild(productCard);
    });
  });
  /*---------------------------------------------------------------------------------------------------------------------*/