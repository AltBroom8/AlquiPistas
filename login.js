const btn1 = document.getElementById("loginCambio");
const btn2 = document.getElementById("registroCambio");
const btn3 = document.getElementById("actualLogin");
const btn4 = document.getElementById("actualRegistro");
const login = document.getElementById("login");
const registro = document.getElementById("registro");

btn1.addEventListener("click", ()=>{
    registro.classList.remove("animar");
    login.classList.remove("animar2");
    login.classList.add("animar");
    registro.classList.remove("ocultar");
    setTimeout(() => {
        registro.classList.add("animar2");
        login.classList.add("ocultar");
        login.classList.remove("animar");
        login.style.opacity = "0";
    },1000);
});


btn2.addEventListener("click", ()=>{
    registro.classList.add("animar");
    
    
    registro.classList.remove("animar2");
    
    
    
    setTimeout(() => {
        registro.classList.add("ocultar");
        login.style.opacity = "0";
        login.classList.remove("ocultar");
        login.classList.add("animar2");
        login.classList.remove("animar");
        registro.style.opacity = "0";
    },1000);
});

async function enviaDatosLogin(usuario, cont){
    const datos = {
        username: usuario,
        password: cont
    };
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud de inicio de sesión');
        }

        const data = await response.json();
        
        // Aquí puedes comprobar si la respuesta es verdadera y retornar true si lo es
        if (data === true) {
            return true;
        } else {
            // Si la respuesta no es verdadera, puedes hacer algo más aquí, como lanzar un error o retornar false
            return false;
        }

    } catch (error) {
        console.error('Error:', error);
        // En caso de error, también puedes retornar false o lanzar el error
        return false;
    }
}



btn3.addEventListener("click", ()=>{
    const username = document.getElementById("usernameLogin");
    const password = document.getElementById("passwordLogin");
    if(username.value===''){
        username.classList.add('bordeRojo');
        username.placeholder = 'Introduce un usuario válido';
    }else if(password.value===''){
        password.classList.add('bordeRojo');
        password.placeholder = 'Introduce una contraseña válida';
    }else{
        enviaDatosLogin(username.value, password.value)
    .then(resultado => {
        console.log(resultado);
        if(resultado){
            console.log('entra');
            window.location.href = "/home";
        }else{
            alert("Credenciales incorrectas");
            username.placeholder = '';
            username.value = '';
            password.placeholder = '';
            password.value = '';
            username.classList.add('bordeRojo');
            password.classList.add('bordeRojo');
        }
    });
    }
});

async function userNoExiste(usuario){
    const datos = {
        username:usuario
    }
    try {
        const response = await fetch('/compruebaUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud de inicio de sesión');
        }

        const data = await response.json();
        console.log('data es '+data)
        return data;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function correoNoExiste(mail){
    const datos = {
        correo:mail
    }
    try {
        const response = await fetch('/compruebaMail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud de inicio de sesión');
        }

        const data = await response.json();
        console.log('data es '+data)
        return data;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function realizaRegistro(nombre, user, email, password) {
    const datos = {
        name: nombre,
        usuario: user,
        correo: email,
        pass: password
    };

    try {
        await fetch('/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        console.log('Solicitud de registro enviada correctamente');
        return true; // Indica que la solicitud se envió correctamente
    } catch (error) {
        console.error('Error:', error);
        return false; // Indica que hubo un error al enviar la solicitud
    }
}


btn4.addEventListener('click',async ()=>{
    let todoCorrecto = true;
    let nombre = document.getElementById('nombreRegistro');
    let username = document.getElementById('usernameRegistro');
    let email = document.getElementById('emailRegistro');
    let password = document.getElementById('passwordRegistro');
    let repite = document.getElementById('repPassword');

    let regexNombre = /^([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+)(\s+([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+))*$/;
    let userRegex = /^[a-zA-Z0-9]{5,}$/;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|aol|icloud|live|msn|mail|yandex|protonmail|inbox)\.(com|es|net|org|info|gov|edu)$/;
    let passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/

    if (nombre.value===''){
        nombre.classList.add('bordeRojo');
        nombre.placeholder = 'No dejes el nombre vacío';
        todoCorrecto = false;
    }else if( !regexNombre.test(nombre.value)){
        nombre.classList.add('bordeRojo');
        nombre.placeholder = 'Introduce un nombre válido';
        nombre.value = '';
        todoCorrecto = false;
    }else{
        nombre.classList.remove('bordeRojo');
        nombre.placeholder = '';
    }

    if (username.value===''){
        username.classList.add('bordeRojo');
        username.placeholder = 'No dejes el username vacío';
        todoCorrecto = false;
    }else if( !userRegex.test(username.value)){
        username.classList.add('bordeRojo');
        username.placeholder = 'El username debe tener como minimo 5 caracteres';
        username.value = '';
        todoCorrecto = false;
    }else if(await userNoExiste(username.value)===false){
        username.classList.add('bordeRojo');
        username.placeholder = 'El username ya está registrado';
        username.value = '';
        todoCorrecto = false;
    }else{
        username.classList.remove('bordeRojo');
        username.placeholder = '';
    }

    if (email.value===''){
        email.classList.add('bordeRojo');
        email.placeholder = 'No dejes el correo vacío';
        todoCorrecto = false;
    }else if( !emailRegex.test(email.value)){
        email.classList.add('bordeRojo');
        email.placeholder = 'Debes introducir una dirección válida';
        email.value = '';
        todoCorrecto = false;
    }else if(await correoNoExiste(email.value)===false){
        email.classList.add('bordeRojo');
        email.placeholder = 'El correo ya está registrado';
        email.value = '';
        todoCorrecto = false;
    }else{
        email.classList.remove('bordeRojo');
        email.placeholder = '';
    }


    if (password.value===''){
        password.classList.add('bordeRojo');
        password.placeholder = 'No dejes la contraseña vacía';
        repite.value = '';
        alert("Requisitos para la contraseña:\n\n- Al menos 8 caracteres de longitud\n-"+
        " Al menos una letra minúscula\n- Al menos una letra mayúscula\n-"+
        " Al menos un dígito numérico\n- Al menos un carácter especial");
        todoCorrecto = false;
    }else if( !passRegex.test(password.value)){
        password.classList.add('bordeRojo');
        password.placeholder = 'Introduce una contraseña válida...';
        password.value = '';
        repite.value = '';
        alert("Requisitos para la contraseña:\n\n- Al menos 8 caracteres de longitud\n-"+
        " Al menos una letra minúscula\n- Al menos una letra mayúscula\n-"+
        " Al menos un dígito numérico\n- Al menos un carácter especial");
        todoCorrecto = false;
    }else{
        password.classList.remove('bordeRojo');
        password.placeholder = '';
    }

    if(!(repite.value === password.value)){
        repite.classList.add('bordeRojo');
        repite.placeholder = 'Las contraseñas deben ser iguales';
        repite.value = '';
        todoCorrecto = false;
    }else{
        repite.classList.remove('bordeRojo');
        repite.placeholder = '';
    }

    if (todoCorrecto) {
        try {
            await realizaRegistro(nombre.value, username.value, email.value, password.value);
            console.log('llegamos')
            window.location.href = "/home";
        } catch (error) {
            console.error('Error durante el registro:', error);
        }
    }
});

