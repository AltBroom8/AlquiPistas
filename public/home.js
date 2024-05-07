let usuario; 

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
obtenerUsuario().then(() => {
    const titulo = document.getElementById('titulo');
    titulo.innerText = `Bienvenido, ${usuario}`;
})

