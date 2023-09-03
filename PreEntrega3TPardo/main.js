class Producto {
    constructor(id, titulo, precio, autor, stock, imagen) {
      this.id = id;
      this.titulo = titulo;
      this.precio = precio;
      this.autor = autor;
      this.stock = stock;
      this.imagen = imagen;
    };
  
    vender() {
      if (this.stock >= 1) {
        this.stock -= 1;
    }}
  };
  
  const productos = () => {
    let productos = [];
    productos.push(new Producto(1, "El Principito", 11990, "Antoine de Saint-Exupéry", 5, "/imagenes/El_principito.jpg"));
    productos.push(new Producto(2, "Mr. Mercedes", 15990, "Stephen King", 8, "/imagenes/MrMercedes.jpg"));
    productos.push(new Producto(3, "La Piedra Filosofal", 17990, "J.K. Rowling", 20, "/imagenes/LaPiedraFilosofal.jpg"));
    productos.push(new Producto(4, "La Camara Secreta", 18990, "J.K. Rowling", 20, "/imagenes/CamaraSecreta.jpg"));
    productos.push(new Producto(5, "EL Prisionero de Azkaban", 19990, "J.K. Rowling", 20, "/imagenes/PrisioneroAzkaban.jpg"));
    productos.push(new Producto(6, "EL Caliz de Fuego", 20990, "J.K. Rowling", 10, "/imagenes/CalizDeFuego.jpg"));
    productos.push(new Producto(7, "Pack 7 Libros Harry Potter", 98990, "J.K. Rowling", 2, "/imagenes/PackHarryPotter.jpg"));
    productos.push(new Producto(8, "IT", 15990, "Stephen King", 6, "/imagenes/IT.jpg"));
    productos.push(new Producto(9, "Misery", 10990, "Stephen King", 8, "/imagenes/Misery.jpg"));
    return productos;
  };
  
  let listaDeProductos = productos();
  let pagLibros = document.getElementById("libros")
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let container = document.getElementById("container");
  let pagCarritoDeCompras = document.getElementById("carritoDeCompras");
  let contadorCarrito = document.getElementById("contadorCarrito");
  contadorCarrito.innerHTML = "0";
  
  const card = (item) => {
    let titulo = item.titulo.split(" ").join("");
    let div = document.createElement("div");
    div.setAttribute("id", `${titulo}-${item.id}`); div.className = "card-producto"; div.innerHTML = `
      <img src="${item.imagen}" alt="${item.titulo}">
      <h4>${item.titulo}</h4>
      <p>${item.autor}</p>
      <p>Precio: $${item.precio}</p>
      
      <div>
        <input type="number" name="cantidadCompra-${titulo}-${item.id}" id="cantidadCompra-${titulo}-${item.id}" min="1" max="5" value="1">
        <button type="button" id="btn-${titulo}-${item.id}">Comprar</button>
      </div>
      
    `;
    container.append(div);
    let botonAgregarCarrito = document.getElementById(`btn-${titulo}-${item.id}`);
    let cantidadCompra = document.getElementById(`cantidadCompra-${titulo}-${item.id}`)
    const agregadoAlCarrito = () => {
      for (let i = 1; i <= cantidadCompra.value; i++) {
        carrito.push(item)
        localStorage.setItem("carrito", JSON.stringify(carrito))
        contadorCarrito.innerHTML = carrito.length;
      }
    }
    botonAgregarCarrito.addEventListener("click", agregadoAlCarrito);
    }

  
  const mostrarTodosLosProductos = (productos) => {
    container.innerHTML = "";
    let titulo = document.createElement("h3")
    titulo.innerHTML = "Novedades";
    container.append(titulo);
    productos.forEach((item) => {
      card(item);
    });
  }
  
  const filtroDeProductos = (productos) => {
    let botonBuscador = document.getElementById("botonBuscador");
    let inputBuscador = document.getElementById("inputBuscador");
  
  
    const filtrar = () => {
      container.innerHTML = ""
  
      let filtro = productos.filter(item =>
        Object.values(item).some(value => typeof value === "string" && value.toLowerCase().includes(inputBuscador.value.toLowerCase()))
      );
      if (filtro.length > 0) {
        filtro.forEach((item) => {
          card(item);
        });
      } else {
        let div = document.createElement("div");
        div.className = "sinStock";
        div.innerHTML = `<h3>No Disponible "${inputBuscador.value}".</h3>`;
        container.append(div);
      }
    }
  
    botonBuscador.addEventListener("click", filtrar)
    inputBuscador.addEventListener("keyup", () => {
      if (event.key === "Enter") {
        filtrar();
      }
    })
  }
  
  const carritoCompras = () => {
    container.innerHTML = "";
    let titulo = document.createElement("h3")
    titulo.innerHTML = "Listado de Productos";
    container.append(titulo);
    let productosEnCarrito = {}; 
    let total = 0;
  
    const mostrarProductoEnCarrito = (item) => {
      if (!productosEnCarrito[item.id]) {
        productosEnCarrito[item.id] = {
          producto: item,  stock: 1, subtotal: item.precio,
        };
      } else {
        productosEnCarrito[item.id].stock++; productosEnCarrito[item.id].subtotal += item.precio;
      }
    };
  
    carrito.forEach((item) => {
      mostrarProductoEnCarrito(item);
    });
  
    for (let id in productosEnCarrito) {
      let productoEnCarrito = productosEnCarrito[id];
      let div = document.createElement("div");
      div.className = "card-carrito";
      div.innerHTML = `
        <img src="${productoEnCarrito.producto.imagen}" alt="${productoEnCarrito.producto.titulo}">
        <h4>${productoEnCarrito.producto.titulo}</h4>
        <p>Cantidad: ${productoEnCarrito.stock}</p>
        <h4>Precio: $${productoEnCarrito.subtotal}</h4>
      `;
      container.append(div);
      total += productoEnCarrito.subtotal;
    }
  
    if (carrito.length > 0) {
      let divTotal = document.createElement("div");
      divTotal.className = "total-carrito";
      divTotal.innerHTML = `
      <h4>Valor Total: $${total}</h4>
    `;
      container.append(divTotal);
  
      let divBotonesCarrito = document.createElement("div");
      divBotonesCarrito.className = "btn-carrito";
      divBotonesCarrito.innerHTML = `
      <button class="finalizarCompra" id="btn-finalizarCompra">Finalizar la compra</button> <button class="eliminarCarrito" id="btn-eliminarCarrito">Vaciar Carrito</button>`
      container.append(divBotonesCarrito);
  
      let finalizarCompra = document.getElementById("btn-finalizarCompra");
      let eliminarCarrito = document.getElementById("btn-eliminarCarrito")
  
      finalizarCompra.addEventListener("click", () => {
        Swal.fire({
          position: 'center', icon: 'success', title: 'Compra realizada con Éxito', showConfirmButton: true, timer: 1000, color: 'rgb(66, 187, 96)', customClass: {
            confirmButton: 'btn-confirmacion',
          }
        }).then((result) => {
            if (result.isConfirmed) {
            localStorage.removeItem("carrito")
            location.reload()
            };
          })
      });
  
      eliminarCarrito.addEventListener("click", () => {
        Swal.fire({
          title: '', text: "¿Vaciar Carrito?", icon: 'warning', showCancelButton: true, confirmButtonColor: 'rgb(66, 187, 96)', cancelButtonColor: 'rgb(226, 194, 194)', confirmButtonText: 'Si'
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("carrito")
            Swal.fire({
              position: 'center', icon: 'success', title: 'Su carrito ha sido vaciado con exito.', timer: 1000, showConfirmButton: true,
              color: 'rgb(66, 187, 96)',
              customClass: {
                confirmButton: 'btn-confirmacion',
              }
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload()
              };
            })
          }
        })
      })
    } else {
      container.innerHTML = `
          <h3>Carrito de compras</h3>
          <p>Sin Productos añadidos</p>`;
    }
  }
  
  const iniciarPagina = () => {
    pagLibros.addEventListener("click", () => mostrarTodosLosProductos(listaDeProductos));
    filtroDeProductos(listaDeProductos);
    pagCarritoDeCompras.addEventListener("click", carritoCompras)
  
  }
  iniciarPagina();