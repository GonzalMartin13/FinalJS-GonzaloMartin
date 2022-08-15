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


let registroNC = document.getElementById("BotonNC");
registroNC.onclick = () => {
    let nombreNC = document.getElementById("NombreNC");
    let cuentaNC = document.getElementById("CuentaNC");
    let contrasenaNC = document.getElementById("ContrasenaNC");
    const nuevasCuentas = _.concat(cuentasIngreso, {nombre: nombreNC.value, cuenta: cuentaNC.value, contraseña: contrasenaNC.value});
    localStorage.setItem("Cuentas", JSON.stringify(nuevasCuentas));    
}; 