const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');
let listado;
let escuela;
id = parseInt(id, 10);
const rechazar = document.getElementById('rechazar');
const aceptar  = document.getElementById('confirmar');
rechazar.addEventListener('click',() =>{
    location.href = '/escuela'
})  
async function getCategorias() {
    try {
        const response = await fetch('/getCategorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        listado = data;
        console.log(listado);
        return;
    } catch (error) {
        console.error('Error al obtener las escuelas:', error);
        throw error;
    }
}
async function rellenarSelect(){
    await getCategorias();
    const selectCategoria = document.getElementById('categoria');
    listado.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id_categoria;
        option.textContent = categoria.nombre_categoria;
        selectCategoria.appendChild(option);
    });
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
function rellenarCampos(){
    
    
    const titulo = document.querySelector('input[name="nombre"]');
    const inscripcion = document.querySelector('input[name="Ins"]');
    const finInscripcion = document.querySelector('input[name="finIns"]');
    const comienzoCurso = document.querySelector('input[name="curso"]');
    const finCurso = document.querySelector('input[name="finCurso"]');
    const edadMinima = document.querySelector('input[name="edadMin"]');
    const edadMaxima = document.querySelector('input[name="edadMax"]');
    
    // Llenar los campos con los valores de la escuela
    titulo.value = escuela.nombre;
    inscripcion.value = formatDate(escuela.inicio_inscripcion);
    finInscripcion.value = formatDate(escuela.fin_inscripcion);
    comienzoCurso.value = formatDate(escuela.fecha_inicio);
    finCurso.value = formatDate(escuela.fecha_fin);
    edadMinima.value = escuela.edad_min;
    edadMaxima.value = escuela.edad_max;

    // Asegurarse de que las opciones están llenas antes de asignar el valor
    const selectCategoria = document.getElementById('categoria');
    console.log("El número de categorías es " + escuela.categoria);
    selectCategoria.value = escuela.categoria;
    console.log("El número de select es "+ selectCategoria.value);
}
async function getEscuela(id){
    const mijson = {
        id: id
    }
    try {
        const response = await fetch('/getEscuela', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mijson)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        escuela = data;
        console.log(escuela);
        rellenarCampos();
        return;
    } catch (error) {
        console.error('Error al obtener las escuelas:', error);
        throw error;
    }
}

