let boton = document.getElementById('enviarCorreo');
let input = document.getElementById('correo');
let aparece = false;
//Metodo para enviar un correo al presionar un boton.
boton.addEventListener('click', async (event) => {
    event.preventDefault();
    
    let email = input.value;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|aol|icloud|live|msn|mail|yandex|protonmail|inbox)\.(com|es|net|org|info|gov|edu)$/;
    let result = await enviarEmail(email);
    console.log('el result es '+result);
    if( (!emailRegex.test(email)) || !result){
        console.log('entra')
        const elemento = document.getElementById('mitexto');
        if (elemento) {
            elemento.parentNode.removeChild(elemento);
        }
        const texto = document.createElement('h6');
        texto.textContent = 'Email no válido';
        texto.style.color = 'red';
        texto.setAttribute('id', 'mitexto');
        const divFormGroup = document.querySelector('.form-group');
        divFormGroup.appendChild(texto);

    }else{
        const elemento = document.getElementById('mitexto');
        if (elemento) {
            elemento.parentNode.removeChild(elemento);
        }
        const texto = document.createElement('h6');
        texto.textContent = 'Email enviado correctamente';
        texto.style.color = 'green';
        texto.setAttribute('id', 'mitexto');
        const divFormGroup = document.querySelector('.form-group');
        divFormGroup.appendChild(texto);
        console.log();
        setTimeout(() => {
            window.location.href = '/'
        },3000)
    }
})

//Solicitud al backend para el envio del correo.
const enviarEmail = async (email) => {
    
    const datos = {
        correo: email,
    };

    try {
        const response = await fetch('/enviaEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return false; 
    }
}



