//IMPORTS
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const database = require('./database.js');
const seguridad = require('./password.js');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const accountTransport = require("./account_transport.json");


//METODO QUE SETEA LA INFO PARA MANDAR EL CORREO
const setInfo = async (callback) => {
    
    const oauth2Client = new OAuth2(
        accountTransport.auth.clientId,
        accountTransport.auth.clientSecret,
        "https://developers.google.com/oauthplayground",
    );
    const isAccessTokenExpired = oauth2Client.isTokenExpiring();
    if (isAccessTokenExpired) {
        await oauth2Client.getAccessToken();
        accountTransport.auth.refreshToken = oauth2Client.credentials.refresh_token;
    }
    oauth2Client.setCredentials({
        refresh_token: accountTransport.auth.refreshToken,
        tls: {
            rejectUnauthorized: false
        }
    });
    oauth2Client.getAccessToken((err, token) => {
        if (err)
            return err;
        accountTransport.auth.accessToken = token;
        callback(nodemailer.createTransport(accountTransport));
    });
};

//GENERA TOKENS USANDO LA LIBRERIA CRYPTO
function generarToken() {
    return crypto.randomBytes(20).toString('hex');
}

//AQUI CALCULAMOS LA DURACION DEL TOKEN, LA DURACION INICIAL ES UNA HORA
function calcularDuracionToken(fechaCreacion, duracionMinutos) {
    const fechaExpiracion = new Date(fechaCreacion);
    fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + duracionMinutos);
    return fechaExpiracion;
}


//METODO QUE TRATA DE ENVIAR UN CORREO PARA RECORDAR CONTRASEÑA Y GENERAR LOS TOKENS PARA LA URL DE CONFIRMACION
async function enviaCorreo (email){
    const AplicacionNombre = 'AlquiPistas';
    let username = null;
    await database.mailPorUsername(email, result=>{
        username = result
    });
    const token = generarToken();
    const enlace = `http://localhost:3000/setPassword?token=${token}`;
    const fechaCreacion = new Date();
    const duracionMinutos = 60;
    const fechaExpiracion = calcularDuracionToken(fechaCreacion, duracionMinutos);
    await database.insertaToken(token,email,fechaExpiracion)
    setInfo((transporter)=>{
        const mailOptions = {
            from: 'AlquilerDePistasGines@gmail.com',
            to: email,
            subject: 'Restablecer Contraseña',
            text: `Hola ${username},
    
    Recibimos una solicitud para restablecer la contraseña de tu cuenta en ${AplicacionNombre}. Si no hiciste esta solicitud, puedes ignorar este correo electrónico.
    
    Para restablecer tu contraseña, haz clic en el siguiente enlace o cópialo y pégalo en tu navegador:
    
    ${enlace}
    
    Este enlace expirará en ${duracionMinutos} minutos y solo puede ser utilizado una vez.
    
    Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar con nuestro equipo de soporte.
    
    Gracias,
    El equipo de ${AplicacionNombre}.`
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error('Error al enviar el correo electrónico:', error);
            } else {
                console.log('Correo electrónico enviado.');
            }
        });
    })
    
}
//MOSTRAMOS DOCUMENTOS PUBLICOS
app.use(express.static('public'));
//LIBRERIA PARA USO DE JSON
app.use(bodyParser.json());
//USO DE LA SESION Y COOKIES
app.use(session({
    secret: 'Van_dos_fantasmas_y_se_cae_el_del_médium.',
    resave: false,
    saveUninitialized: true
}));
//ACCESO A LAS DISTINTAS PAGINAS POR GET
app.get('/home.html', (req, res) => {
    res.redirect('/error404');
});

//Pagina de login
app.get('/', (req, res) => {
    if(req.session.username){
        res.redirect('/home');
    }else{
        res.sendFile('login.html', { root:__dirname });
    }
});
//Pagina para envio de correo
app.get('/recordar', (req, res) => {
    res.sendFile('recordar.html', { root:__dirname });
})
//Dashboard para los usuarios
app.get('/home', (req, res) => {
    if (!req.session.username) {
        res.redirect('/');
    }
    res.sendFile('./home.html', {root : __dirname});
})
//Logica del cambio de contraseña y manejo de Tokens
app.get('/setPassword', async (req, res) => {
    const token = req.query.token; 

    if (!token) {
        return res.status(400).send('Dirección no válida');
    }

    let tokenEncontrado = null;
    await database.buscarToken(token,async (error,resultado)=>{
        
        if (resultado){
            tokenEncontrado = resultado;
            
        }else{
            
            tokenEncontrado = null;
        }
        


        if (!tokenEncontrado) {

            return res.status(400).send('Token inválido');
        }
        const ahora = new Date();
        if (ahora > tokenEncontrado.fechaExpiración) {
            return res.status(400).send('El token ha expirado');
        }else if(tokenEncontrado.valido === 0){
            return res.status(400).send(`
                <div style="font-size: 18px;">
                    La página ya no está disponible. Por favor, verifica la URL que has ingresado
                    e intenta nuevamente más tarde. Si el problema persiste, contacta al administrador
                    del sitio para obtener ayuda.
                </div>`);
        }
        
        res.sendFile('nuevapswd.html', { root:__dirname});
        await database.cambiarValidez(tokenEncontrado.token);

    });
    
});
//Si ninguna ruta es correcta, redirecciono a esta web
app.get('/error404', (req, res) => {
    res.status(404).send('Error 404: Página no encontrada');
});

//SOLUCIONES POR POST
//login del usuario
app.post('/login', async (req, res) => {
    
    
    req.body.password = await seguridad.encripta(req.body.password);
    
    database.loginCorrecto(req.body.username, req.body.password,resultado=>{
        
        if(resultado){
            req.session.username = req.body.username;
        }
        res.send(resultado);
    });
    
})
//comprueba si el username existe
app.post('/compruebaUsername', async (req, res) => {
    database.compUser(req.body.username, resultado=>{
        
        res.send(resultado);
    });    
});
//Actualizacion de contraseña
app.post('/actualizaPass', async (req, res)=>{
    let correo = null;
    const password = await seguridad.encripta(req.body.password);
    await database.buscarToken(req.body.token,async (error,result)=>{
        if (result){
            correo = result.correoElectrónico;
        }
        await database.updatePassword(correo,password);
        res.send(true)
    });
    

});
//Comprueba si el mail ya existe
app.post('/compruebaMail', async (req, res) => {

    database.compMail(req.body.correo, resultado=>{
        res.send(resultado);
    });    
});
//Completa el registro
app.post('/registro', async (req, res)=>{
    
    req.body.pass = await seguridad.encripta(req.body.pass);
    database.registro(req.body.name,req.body.usuario,req.body.correo,req.body.pass,resultado=>{
        if(resultado){
            req.session.username = req.body.usuario;
        }
        
        res.send(resultado);
    });
})
//Envia un correo con el link de recuperar contraseña
app.post('/enviaEmail', async (req, res)=>{

    let correo = req.body.correo;
    
    database.correoExiste(correo,async resultado=>{
        if(resultado){
            await enviaCorreo(correo);
        }
        res.send(resultado);
    });
})
//devuelve el username de la sesión
app.post('/inicializar',  (req, res)=>{
    const datos = {
        username: req.session.username
    };
    res.json(datos);
})



//SI NO CONCUERDA LA URL INTRODUCIDA CON NINGUNA DE LAS ANTERIORES, LANZO UN ERROR
app.use((req, res) => {
    res.redirect('/error404');
});

//INICIO EL SERVIDOR EN EL PUERTO 3000
app.listen(3000,()=>{
    database.conectar();
});

