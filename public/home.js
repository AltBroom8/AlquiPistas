let cambiaImagen = false;
let pagina = 1;
let total = 0;
let pagBtn;
let listado;
let totalPaginas;
let editBtn;
let deleteBtn;
let pantalla;
let elementoActual = 0;

//* INICIALIZO LOS ELEMENTOS DE LA PANTALLA
$(document).ready(async function() {
    $('.js-example-basic-single').select2();
    $('.select2-dropdown').css('min-width', '200px');
    
    let usuario; 
    listado = await setUsuarios(pagina);
    

    //FETCH PARA CONSULTAR LA BASE DE DATOS
    async function inicializa() {
        const url = '/inicializar';
        const opciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(url, opciones);
            if (!response.ok) {
                throw new Error('Hubo un problema al realizar la solicitud.');
            }
            const data = await response.json();
            console.log('Nombre de usuario:', data.username);
            return data;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    //METODO QUE RECIBE EL NOMBRE DEL USUARIO

    async function obtenerUsuario() {
        try {

            let inicio = await inicializa();
            

            usuario = inicio.username;

            console.log('Nombre de usuario:', usuario);
            
            return usuario;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    //CAMBIAMOS EL TEXTO TRAS RECIBIR LA INFORMACION
    /*obtenerUsuario().then(() => {
        const titulo = document.getElementById('titulo');
        titulo.innerText = `Bienvenido, ${usuario}`;
    })*/

    pagina = 1;
    /*AQUI EMPIEZA EL CODIGO REALMENTE*/
    total = await totalResultados()/12;
    console.log('Total de empleados:', total*12);
    console.log('Hay un total de '+ total + ' resultados');
    totalPaginas = Math.ceil(total / 1);
    console.log('Total de '+ totalPaginas)
    pantalla = document.getElementById("nuevaVentana");
    pagBtn = document.querySelectorAll(".pag");
    cancelaEliminar = document.getElementById("cancelarEliminar");
    aceptarEliminar = document.getElementById("aceptarEliminar");
    crearPaginador(totalPaginas,pagina);
    cambioElementos();
    agregarEventListeners();
    



    let select = document.getElementById("selectMenu");
    select.onchange = async () => {
        cambioElementos();
    }

    let busqueda = document.getElementById("buscarInput");
    busqueda.addEventListener("keyup",() => {
        console.log("entra");
        cambioElementos();
    });
    
    let nuevoUser = document.getElementById("addButton");
    
    nuevoUser.addEventListener("click",()=>{
        pantalla.style.display = "flex";
        pantalla.classList.add('aparece');
        nuevoFormulario()
    });

    async function deleteSocio(id) {
    
        datos = {
            id: id
        }
        try {
            const response = await fetch('/deleteSocio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
    
            if (!response.ok) {
                throw new Error('Error en la solicitud datos '+response);
            }
    
            await response;
            return;
        } catch (error) {
            console.error(error);
        }
    }
    aceptarEliminar.addEventListener("click",async () => {

        await deleteSocio(listado[elementoActual].id);
        const avisoElement = document.querySelector('.aviso');
        const cartel = avisoElement.querySelector('.avisoVentana');
        cartel.classList.add("sale");
        setTimeout(()=>{
            cartel.classList.remove("sale");
            cartel.classList.remove("entra");
            avisoElement.style.display = "none";
            location.reload();
        },500);
    
    })
    cancelaEliminar.addEventListener("click",()=>{
        const avisoElement = document.querySelector('.aviso');
        const cartel = avisoElement.querySelector('.avisoVentana');
        cartel.classList.add("sale");
        setTimeout(()=>{
            cartel.classList.remove("sale");
            cartel.classList.remove("entra");
            avisoElement.style.display = "none";
        },500);
        
    });
    window.addEventListener('popstate', function(event) {
        window.location.href = "/home";

    }, false);


});  
//* FUNCION PARA OBTENER UN SOCIO
async function getSocio(id){
    let mijson = {id : id};
    try {
        const response = await fetch('/getSocio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mijson)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud datos '+response);
        }

        const data = await response.json();
        return (data);
    } catch (error) {
        return false;
    }
}

//* FUNCION PARA ENVIAR UNA FOTO SEGUN UN ID, Y ALMACENAR EN EL SERVER
async function enviarArchivo(file, id) {
    console.log('el id es ' + id);
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('userId', id);

    try {
        const response = await fetch(`/uploadFile?id=${id}`, {
            method: 'POST',
            body: formData
        });

        
        if (!response.ok) {
            throw new Error('Error al subir el archivo');
        }

        const data = await response.text();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}


//*FUNCION PARA OBTENER EL NUMERO DE SOCIOS QUE APLICAN PARA UNA QUERY
async function totalResultados(){
    let textoBuscar = document.getElementById('buscarInput').value;
    let valorSeleccionado = document.getElementById('selectMenu').value;
    let campo;
    let modo;
    switch(valorSeleccionado){
        
        case "usuario":
            campo="username";
            modo="ASC";
            break;
        case "antiguo":
            campo="fAlta";
            modo="ASC";
            break;
        case "nuevo":
            campo="fAlta";
            modo="DESC";
            break;
        default:
            campo="nombre";
            modo="ASC";
            break;
    }
    let datos ={
        busqueda:textoBuscar,
        ordenar:campo,
        forma:modo
    }

    try {
        const response = await fetch('/cuantosSocios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud datos '+response);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return -1;
    }


}
//*CREA EL PAGINADOR SEGUN LOS RESULTADOS DE UNA QUERY
function crearPaginador(totalPaginas,paginaActual) {
    const numerosContainer = document.getElementById('numeros');
    // Limpiar cualquier contenido previo en el contenedor
    numerosContainer.innerHTML = '';

    // Calculamos cuántos botones vamos a mostrar (mínimo 1, máximo 5)
    const numBotones = Math.min(5, totalPaginas);
    if(totalPaginas<=5){
        for (let i = 1; i <= numBotones; i++) {
            const button = document.createElement('button');
            button.classList.add("pag");
            button.textContent = i;
            numerosContainer.appendChild(button);
            if(i===paginaActual){
                button.classList.add("actual")
            }else{
                button.classList.add("otro")
            }
        }
    }
    else{
        for (let i = 1; i <= 5; i++) {
            const button = document.createElement('button');
            button.classList.add("pag");
            button.textContent = i;
            numerosContainer.appendChild(button);
            if(paginaActual===1){
                if(i===1){
                    button.classList.add("actual")
                }else{
                    button.classList.add("otro")
                }
                if (i===5){
                    button.textContent = totalPaginas;
                }
            }else if(paginaActual===2){
                if(i===2){
                    button.classList.add("actual")
                }else{
                    button.classList.add("otro")
                }
                if (i===5){
                    button.textContent = totalPaginas;
                }
            }
            else if(paginaActual===(totalPaginas-1)){
                switch (i){
                    case 1:
                        button.classList.add("otro");
                        button.textContent = "1";
                        break;
                    case 2:
                        button.classList.add("otro");
                        button.textContent = paginaActual-2;
                        break;
                    case 3:
                        button.classList.add("otro");
                        button.textContent = paginaActual-1;
                        break;
                    case 4:
                        button.classList.add("actual");
                        button.textContent = paginaActual;
                        break;
                    
                    case 5:
                        button.classList.add("otro");
                        button.textContent = totalPaginas;
                        break;
                }
            }else if(paginaActual===totalPaginas){
                switch (i){
                    case 1:
                        button.classList.add("otro");
                        button.textContent = "1";
                        break;
                    case 2:
                        button.classList.add("otro");
                        button.textContent = paginaActual-3;
                        break;
                    case 3:
                        button.classList.add("otro");
                        button.textContent = paginaActual-2;
                        break;
                    case 4:
                        button.classList.add("otro");
                        button.textContent = paginaActual-1;
                        break;
                    case 5:
                        button.classList.add("actual");
                        button.textContent = totalPaginas;
                        break;
                }
            }else{
                switch (i){
                    case 1:
                        button.classList.add("otro");
                        button.textContent = "1";
                        break;
                    case 2:
                        button.classList.add("otro");
                        button.textContent = paginaActual-1;
                        break;
                    case 3:
                        button.classList.add("actual");
                        button.textContent = paginaActual;
                        break;
                    case 4:
                        button.classList.add("otro");
                        button.textContent = paginaActual+1;
                        break;
                    case 5:
                        button.classList.add("otro");
                        button.textContent = totalPaginas;
                        break;
                }
            }
        }
    }
    
}

//*ESTABLECE LOS USUARIOS PARA UNA PAGINA

async function setUsuarios(pagina){
    let textoBuscar = document.getElementById('buscarInput').value;
    let valorSeleccionado = document.getElementById('selectMenu').value;
    let campo;
    let modo;
    switch(valorSeleccionado){
        
        case "usuario":
            campo="username";
            modo="ASC";
            break;
        case "antiguo":
            campo="fAlta";
            modo="ASC";
            break;
        case "nuevo":
            campo="fAlta";
            modo="DESC";
            break;
        default:
            campo="nombre";
            modo="ASC";
            break;
    }
    let datos ={
        busqueda:textoBuscar,
        ordenar:campo,
        forma:modo,
        pagina:pagina,
    }

    try {
        const response = await fetch('/devuelveSocios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud datos '+response);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        return -1;
    }
}

//*RELLENA TODOS LOS USUARIOS EN EL FRONT
async function rellenaUsuario(listado){
    
    let general  = document.getElementById('listado');
    let divsUsuarios = document.querySelectorAll("div.usuario");

    var divsUsuariosAntes = document.querySelectorAll("div.usuario").length;
    console.log("Cantidad de divs con la clase 'usuario' antes de la eliminación:", divsUsuariosAntes);

    divsUsuarios.forEach(function(div) {
        div.parentNode.removeChild(div);
    });

    var divsUsuariosDespués = document.querySelectorAll("div.usuario").length;
    console.log("Cantidad de divs con la clase 'usuario' después de la eliminación:", divsUsuariosDespués);

    for (let usuario of listado){
        const divUsuario = document.createElement('div');
        divUsuario.classList.add('usuario');
        const divInfo = document.createElement('div');
        divInfo.classList.add('info');
        const divImagen = document.createElement('div');
        divImagen.classList.add('imagen');
        const img = document.createElement('img');
        await fetch(`imagen?id=${usuario.id}`)
        .then(response => {
            if (!response.ok) {
            throw new Error('La solicitud falló');
            }
            return response.blob();
        })
        .then(blob => {
            
            let imgUrl = URL.createObjectURL(blob);

            img.src = imgUrl;
        })
        .catch(error => console.error('Error:', error));;
        img.alt = `Imagen de ${usuario.username}`;
        divImagen.appendChild(img);
        const divDatos = document.createElement('div');
        divDatos.classList.add('datos');
        const h2Username = document.createElement('h2');
        h2Username.classList.add('socioUser');
        h2Username.textContent = usuario.username;
        const h4Nombre = document.createElement('h4');
        h4Nombre.classList.add('socioNombre');
        h4Nombre.textContent = usuario.nombre+ ' '+ usuario.apellidos;
        const h4Email = document.createElement('h4');
        h4Email.classList.add('socioMail');
        h4Email.textContent = usuario.email;
        divDatos.appendChild(h2Username);
        divDatos.appendChild(h4Nombre);
        divDatos.appendChild(h4Email);
        divInfo.appendChild(divImagen);
        divInfo.appendChild(divDatos);
        const divBotones = document.createElement('div');
        divBotones.classList.add('botones');
        const buttonTop = document.createElement('button');
        buttonTop.classList.add('top');
        const imgEditar = document.createElement('img');
        imgEditar.classList.add('editar');
        imgEditar.src = 'images/edit.png';
        imgEditar.alt = 'Botón editar';
        buttonTop.appendChild(imgEditar);
        const buttonBottom = document.createElement('button');
        buttonBottom.classList.add('bottom');
        const imgEliminar = document.createElement('img');
        imgEliminar.classList.add('eliminar');
        imgEliminar.src = 'images/Trash.png';
        imgEliminar.alt = 'Botón eliminar';
        buttonBottom.appendChild(imgEliminar);
        divBotones.appendChild(buttonTop);
        divBotones.appendChild(buttonBottom);
        divUsuario.appendChild(divInfo);
        divUsuario.appendChild(divBotones);
        
        general.appendChild(divUsuario);
        
    }
    editBtn = document.querySelectorAll(".top");
        for (let i = 0; i < editBtn.length; i++) {
            const edit = editBtn[i];
            edit.addEventListener("click", async ()=> {
                pantalla.style.display = "flex";
                pantalla.classList.add('aparece');
                let user = await getSocio(listado[i].id)
                await editarFormulario(user);
                cambioElementos();
            });
    }
    deleteBtn = document.querySelectorAll(".bottom");
    for (let i = 0; i < deleteBtn.length; i++) {
        const del = deleteBtn[i];
        del.addEventListener("click", async ()=> {
            console.log("Has hecho clic en el botón " + (i));
            const avisoElement = document.querySelector('.aviso');
            avisoElement.style.display = "flex";
            const cartel = avisoElement.querySelector('.avisoVentana');
            const txt = document.getElementById('prompt');
            txt.innerText = `¿Estás seguro de eliminar a ${listado[i].username} ?`
            cartel.classList.add("entra");
            elementoActual = i;
        });
    }

}

//*AGREGA EVENT LISTENER DE LOS BOTONES DEL PAGINADOR
async function agregarEventListeners() {
    // Eliminamos los event listeners previos del contenedor de los botones de paginación
    $('#numeros').off('click', '.pag');

    // Volvemos a agregar el event listener al contenedor de los botones de paginación
    $('#numeros').on('click', '.pag', async function() {
        console.log('entra');
        const texto = $(this).text();
        pagina = parseInt(texto);
        
        console.log(texto);
        crearPaginador(totalPaginas, pagina);
        await cambioElementos();
        console.log(pagina);
    });
}

//*METODO QUE MODIFICA LOS USUARIOS QUE SE VEN, DESPUES DE UN INSERT O UPDATE

async function cambioElementos() {
    
    total = await totalResultados() / 12;
    totalPaginas = Math.ceil(total / 1);
    if(pagina>totalPaginas){
        pagina = 1;
    }
    listado = await setUsuarios(pagina);
    crearPaginador(totalPaginas, pagina);
    await rellenaUsuario(listado);
}

//*METODO QUE DEVUELVE SI UN SOCIO EXISTE SEGUN SU ID
async function existe(id){
    const datos = {id: id};
    console.log("id es "+id)
    try {
        const response = await fetch('/existeSocio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud datos '+response);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        return false;
    }
}

//*INSERTAR UN SOCIO EN LA BBDD
async function insertaSocio(username, nombre, apellidos, direccion,poblacion,cp,fnac,email,iban,
socioOpcion,nTutor,nSocio,fAlta,fBaja)
{
    console.log("entra");
    let mijson = {
        username: username,
        nombre: nombre,
        apellidos: apellidos,
        direccion: direccion,
        poblacion: poblacion,
        cp: cp,
        fechaNacimiento: fnac,
        email: email,
        iban: iban,
        esSocio: socioOpcion,
        tutorNum: nTutor,
        socioNum: nSocio,
        fechaAlta: fAlta,
        fechaBaja: fBaja
    }

    try {
        const response = await fetch('/insertSocio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mijson)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud datos '+response);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        return false;
    }

}


async function getUltimo(){
    try {
        const response = await fetch('/idMasAlto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud datos '+response);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        return false;
    }
}
//*PANTALLA PARA CREAR UN NUEVO USUARIO
async function nuevoFormulario(){
    console.log("HACIENDO UN NUEVO INSERT")
    cambiaImagen = false;
    let cerrar = document.getElementById("cierra");
    let img = document.getElementById("fondoBusqueda");
    let baja = document.getElementById('bajaBtn');
    let alta = document.getElementById('altaBtn');
    let selectHijo = document.getElementById('selectHijo');
    let ir = document.getElementById('ir'); 
    let usernameForm = document.getElementById('usernameForm');
    let nombreForm = document.getElementById('nombreForm');
    let apellidosForm = document.getElementById('apellidosForm');
    let dirForm = document.getElementById('dirForm');
    let poblacionForm = document.getElementById('poblacionForm');
    let cpForm = document.getElementById('cpForm');
    let fnacForm = document.getElementById('fnacForm');
    let emailForm = document.getElementById('emailForm');
    let ibanForm = document.getElementById('ibanForm');
    let r1 = document.getElementById('r1');
    let r2 = document.getElementById('r2');
    let ntutorForm = document.getElementById('ntutorForm');
    let nsocioForm = document.getElementById('nsocioForm');
    let fAltaForm = document.getElementById('faltaForm');
    let fBajaForm = document.getElementById('fbajaForm');
    let rechazarBtn = document.getElementById('rechazar');
    let aceptarBtn = document.getElementById('aceptar');
    let btnImagen = document.getElementById("btnImagen");

    let emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|aol|icloud|live|msn|mail|yandex|protonmail|inbox)\.(com|es|net|org|info|gov|edu)$/;
    
    selectHijo.innerHTML = '';
    const op = document.createElement('option');
    op.value = -1; 
    op.innerHTML = 'Vacío &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'; 
    selectHijo.appendChild(op);
    ir.disabled = true;
    nsocioForm.disabled = false;
    ntutorForm.disabled = false;
    fAltaForm.disabled = true;
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0'); 
    let day = String(now.getDate()).padStart(2, '0');
    fAltaForm.value = `${year}-${month}-${day}`;
    fBajaForm.disabled = true;
    function desactiva(button) {
        button.addEventListener('mouseover', () => {
            if (button.disabled) {
                button.style.cursor = 'default';
            } else {
                button.style.cursor = 'pointer';
            }
        });
    }
    function cierraVentana(){
        
        pantalla.classList.add('desaparece');
        pantalla.addEventListener('animationend', function() {
            pantalla.style.display = "none";
            pantalla.classList.remove("aparece");
            pantalla.classList.remove("desaparece");
        }, { once: true });
        vacia();
    }
    img.src = "images/profile.jpg"
    desactiva(ir);
    desactiva(alta);
    desactiva(baja);
    alta.style.backgroundColor = '#9c9c9c';
    baja.style.backgroundColor = '#9c9c9c';
    ir.addEventListener('mouseout', () => {
        ir.style.cursor = 'default';
    });
    selectHijo.disabled = true;
    nsocioForm.disabled = true;
    nsocioForm.value = (await getUltimo())+1;

    rechazarBtn.addEventListener('click', cierraVentana);
    cerrar.addEventListener('click', cierraVentana);
    function vacia(){
        setTimeout(()=>{
            r1.checked = false;
            r2.checked = false;
            img.src = "images/profile.jpg"
            cambiaImagen = false;
            let inputs = [usernameForm,nombreForm,apellidosForm,dirForm,
                poblacionForm,cpForm,fnacForm,emailForm,ibanForm,ntutorForm
            ]
            let aviso = document.getElementById("aviso");
            aviso.textContent = "Rellena todos los campos y botones disponibles.";
            aviso.style.display = "none";
            for (campo of inputs){
                campo.value ="";
                campo.style.backgroundColor = "white";

            }
            emailForm.placeholder = "";


        },500)
    }
    
    btnImagen.addEventListener("mouseover",function(){
        let fondo = document.getElementById("fondoBusqueda");
        let img = document.getElementById("folder");
        fondo.style.opacity = "0.5";
        
        img.style.opacity = "1";
    });
    
    btnImagen.addEventListener("mouseout",function(){
        let fondo = document.getElementById("fondoBusqueda");
        let img = document.getElementById("folder");
        fondo.style.opacity = "1";
        
        img.style.opacity = "0";
    });

    btnImagen.addEventListener("click", function(){
        let nuevoBtn = document.createElement("input");
        nuevoBtn.type = "file";
        nuevoBtn.accept = "image/jpeg";
        nuevoBtn.style.opacity = "0";
        nuevoBtn.click();
        nuevoBtn.addEventListener("change",async (e)=>{
            const file = e.target.files[0];
            console.log(file);
            const id = parseInt(nsocioForm.value,10);
            await enviarArchivo(file,id);
            let img = document.getElementById("fondoBusqueda");
            await fetch(`imagen?id=${id}`)
            .then(response => {
                if (!response.ok) {
                throw new Error('La solicitud falló');
                }
                return response.blob();
            })
            .then(blob => {
                
                let imgUrl = URL.createObjectURL(blob);
                cambiaImagen = true;
                img.src = imgUrl;
            })
            .catch(error => console.error('Error:', error));
        })
                
    });

    aceptarBtn.addEventListener('click',async() => {

        let aviso = document.getElementById("aviso");
        aviso.textContent = "Rellena todos los campos y botones disponibles.";
        let inputs = [usernameForm,nombreForm,apellidosForm,dirForm,
            poblacionForm,cpForm,fnacForm,emailForm,ibanForm
        ]
        for (campo of inputs){
            if (campo.value === "" || (campo === cpForm &&campo.value.length != 5)){
                if(campo === cpForm){
                    campo.value = "";
                    campo.placeholder = "Introduce 5 numeros";
                }
                campo.style.backgroundColor = "#ffbfbf";
                aviso.style.display = "block";
                return;
            }else{
                campo.style.backgroundColor = "white";
                aviso.style.display = "none";
                let choice = document.getElementById("choice");
                choice.style.border = "none";
            }

            
        }
        if (!r1.checked && !r2.checked){
            let choice = document.getElementById("choice");
            choice.style.border = "solid #ffbfbf 2px";
            aviso.style.display = "block";
            return
        }else if(ntutorForm.value!=""){
            let num = ntutorForm.value;
            num = parseInt(num, 10);
            let valido = await existe(num);
            if(!valido){
                aviso.textContent = "Numero de tutor incorrecto.";
                aviso.style.display = "block";
                return;
            }
        }
        if(!emailRegex.test(emailForm.value)){
            emailForm.value = "";
            emailForm.placeholder = "Introduce una dirección correcta";
            return;
        }
        
        if(!cambiaImagen){
            aviso.textContent = "Elige una imagen para tu usuario.";
            aviso.style.display = "block";
            return;
        }
        let cp = parseInt(cpForm.value,10);
        let socioNum = parseInt(nsocioForm.value,10);
        let tutorNum = (ntutorForm.value==="")?null: parseInt(ntutorForm.value,10);
        let esSocio = (r1.checked)?true:false;
        console.log(fAltaForm.value);
        await insertaSocio(usernameForm.value,nombreForm.value,apellidosForm.value,
            dirForm.value,poblacionForm.value,cp,new Date(fnacForm.value),emailForm.value,
            ibanForm.value,esSocio,tutorNum,socioNum,new Date(fAltaForm.value),null); 
        pantalla.classList.add('desaparece');
        pantalla.addEventListener('animationend', function() {
            pantalla.style.display = "none";
            pantalla.classList.remove("aparece");
            pantalla.classList.remove("desaparece");
        }, { once: true });
        vacia();
        setTimeout(()=>{
            location.reload();
        },500);
    })
}


//*METODO PARA OBTENER LOS HIJOS DE UN SOCIO SEGUN SU ID
async function getHijos(id){
    let mijson = {id : id};

    try {
        const response = await fetch('/getHijos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mijson)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud datos '+response);
        }

        const data = await response.json();
        console.log(data);
        return (data);
    } catch (error) {
        return false;
    }
}
//*METODO PARA HACER UN UPDATE EN LA TABLA SOCIO
async function updateSocio(id,username,nombre,apellidos,direccion,poblacion,cp,
fnac,email,IBAN,socio,alta,fAlta,fBaja) {

    datos = {
        id: id,
        username: username,
        nombre: nombre,
        apellidos:apellidos,
        direccion: direccion,
        poblacion: poblacion,
        cp:cp,
        fnac:fnac,
        email:email,
        iban:IBAN,
        socio:socio,
        alta:alta,
        fAlta:fAlta,
        fBaja:fBaja,
    }

    try {
        const response = await fetch('/updateSocio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud datos '+response);
        }

        await response;
        return;
    } catch (error) {
        console.error(error);
    }



}

//*PANEL PARA EDITAR UN FORMULARIO
async function editarFormulario(usuario){
    console.log("Imprimimos usuario");
    console.log(usuario);
    let altaBoolean = false;
    let cerrar = document.getElementById("cierra");
    let img = document.getElementById("fondoBusqueda");
    let baja = document.getElementById('bajaBtn');
    let alta = document.getElementById('altaBtn');
    let selectHijo = document.getElementById('selectHijo');
    let ir = document.getElementById('ir'); 
    let usernameForm = document.getElementById('usernameForm');
    let nombreForm = document.getElementById('nombreForm');
    let apellidosForm = document.getElementById('apellidosForm');
    let dirForm = document.getElementById('dirForm');
    let poblacionForm = document.getElementById('poblacionForm');
    let cpForm = document.getElementById('cpForm');
    let fnacForm = document.getElementById('fnacForm');
    let emailForm = document.getElementById('emailForm');
    let ibanForm = document.getElementById('ibanForm');
    let r1 = document.getElementById('r1');
    let r2 = document.getElementById('r2');
    let ntutorForm = document.getElementById('ntutorForm');
    let nsocioForm = document.getElementById('nsocioForm');
    let fAltaForm = document.getElementById('faltaForm');
    let fBajaForm = document.getElementById('fbajaForm');
    let rechazarBtn = document.getElementById('rechazar');
    let aceptarBtn = document.getElementById('aceptar');
    let btnImagen = document.getElementById("btnImagen");
    let emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|aol|icloud|live|msn|mail|yandex|protonmail|inbox)\.(com|es|net|org|info|gov|edu)$/;

    await fetch(`imagen?id=${usuario.id}`)
            .then(response => {
                if (!response.ok) {
                throw new Error('La solicitud falló');
                }
                return response.blob();
            })
            .then(blob => {
                
                let imgUrl = URL.createObjectURL(blob);
                cambiaImagen = true;
                img.src = imgUrl;
            })
            .catch(error => console.error('Error:', error));
    
    nsocioForm.disabled = true;
    ntutorForm.disabled = true;
    ntutorForm.style.backgroundColor="transparent";
    fAltaForm.disabled = true;
    fBajaForm.disabled = true;
    function desactiva(button) {
        button.addEventListener('mouseover', () => {
            if (button.disabled) {
                button.style.cursor = 'default';
            } else {
                button.style.cursor = 'pointer';
            }
        });
    }
    function setDateInput(fecha,campo) {
        // Create a new Date object from the ISO 8601 string
        const date = new Date(fecha);

         // Get the year, month, and day components
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
        const day = String(date.getUTCDate()).padStart(2, '0');

         // Format the date to 'YYYY-MM-DD'
        const formattedDate = `${year}-${month}-${day}`;
        campo.value = formattedDate;
    }

    function bloquearCampos(opcion){
        let fondo = (opcion)?"transparent":"white";
        let inputs = [usernameForm,nombreForm,apellidosForm,dirForm,poblacionForm,cpForm,fnacForm,
            emailForm,ibanForm,r1,r2
        ]
        for(input of inputs){
            input.disabled = opcion;
            input.style.backgroundColor = fondo;
        }
    }


    if(usuario.alta===1){
        alta.disabled = true;
        baja.disabled = false;
        alta.style.backgroundColor = '#9c9c9c';
        baja.style.backgroundColor = '#d87f7f';
        desactiva(alta)
        desactiva(baja)
        altaBoolean = true;
        bloquearCampos(false);
    }else{
        baja.disabled = true;
        alta.disabled = false;
        baja.style.backgroundColor = '#9c9c9c';
        alta.style.backgroundColor = '#7fd898';
        desactiva(alta)
        desactiva(baja)
        altaBoolean = false;
        bloquearCampos(true);
    }

    alta.addEventListener("click",()=>{
        altaBoolean = true;
        alta.disabled = true;
        alta.style.backgroundColor = '#9c9c9c';
        desactiva(alta);
        aviso.textContent = "Pulse aceptar para procesar el alta.";
        aviso.style.display = "block";
        aviso.style.color ="#4d82ff";
        bloquearCampos(false);
        setDateInput(Date.now(),fAltaForm);
        fBajaForm.value = null;
    })
    baja.addEventListener("click",()=>{
        altaBoolean = false;
        baja.disabled = true;
        baja.style.backgroundColor = '#9c9c9c';
        desactiva(baja);
        let aviso = document.getElementById("aviso");
        aviso.textContent = "Pulse aceptar para procesar la baja.";
        aviso.style.display = "block";
        aviso.style.color ="#4d82ff";
        bloquearCampos(true);
        setDateInput(Date.now(),fBajaForm);
    });

    function vacia(){
        setTimeout(()=>{
            r1.checked = false;
            r2.checked = false;
            img.src = "images/profile.jpg"
            cambiaImagen = false;
            let inputs = [usernameForm,nombreForm,apellidosForm,dirForm,
                poblacionForm,cpForm,fnacForm,emailForm,ibanForm,ntutorForm
            ]
            let aviso = document.getElementById("aviso");
            aviso.textContent = "Rellena todos los campos y botones disponibles.";
            aviso.style.display = "none";
            for (campo of inputs){
                campo.value ="";
                campo.style.backgroundColor = "white";

            }
            emailForm.placeholder = "";
        },500)
    }


    function cierraVentana(){
        pantalla.classList.add('desaparece');
        pantalla.addEventListener('animationend', function() {
            pantalla.style.display = "none";
            pantalla.classList.remove("aparece");
            pantalla.classList.remove("desaparece");
        }, { once: true });
        vacia();
    }

    

    rechazarBtn.addEventListener('click', cierraVentana);
    cerrar.addEventListener('click', cierraVentana);

    usernameForm.value = usuario.username;
    nombreForm.value = usuario.nombre;
    apellidosForm.value = usuario.apellidos;
    dirForm.value = usuario.direccion;
    poblacionForm.value = usuario.poblacion;
    cpForm.value = usuario.codigoPostal;
    setDateInput(usuario.fNac,fnacForm);
    emailForm.value = usuario.email;
    ibanForm.value = usuario.iban;


    if (usuario.socio===1){
        r1.checked = true;
    }else{
        r2.checked = true;
    }
    if(usuario.idTutor===null){
        ntutorForm.value="";
    }else{
        ntutorForm.value=usuario.idTutor;
    }
    nsocioForm.value = usuario.id;
    if(usuario.fAlta!=null){
        setDateInput(usuario.fAlta,fAltaForm);
    }
    if(usuario.fBaja!=null){
    setDateInput(usuario.fBaja,fBajaForm);
    }
    selectHijo.disabled = false;
    ir.disabled = false;
    let hijos = await getHijos(usuario.id);
    
    selectHijo.innerHTML = '';
    const op = document.createElement('option');
    op.value = -1; 
    op.innerHTML = 'Vacío &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'; 
    selectHijo.appendChild(op);
    if (hijos!=null){
        for(hijo of hijos){
            console.log("entra")
            const option = document.createElement('option');
            option.value = hijo.id; 
            option.textContent = hijo.nombre + " "+ hijo.apellidos; 
            selectHijo.appendChild(option);
        }
    }
    

    ir.addEventListener("click",async () =>{
        let id = selectHijo.value;
        if(id!=-1){
            let user  = await getSocio(id);
            await editarFormulario(user);
            return;
        }
        
    })

    btnImagen.addEventListener("mouseover",function(){
        let fondo = document.getElementById("fondoBusqueda");
        let img = document.getElementById("folder");
        fondo.style.opacity = "0.5";
        
        img.style.opacity = "1";
    });
    
    btnImagen.addEventListener("mouseout",function(){
        let fondo = document.getElementById("fondoBusqueda");
        let img = document.getElementById("folder");
        fondo.style.opacity = "1";
        
        img.style.opacity = "0";
    });
    //* AÑADIR IMAGEN TEMPORAL
    btnImagen.addEventListener("click", function(){
        let nuevoBtn = document.createElement("input");
        nuevoBtn.type = "file";
        nuevoBtn.accept = "image/jpeg";
        nuevoBtn.style.opacity = "0";
        nuevoBtn.click();
        nuevoBtn.addEventListener("change",async (e)=>{
            const file = e.target.files[0];
            console.log(file);
            const id = parseInt(nsocioForm.value,10);
            await enviarArchivo(file,id);
            img = document.getElementById("fondoBusqueda");
            await fetch(`imagen?id=${id}`)
            .then(response => {
                if (!response.ok) {
                throw new Error('La solicitud falló');
                }
                return response.blob();
            })
            .then(blob => {
                
                let imgUrl = URL.createObjectURL(blob);
                cambiaImagen = true;
                img.src = imgUrl;
            })
            .catch(error => console.error('Error:', error));
        })
                
    });

    //TODO AÑADIR LISTENER DEL BOTON ACEPTAR
    aceptarBtn.addEventListener('click',async ()=>{
        if(!altaBoolean){
            
            let id = usuario.id;
            let username = usuario.username;
            let nombre = usuario.nombre;
            let apellidos = usuario.apellidos;
            let direccion = usuario.direccion;
            let poblacion = usuario.poblacion;
            let cp = usuario.codigoPostal;
            let fNac = usuario.fNac;
            let email = usuario.email;
            let IBAN = usuario.iban;
            let socio = (usuario.socio===1)?true:false;
            let fAlta = usuario.fAlta;
            let fBaja = new Date(fBajaForm.value);
            await updateSocio(id,username,nombre,apellidos,direccion,poblacion,cp,
                fNac,email,IBAN,socio,altaBoolean,fAlta,fBaja);
            pantalla.classList.add('desaparece');
            pantalla.addEventListener('animationend', function() {
                pantalla.style.display = "none";
                pantalla.classList.remove("aparece");
                pantalla.classList.remove("desaparece");
            }, { once: true });
            vacia();
            setTimeout(()=>{
                location.reload();
            },500);
        }
        let inputs = [usernameForm,nombreForm,apellidosForm,dirForm,
            poblacionForm,cpForm,fnacForm,emailForm,ibanForm
        ]
        for (campo of inputs){
            if (campo.value === "" || (campo === cpForm &&campo.value.length != 5)){
                if(campo === cpForm){
                    campo.value = "";
                    campo.placeholder = "Introduce 5 numeros";
                }
                campo.style.backgroundColor = "#ffbfbf";
                aviso.style.display = "block";
                return;
            }else{
                campo.style.backgroundColor = "white";
                aviso.style.display = "none";
                let choice = document.getElementById("choice");
                choice.style.border = "none";
            }
            
        }
        if (!r1.checked && !r2.checked){
            let choice = document.getElementById("choice");
            choice.style.border = "solid #ffbfbf 2px";
            aviso.style.display = "block";
            return
        }

        if(!emailRegex.test(emailForm.value)){
            emailForm.value = "";
            emailForm.placeholder = "Introduce una dirección correcta";
            return;
        }

        let id = usuario.id;
        let username = usernameForm.value;
        let nombre = nombreForm.value;
        let apellidos = apellidosForm.value;
        let direccion = dirForm.value;
        let poblacion = poblacionForm.value;
        let cp = parseInt(cpForm.value,10);
        let fNac = fnacForm.value;
        let email = emailForm.value;
        let IBAN = ibanForm.value;
        let socio = (usuario.socio===1)?true:false;
        let fAlta =  new Date(fAltaForm.value);
        let fBaja = null;
        
        await updateSocio(id,username,nombre,apellidos,direccion,poblacion,cp,
            fNac,email,IBAN,socio,altaBoolean,fAlta,fBaja);
        await cambioElementos();
        pantalla.classList.add('desaparece');
        pantalla.addEventListener('animationend', function() {
            pantalla.style.display = "none";
            pantalla.classList.remove("aparece");
            pantalla.classList.remove("desaparece");
        }, { once: true });
        vacia();
        setTimeout(()=>{
            location.reload();
        },500);
    });

}



