let usuario; 
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

obtenerUsuario().then(() => {
    const titulo = document.getElementById('titulo');
    titulo.innerText = `Bienvenido, ${usuario}`;
})

