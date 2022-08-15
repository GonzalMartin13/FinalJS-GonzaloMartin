const cuentasIngreso = [ {
    nombre: "Gonzalo Martin",
    cuenta: "ItsGonzal13",
    contraseña: "123456"
    },
{   nombre: "Lionel Messi ",
    cuenta: "Lio10",
    contraseña: "traemelacopa"
    }
];
localStorage.setItem("Cuentas", JSON.stringify(cuentasIngreso));
const chango = [];

const changuitoHTML = document.getElementById("chango");
const botonCliente = document.getElementById("BotonCliente");


function validarCuenta(Login){
    let cuentaIngreso = Login.value;
    let cuentasGuardadas = JSON.parse(localStorage.getItem("Cuentas")) || [];
    const verificacion = _.find(cuentasGuardadas, {'cuenta': cuentaIngreso} );
    if (verificacion === undefined){
        return false;
    } else if (cuentaIngreso !== verificacion.cuenta) {
        return false;
    } else {
        return true;
    };
}
function validarContraseña(pass){
    let contraseñaIngreso = pass.value;
    let cuentasGuardadas = JSON.parse(localStorage.getItem("Cuentas")) || [];
    const verificacion = _.find(cuentasGuardadas, {'contraseña': contraseñaIngreso} );
    if (verificacion === undefined){
        return false;
    } else if (contraseñaIngreso !== verificacion.contraseña) {
        return false;
    } else {
        return true;
    };
}


botonCliente.onclick = () => { 
    let usuario = document.getElementById("email");
    let password = document.getElementById("pass");
    let cuenta = validarCuenta(usuario);
    let contraseña = validarContraseña(password);
    console.log(cuenta);
    console.log(contraseña);
    if (cuenta && contraseña) {
        let FondoBody = document.getElementById("Body");
        FondoBody.className = "fondoBodyCliente container-fluid row justify-content-center";
        let botonCarro = document.getElementById("BotonChango");
        botonCarro.className = "btn btn-secondary";
        const divCartas = document.getElementById("CartasProds");
        divCartas.className = "BienvenidaCartas text-center row justify-content-center align-items-center";
        divCartas.style = "border: black 5px solid";
        renderProds(divCartas);
    } else {
        Swal.fire(
            'Datos Inconrrectos',
            'Verifica los datos ingresados',
            'error'
        )
    }
    const verificacion = _.find(cuentasIngreso, {'cuenta': usuario.value} );
    renderSaludo(verificacion);
}; 

const renderProds = (target) => {
    fetch(`./Json/productos.json`)
  .then ((response)=> response.json())
  .then((datos)=>{
    
    let acumulador = '';
    datos.map(producto => {
        acumulador += `
        <div class=" col-4 m-2" style="width: 18rem" ;>
            <div class="card-body m-4">
                <h5 class=" m-2 card-title">${producto.nombre}</h5>
                <h6 class="card-subtitle mb-3 text-muted">${producto.parrafo}</h6>
                <img src=${producto.imgURL} width="100" height="175" class="card-img-top" alt="${producto.nombre}">
                <p class="mt-2 card-text">${producto.descripcion} </br> Precio: $${producto.precio}.</p>
                <button ref=${producto.codigo} class="boton_venta BP btn btn-secondary my-2 col-md-3" id=${`botonCarta` + producto.nombre} > Agregar al carrito</button>
            </div>
        </div>   
        `
    })

    target.innerHTML = acumulador;
    const botonesCompra = document.querySelectorAll(".BP");
    botonesCompra.forEach(button => button.addEventListener("click", handleClick));    

  });  
}  

