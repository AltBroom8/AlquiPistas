//INICIALIZAMOS EL BOTON Y LOS CAMPOS
let boton = document.getElementById('guardarContraseña');
let password = document.getElementById('password');
let confirmar = document.getElementById('confirmar');
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const token = params.get('token');

//LOGICA PARA CUANDO SE REALIZA EL SUBMIT
boton.addEventListener('click',async (event)=>{
    event.preventDefault();
    let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/
    let todoCorrecto = true;
    const elemento = document.getElementById('mitexto');
        if (elemento) {
            elemento.parentNode.removeChild(elemento);
        }
    
    if (password.value===''|| !passRegex.test(password.value)){
        confirmar.value = '';
        password.value = '';
        const texto = document.createElement('h6');
        texto.innerHTML = `Requisitos para la contraseña:<br>
        - Al menos 8 caracteres de longitud<br>
        - Al menos una letra minúscula<br>
        - Al menos una letra mayúscula<br>
        - Al menos un dígito numérico<br>
        - Al menos un carácter especial`;
        texto.style.color = 'red';
        texto.setAttribute('id', 'mitexto');
        const formulario = document.getElementById('formulario');
        formulario.insertBefore(texto, boton);
        todoCorrecto = false;
    }else if(password.value!== confirmar.value) {
        confirmar.value = '';
        password.value = '';
        const texto = document.createElement('h6');
        texto.innerHTML = `Las contraseñas no coinciden`;
        texto.style.color = 'red';
        texto.setAttribute('id', 'mitexto');
        const formulario = document.getElementById('formulario');
        formulario.insertBefore(texto, boton);
        todoCorrecto = false;
    }
    else{
        const texto = document.createElement('h6');
        texto.innerHTML = `La contraseña se ha cambiado.`;
        texto.style.color = 'green';
        texto.setAttribute('id', 'mitexto');
        const formulario = document.getElementById('formulario');
        formulario.insertBefore(texto, boton);
        console.log('contraseña valida');
        await nuevaPass(password.value);
        setTimeout(() =>{
            window.location.href = '/';
            console.log('entra');
        },2000);
    }
});

//SOLICITUD PARA CAMBIAR LA CONTRASEÑA EN LA BASE DE DATOS
async function nuevaPass(pass){
    const datos = {
        token: token,
        password: pass,
    };
    try {
        await fetch('/actualizaPass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        console.log('Solicitud de password enviada correctamente');
        return true; 
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}