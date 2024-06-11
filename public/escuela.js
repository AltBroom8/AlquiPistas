let actualId;
async function getEscuelas() {
            try {
                const response = await fetch('/getEscuelas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log('data: ');
                console.log(data);
                return data;
            } catch (error) {
                console.error('Error al obtener las escuelas:', error);
                throw error;
            }
}

async function deleteEscuela(id){
    let mijson = {id:id};
    try {
        const response = await fetch('/eliminaEscuela', {
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

        function formatearFecha(fechaStr) {
            const date = new Date(fechaStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }


        document.addEventListener('DOMContentLoaded', async () => {
            const cancelaEliminar = document.getElementById("cancelarEliminar");
            const aceptarEliminar = document.getElementById("aceptarEliminar");
            aceptarEliminar.addEventListener("click",async () => {
                await deleteEscuela(actualId);
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
            try {
                let listado = await getEscuelas();
                console.log(listado);

                const columnDefs = [
                    { headerName: "Nombre", field: "nombre",width: '200',cellStyle: {textAlign: 'center'},sortable: true, filter: true , headerClass: "my-header-class"},
                    { headerName: "Categoría", field: "cat", width: '150',cellStyle: {textAlign: 'center'},sortable: true, filter: true,headerClass: "cat"},
                    { headerName: "Fecha de Inicio", field: "fInicio",width: '160',cellStyle: {textAlign: 'center'},sortable: true, filter: true ,headerClass: "fecha"},
                    { headerName: "Fecha Final", field: "fFin",width: '160',cellStyle: {textAlign: 'center'},sortable: true, filter: true ,headerClass: "fecha"},
                    { headerName: "Edad Mínima", field: "edadMin",width: '150',cellStyle: {textAlign: 'center'},sortable: true, filter: true ,headerClass: "fecha"},
                    { headerName: "Edad Máxima", field: "edadMax",width: '150',cellStyle: {textAlign: 'center'},sortable: true, filter: true,headerClass: "fecha"},
                    {
                        headerName: "Acciones",
                        cellRenderer: function(params) {
                            // Crear el botón de editar
                            const buttonTop = document.createElement('button');
                            buttonTop.classList.add('top');
                            const imgEditar = document.createElement('img');
                            imgEditar.classList.add('editar');
                            imgEditar.src = 'images/edit.png';
                            imgEditar.alt = 'Botón editar';
                            buttonTop.appendChild(imgEditar);
                            buttonTop.addEventListener('click', function() {

                                const rowData = params.data.id;
                                console.log(params.data)
                                location.href = `/form?id=${rowData}`;
                            });
                
                            // Crear el botón de eliminar
                            const buttonBottom = document.createElement('button');
                            buttonBottom.classList.add('bottom');
                            const imgEliminar = document.createElement('img');
                            imgEliminar.classList.add('eliminar');
                            imgEliminar.src = 'images/Trash.png';
                            imgEliminar.alt = 'Botón eliminar';
                            buttonBottom.appendChild(imgEliminar);

                            buttonBottom.addEventListener('click',()=>{
                                const rowData = params.data.nombre;
                                console.log("Has hecho clic en el botón eliminar");
                                const avisoElement = document.querySelector('.aviso');
                                avisoElement.style.display = "flex";
                                const cartel = avisoElement.querySelector('.avisoVentana');
                                const txt = document.getElementById('prompt');
                                txt.innerText = `¿Estás seguro de eliminar  ${rowData} ?`
                                cartel.classList.add("entra");
                                actualId = params.data.id;
                            })
                            
                
                            // Contenedor para los botones
                            const container = document.createElement('div');
                            container.style.display = 'flex';
                            container.style.flexDirection = 'row';
                            container.style.alignItems = 'space-between'; // Centrar los botones horizontalmente
                            container.appendChild(buttonTop);
                            container.appendChild(buttonBottom);
                
                            return container;
                        },
                        width: '200',
                        headerClass: "my-header-class"
                    }
                ];

                const rowData = listado.map(elemento => ({
                    id: elemento.id,
                    nombre: elemento.nombre,
                    cat: elemento.nombre_categoria,
                    fInicio: formatearFecha(elemento.fecha_inicio),
                    fFin: formatearFecha(elemento.fecha_fin),
                    edadMin: elemento.edad_min,
                    edadMax: elemento.edad_max
                }));

                const gridOptions = {
                    columnDefs: columnDefs,
                    rowData: rowData,
                    pagination: true, // Habilitar paginación
                    paginationPageSize: 12
                };

                // Obtener el div donde se renderizará ag-Grid
                const eGridDiv = document.querySelector('#myGrid');

                // Crear una nueva instancia de ag-Grid
                new agGrid.Grid(eGridDiv, gridOptions);
            } catch (error) {
                console.error('Error durante la carga de datos:', error);
            }

            const addButton = document.getElementById('addButton');
            addButton.addEventListener('click', () =>{
                location.href = "/form?id=-1"
            });

        });