const handleClick = (event) => {
    const codigo = event.target.getAttribute("ref");
    fetch(`./Json/productos.json`)
    .then ((response)=> response.json())
    .then((datos)=>{
        const product = datos.find(linea => linea.codigo === codigo);
        Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: "Agregaste un producto al carrito",
            showConfirmButton: false,
            timer: 1000
        })
    
        if (chango.some(el => el.codigo === product.codigo)) {
            const posicionArray = chango.findIndex(el => el.codigo === product.codigo)
            chango[posicionArray].cantidad = chango[posicionArray].cantidad + 1;
        } else {
            chango.push({
                codigo : product.codigo,
                nombre: product.nombre,
                precio: product.precio,
                cantidad: 1,
                imgURL: product.imgURL,
            })
        }
        guardarCarroSS(chango);
    
        let changoSS = recuperarCarroSS();
        renderChango(changoSS, changuitoHTML);
        console.log(changoSS);
    });  
}

const renderChango = (lineas, target) => {
    let acumulador = '';
    lineas.map(producto => {
        acumulador += `
        <div class=" col-4" style="width: 18rem" ;>
            <div class="card-body">
                <h5 class=" m-2 card-title">${producto.nombre}</h5>
                <img src=${producto.imgURL} width="100" height="175" class="card-img-top" alt="${producto.nombre}">
                <p class="mt-2 card-text"> Cantidad selecionada: ${producto.cantidad} </br> Precio: $${producto.precio} </br> Precio Total: $${producto.precio * producto.cantidad}.</p>
                <div class="row justify-content-around">
                    <button ref=${producto.codigo} class="boton_venta BCA btn btn-secondary my-2 col-md-3" id="botonCarroAgregar" onclick= eliminarProducto("${producto.codigo}",0)> Agregar</button>
                    <button ref=${producto.codigo} class="boton_venta BCQ btn btn-secondary my-2 col-md-3" id="botonCarroQuitar" onclick= eliminarProducto("${producto.codigo}",1)> Quitar</button>
                </div>
            </div>
        </div>   
        `
    })

    target.innerHTML = acumulador;   

}

function eliminarProducto(id, condicion){
    let productoCarrito = recuperarCarroSS();
    let posicionEliminar = productoCarrito.findIndex(x => x.codigo == id);
   if (condicion == 1 ){

        productoCarrito[posicionEliminar].cantidad -=1;
        if (productoCarrito[posicionEliminar].cantidad == 0){
            productoCarrito.splice(posicionEliminar,1);
        }
        guardarCarroSS(productoCarrito);
        let changoSS = recuperarCarroSS();
       
    renderChango(changoSS, changuitoHTML);
        
  } else {
    productoCarrito[posicionEliminar].cantidad +=1;
    guardarCarroSS(productoCarrito);
    let changoSS = recuperarCarroSS();
    renderChango(changoSS, changuitoHTML);
  }
} 
function renderSaludo (cliente){
    let cuadrosaludo = document.getElementById("CuadroCentral");
    cuadrosaludo.innerHTML = `<h2> Bienvenido de nuevo ${cliente.nombre} </h2>`;
    cuadrosaludo.className = "mb-1 Bienvenida text-center";
}

function guardarCarroSS(carro) {
    sessionStorage.setItem("CarritoDeCompras", JSON.stringify(carro));
}

function recuperarCarroSS() {
    return JSON.parse(sessionStorage.getItem("CarritoDeCompras")) || [];
}

function pagoCarrito () {
    changuitoHTML.innerHTML = 
    `<form>
        <div class="mb-3">
            <label for="name" class="form-label">Nombre y Apellido</label>
            <input type="text" class="form-control" id="input-form">
        </div>
        <div class="mb-3">
            <label for="mail" class="form-label">Ingresa tu mail</label>
            <input type="mail" class="form-control" id="input-form" aria-describedby="emailHelp"> 
        </div>    
        <div class="mb-3">
            <label for="name" class="form-label">Telefono</label>
            <input type="number" class="form-control" id="input-form">
        </div>
        <div class="mb-3">
            <label for="name" class="form-label">Direccion</label>
            <input type="text" class="form-control" id="input-form">
        </div>
        <div class="mb-3">
            <label for="name" class="form-label">Ciudad</label>
            <input type="text" class="form-control" id="input-form">
        </div>
    </form>
    `;
    let botonPago= document.getElementById("pagarCarrito");
    botonPago.type= "submit";
}
















