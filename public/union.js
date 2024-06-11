let totalPag = 7;
let pagActual = 1;
let listadoEscuelas;
let escuelas = [];

async function eliminaUser(idUser,idEscuela){
    let miJson = {idUser:idUser,
        idEscuela:idEscuela}
        try {
            const response = await fetch('/sacarUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(miJson)
            });
    
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }
    
            await response.json();
            return;
        } catch (error) {
            console.error('Error al obtener las escuelas:', error);
            throw error;
        }
}
async function getEscuelas(pag) {
    let miJson = {pag:pag}
    try {
        const response = await fetch('/getEscuelasPag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(miJson)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las escuelas:', error);
        throw error;
    }
}

async function totalEscuelas() {
    
    try {
        const response = await fetch('/totalEscuelas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data[0]);
        return data[0].cantidad;
    } catch (error) {
        console.error('Error al obtener las escuelas:', error);
        throw error;
    }
}

async function getNombres(id) {
    let miJson = {id:id}
    try {
        const response = await fetch('/nombresPorEscuela', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(miJson)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("data:");
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error al obtener las escuelas:', error);
        throw error;
    }
}

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
async function agregarEventListeners() {
    // Eliminamos los event listeners previos del contenedor de los botones de paginación
    $('#numeros').off('click', '.pag');

    // Volvemos a agregar el event listener al contenedor de los botones de paginación
    $('#numeros').on('click', '.pag', async function() {
        console.log('entra');
        const texto = $(this).text();
        pagActual = parseInt(texto);
        console.log(texto);
        crearPaginador(totalPag, pagActual);
        listadoEscuelas = await getEscuelas(pagActual); 
        console.log(listadoEscuelas);
        await rellenaEscuelas();
        crearListado();
    });
}

async function rellenaEscuelas(){
    escuelas=[];
    for(escuela of listadoEscuelas){
        let data = await getNombres(escuela.id);
        let nombres = [];
        let idUser = [];
        if (data === null){
            nombres = [];
            idUser = [];
        }else{
            for (dato of data){
                let nombre = dato.nombre + " " + dato.apellidos;
                nombres.push(nombre);
                let id = dato.id;
                idUser.push(id);
            }
        }
        
        
        let json = {nombre:escuela.nombre,
            usuarios:nombres,
            idEscuela:escuela.id,
            idUsuario:idUser
        }
        escuelas.push(json);
    }
}

function crearListado() {
    const listado = document.getElementById('listado');
    listado.innerHTML ='';
    escuelas.forEach(escuela => {
        const divEscuela = document.createElement('div');
        divEscuela.classList.add('elemento');
        
        const tituloTarjeta = document.createElement('div');
        tituloTarjeta.classList.add('tituloTarjeta');
        const h3Titulo = document.createElement('h3');
        const uTitulo = document.createElement('u');
        uTitulo.textContent = escuela.nombre;
        h3Titulo.appendChild(uTitulo);
        tituloTarjeta.appendChild(h3Titulo);
        
        divEscuela.appendChild(tituloTarjeta);
        
        for (let i = 0; i < escuela.usuarios.length; i++) {
            const usuario = escuela.usuarios[i];
        
            const divUsuario = document.createElement('div');
            divUsuario.classList.add('nombres');
        
            const h3Usuario = document.createElement('h3');
            h3Usuario.textContent = usuario;
        
            const buttonQuitar = document.createElement('button');
            buttonQuitar.classList.add('quitar'); // Cambiado de id a class
            const imgQuitar = document.createElement('img');
            imgQuitar.src = 'images/close_24dp_FILL0_wght400_GRAD0_opsz24.svg';
            imgQuitar.alt = 'Quitar usuario';
            buttonQuitar.appendChild(imgQuitar);
        
            buttonQuitar.addEventListener('click', async () => {
                console.log('La escuela es:', escuela.idEscuela);
                console.log('El índice del usuario en el array es:', escuela.idUsuario[i]);
                await eliminaUser(escuela.idUsuario[i],escuela.idEscuela)
                location.reload();
            });
        
            divUsuario.appendChild(h3Usuario);
            divUsuario.appendChild(buttonQuitar);
        
            divEscuela.appendChild(divUsuario);
        }
        
        listado.appendChild(divEscuela);
    });
}
async function inicializar(){
    let num = await totalEscuelas();
    totalPag = (num%5>0)?Math.ceil(num / 5):num/5;
    console.log('num es '+num);
    crearPaginador(totalPag,pagActual);
    await agregarEventListeners();
    console.log("hola");
    listadoEscuelas = await getEscuelas(pagActual); 
    await rellenaEscuelas();
    console.log("escuelas es:")
    console.log(escuelas)
    crearListado();
    
}

inicializar();