async function updateEscuela(id,nombre,categoria,fecha1,fecha2,fecha3,fecha4,edadMin,edadMax){
    const mijson = {
        id:id,
        nombre:nombre,
        categoria:categoria,
        fecha1:fecha1,
        fecha2:fecha2,
        fecha3:fecha3,
        fecha4:fecha4,
        edadMin:edadMin,
        edadMax:edadMax
    }
    try {
        const response = await fetch('/updateEscuela', {
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
        return;
    } catch (error) {
        console.error(error);
        return;
    }
}



async function insertaEscuela(nombre,categoria,fecha1,fecha2,fecha3,fecha4,edadMin,edadMax){

    const mijson = {
        nombre:nombre,
        categoria:categoria,
        fecha1:fecha1,
        fecha2:fecha2,
        fecha3:fecha3,
        fecha4:fecha4,
        edadMin:edadMin,
        edadMax:edadMax
    }
    try {
        const response = await fetch('/insertEscuela', {
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
        return;
    } catch (error) {
        console.error(error);
        return;
    }
}


function fechasValidas(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return false;
    }

    return start <= end;
}


document.querySelectorAll('.error').forEach(element => {
    element.classList.remove('error');
});
rellenarSelect();
if (id != -1){
    console.log('entra')
    getEscuela(id);
    
}
aceptar.addEventListener('click', async ()=>{
    document.querySelectorAll('.error').forEach(element => {
        element.classList.remove('error');
    });
    const aviso = document.getElementById("aviso");
    const titulo = document.querySelector('input[name="nombre"]').value;
    const inscripcion = document.querySelector('input[name="Ins"]').value;
    const finInscripcion = document.querySelector('input[name="finIns"]').value;
    const comienzoCurso = document.querySelector('input[name="curso"]').value;
    const finCurso = document.querySelector('input[name="finCurso"]').value;
    const edadMinima = document.querySelector('input[name="edadMin"]').value;
    const edadMaxima = document.querySelector('input[name="edadMax"]').value;
    aviso.style.display = "none";
    if (
        titulo.trim() === '' ||
        inscripcion.trim() === '' ||
        finInscripcion.trim() === '' ||
        comienzoCurso.trim() === '' ||
        finCurso.trim() === '' ||
        edadMinima.trim() === '' ||
        edadMaxima.trim() === ''
    ) {
        // Aplica los cambios del primer campo a todos los demás campos vacíos
        if (titulo.trim() === '') {
            const tituloInput = document.querySelector('input[name="nombre"]');
            tituloInput.classList.add('error');
            tituloInput.value = '';
            tituloInput.placeholder = 'Rellena este campo';
            return;
        }
        else if (inscripcion.trim() === '') {
            const inscripcionInput = document.querySelector('input[name="Ins"]');
            inscripcionInput.classList.add('error');
            inscripcionInput.value = '';
            inscripcionInput.placeholder = 'Rellena este campo';
            return;
        }
        else if (finInscripcion.trim() === '') {
            const finInscripcionInput = document.querySelector('input[name="finIns"]');
            finInscripcionInput.classList.add('error');
            finInscripcionInput.value = '';
            finInscripcionInput.placeholder = 'Rellena este campo';
            return;
        }
        else if (comienzoCurso.trim() === '') {
            const comienzoCursoInput = document.querySelector('input[name="curso"]');
            comienzoCursoInput.classList.add('error');
            comienzoCursoInput.value = '';
            comienzoCursoInput.placeholder = 'Rellena este campo';
            return;
        }
        else if (finCurso.trim() === '') {
            const finCursoInput = document.querySelector('input[name="finCurso"]');
            finCursoInput.classList.add('error');
            finCursoInput.value = '';
            finCursoInput.placeholder = 'Rellena este campo';
            return;
        }
        else if (edadMinima.trim() === '') {
            const edadMinimaInput = document.querySelector('input[name="edadMin"]');
            edadMinimaInput.classList.add('error');
            edadMinimaInput.value = '';
            edadMinimaInput.placeholder = 'Rellena este campo';
            return;
        }
        else if (edadMaxima.trim() === '') {
            const edadMaximaInput = document.querySelector('input[name="edadMax"]');
            edadMaximaInput.classList.add('error');
            edadMaximaInput.value = '';
            edadMaximaInput.placeholder = 'Rellena este campo';
            return;
        }
        

        
    }else if (parseInt(edadMinima,10) > parseInt(edadMaxima,10) && parseInt(edadMinima,10)>0 && parseInt(edadMaxima,10)>0) {
        // Si la edad mínima es mayor que la edad máxima, muestra un mensaje de error
        const edadMinimaInput = document.querySelector('input[name="edadMin"]');
        const edadMaximaInput = document.querySelector('input[name="edadMax"]');
        edadMinimaInput.classList.add('error');
        edadMinimaInput.value = '';
        edadMinimaInput.placeholder = 'La edad minima no es válida';
        edadMaximaInput.classList.add('error');
        edadMaximaInput.value = '';
        edadMaximaInput.placeholder = 'La edad máxima no es válida';
        return;
    }else if (!fechasValidas(new Date(inscripcion),new Date(finInscripcion))){

        aviso.style.display = 'flex';
        const inscripcionInput = document.querySelector('input[name="Ins"]');
        inscripcionInput.classList.add('error');
        const finInscripcionInput = document.querySelector('input[name="finIns"]');
        finInscripcionInput.classList.add('error');
        
        return;
    }else if(!fechasValidas(new Date(finInscripcion),new Date(comienzoCurso))){
        aviso.style.display = 'flex';
        const finInscripcionInput = document.querySelector('input[name="finIns"]');
        finInscripcionInput.classList.add('error');
        const comienzoCursoInput = document.querySelector('input[name="curso"]');
        comienzoCursoInput.classList.add('error');
        return;
    }else if(!fechasValidas(new Date(comienzoCurso),new Date(finCurso))){
        const comienzoCursoInput = document.querySelector('input[name="curso"]');
        comienzoCursoInput.classList.add('error');
        const finCursoInput = document.querySelector('input[name="finCurso"]');
        finCursoInput.classList.add('error');
        return;
    }
    const categoriaSelect = document.querySelector('select[name="categoria"]');
    const categoria = parseInt(categoriaSelect.value,10);
    if (id ===-1){
        await insertaEscuela(titulo,categoria,new Date(inscripcion),new Date(finInscripcion),new Date(comienzoCurso),new Date(finCurso),edadMinima,edadMaxima)
    
    }else{
        await updateEscuela(id,titulo,categoria,new Date(inscripcion),new Date(finInscripcion),new Date(comienzoCurso),new Date(finCurso),edadMinima,edadMaxima)
    }
    location.href = '/escuela'
})


