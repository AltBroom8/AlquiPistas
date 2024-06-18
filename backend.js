//IMPORTS
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const database = require('./database.js');
const seguridad = require('./password.js');
const multer = require('multer');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const accountTransport = require("./account_transport.json");
let tempId = -1;


// Configura Multer para guardar archivos en una ubicación específica
const multerConfig = (id) => ({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/images/imagenesUsuario'); // Directorio donde se guardarán los archivos
        },
        filename: (req, file, cb) => {
            console.log(id);
            const filename = `${id}.jpg`;
            cb(null, filename);
        }
    })
    
});

// Middleware para analizar el cuerpo de la solicitud como FormData
const multerUpload =(id)=> multer(multerConfig(id)).single('archivo');



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
        if (err) {
            console.error('Error al obtener el token de acceso:', err);
            return callback(null); 
        }
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
    await database.insertaToken(token,email,fechaExpiracion);
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
        console.log("entra")
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
app.get("/socio", (req, res) => {
    if (!req.session.username) {
        res.redirect('/');
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile('./home.html', {root : __dirname});    
})

app.get("/escuela", (req, res) => {
    if (!req.session.username) {
        res.redirect('/');
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile('./escuela.html', {root : __dirname});    
})
app.get("/union", (req, res) => {
    if (!req.session.username) {
        res.redirect('/');
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile('./union.html', {root : __dirname});    
})



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

app.get('/imagen', (req, res) => {

    const id = req.query.id;
    const ruta = path.join(__dirname, `public/images/imagenesUsuario/${id}.jpg`);
    res.sendFile(ruta, (err) => {
        if (err) {
            // Si hay un error al enviar el archivo, envía una respuesta de error
            console.error('Error al enviar el archivo:', err);
            res.status(err.status || 500).send('Error al enviar el archivo');
        } else {
            console.log('Archivo enviado correctamente');
        }
    });
});

app.get('/form',(req, res)=>{
    res.sendFile('./formulario.html', {root : __dirname});
})


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

app.post('/cuantosSocios', (req, res)=>{
    let busqueda = req.body.busqueda;
    let ordenar = req.body.ordenar;
    let forma = req.body.forma;
    database.numSocios(busqueda,ordenar,forma,(resultado)=>{
        console.log('Se han detectado '+resultado+' resultados.');
        res.json(resultado);
    })
    
});

app.post('/devuelveSocios', (req, res)=>{

    let busqueda = req.body.busqueda;
    let ordenar = req.body.ordenar;
    console.log('ordenar por '+ordenar);
    let forma = req.body.forma;
    let pagina = req.body.pagina;
    database.devuelveSocios(busqueda,ordenar,forma,pagina,(resultado)=>{
        console.log('Se han detectado '+resultado+' resultados.');
        res.json(resultado);
    })
    
});

app.post('/existeSocio',(req,res)=>{
    let id = req.body.id;
    console.log('el id es'+id);
    database.existeSocio(id,(resultado)=>{
        res.json(resultado);
    });
})

app.post("/insertSocio",(req,res)=>{
    /*
    (username,nombre,apellidos,direccion,cp,fnac,email,iban,esSocio,tutorNum,
    socioNum,fechaAlta,fechaBaja,callback
        };
    */
    let username = req.body.username;
    let nombre = req.body.nombre;
    let apellidos = req.body.apellidos;
    let direccion = req.body.direccion;
    let cp = req.body.cp;
    let fechaNacimiento = req.body.fechaNacimiento;
    let poblacion = req.body.poblacion;
    let email = req.body.email;
    let iban = req.body.iban;
    let esSocio = req.body.esSocio;
    let tutorNum = req.body.tutorNum;
    let socioNum = req.body.socioNum;
    let fechaAlta = req.body.fechaAlta;
    let fechaBaja = req.body.fechaBaja;
    database.insertSocio(username,nombre,apellidos,direccion,poblacion,cp,fechaNacimiento,email,
        iban,esSocio,tutorNum,socioNum,fechaAlta,fechaBaja,(resultado)=>{
            res.send(resultado);
        }
    )
})

app.post('/getHijos', (req, res) => {
    let id = req.body.id;
    database.getHijos(id,(resultado) => {
        res.json(resultado);
    })
});

app.post('/getSocio', (req, res) => {
    let id = req.body.id;
    database.getSocio(id,(resultado,error) => {
        res.json(resultado);
    })
});
app.post('/getSocioPorUsername', (req, res) => {
    let username = req.body.username;
    database.getSocioPorUsername(username,(resultado,error) => {
        res.json(resultado);
    })
});

app.post('updateSocioMovil', (req, res) => {
    let id = req.body.id;
    let nombre = req.body.nombre;
    let apellidos = req.body.apellidos;
    let cp = req.body.cp;
    let email = req.body.email;
    let date = req.body.date;    
})

app.post('/updateSocio', (req, res) => {

    let id =  req.body.id
    let username =  req.body.username
    let nombre =  req.body.nombre
    let apellidos = req.body.apellidos
    let direccion =  req.body.direccion
    let poblacion =  req.body.poblacion
    let cp = req.body.cp
    let fnac = req.body.fnac
    let email = req.body.email
    let iban = req.body.iban
    let socio = req.body.socio
    let alta = req.body.alta
    let fAlta = req.body.fAlta
    let fBaja = req.body.fBaja

    database.updateSocio(id,username,nombre,apellidos,direccion,poblacion,cp,
    fnac,email,iban,socio,alta,fAlta,fBaja, (resultado)=>{
            res.send(resultado);
    })

})

app.post('/deleteSocio',(req, res)=>{
    let id = req.body.id;
    database.deleteSocio(id,(resultado)=>{
        res.send(resultado);
    })
});

app.post('/idMasAlto',(req, res)=>{
    database.idMasAlto((resultado)=>{
        res.json(resultado);
    })
})

app.post('/test', (req, res) => {

    res.json({ mensaje: 'El post funciona en java' });
});


app.post('/uploadFile', (req, res) => {
    console.log('id es '+req.query.id);
    const id = req.query.id;
    multerUpload(id)(req, res, function(err) {
        if (err) {
            
            return next(err);
        }
        res.send('Archivo subido exitosamente');
    });
    
});

app.post('/getEscuelas', (req, res) => {
    database.getEscuelas((resultado) => {
        console.log(resultado);
        res.json(resultado);
    })
});
app.post('/getEscuela',(req,res) => {
    let id = req.body.id;
    database.getEscuela(id,(resultado) => {
        res.json(resultado);
    });    
})
app.post('/getEscuelasPag', (req, res) => {
    let pag = req.body.pag;
    database.getEscuelasPag(pag,(resultado) => {
        console.log(resultado);
        res.json(resultado);
    })
});
app.post('/getCategorias', (req, res) => {
    database.getCategorias((resultado) => {
        res.json(resultado);
    })
});

app.post('/nombresPorEscuela',(req,res) => {
    let id = req.body.id;
    database.nombresPorEscuela(id,(resultado) => {
        res.json(resultado);
    });
});
app.post('/totalEscuelas',(req,res) => {
    database.totalEscuelas((resultado) => {
        res.json(resultado);
    });
});

app.post('/sacarUser', (req, res) => {
    let idEscuela = req.body.idEscuela;
    let idUser = req.body.idUser;
    database.sacarUser(idUser,idEscuela,(resultado)=>{
        res.json(resultado);
    })
})

app.post('/insertEscuela',(req, res) => {
    
    let nombre = req.body.nombre;
    let categoria = req.body.categoria;
    let fecha1 = req.body.fecha1;
    let fecha2 = req.body.fecha2;
    let fecha3 = req.body.fecha3;
    let fecha4 = req.body.fecha4;
    let edadMin = req.body.edadMin;
    let edadMax = req.body.edadMax;

    database.insertaEscuela(nombre,categoria,fecha1,fecha2,fecha3,fecha4,edadMin,edadMax,(resultado) => {
        res.json(resultado);
    });
})


app.post('/getEscuelasPag', (req, res) => {
    let id = req.body.id;
    console.log(id);
    database.getEscuela(id,(resultado) => {
        res.json(resultado);
    })
});

app.post('/updateEscuela', (req, res) => {
    console.log(req.body);
    let id = req.body.id;
    let nombre = req.body.nombre;
    let categoria = req.body.categoria;
    let fecha1 = req.body.fecha1;
    let fecha2 = req.body.fecha2;
    let fecha3 = req.body.fecha3;
    let fecha4 = req.body.fecha4;
    let edadMin = req.body.edadMin;
    let edadMax = req.body.edadMax;
    database.updateEscuela(id,nombre,categoria,fecha1,fecha2,fecha3,fecha4,edadMin,edadMax,(resultado) => {
        res.json(resultado);
    });
    
})

app.post('/eliminaEscuela', (req, res) => {
    let id = req.body.id;
    database.deleteEscuela(id,(resultado) => {
        res.json(resultado);
    });
})

app.post('/registroMovil', (req, res) => {
    let nombre = req.body.nombre;
    let username = req.body.username;
    let email = req.body.email;    
    database.registroMovil(nombre,username,email,(resultado)=>{
        res.json(resultado);
    })
})

app.post('/existeSocioPorUsername',(req,res)=>{
    let username = req.body.username;
    database.existeSocioPorUsername(username,(resultado)=>{ 
        res.json(resultado);
    });
})

app.post('/escuelasPorUsuario', (req, res)=>{
    let username = req.body.username;
    database.escuelasPorUsuario(username,(resultado)=>{
        res.json(resultado);
    })
});

app.post('/quitarEscuela',(req, res)=>{
    let idEscuela = req.body.idEscuela;
    let idUser = req.body.idUser;
    database.quitarEscuela(idEscuela,idUser,(resultado)=>{
        res.json(resultado);
    })
});

app.post('/listadoInscripciones',(req, res)=>{
    let username = req.body.username;
    database.listadoInscripciones(username,(resultado)=>{
        res.json(resultado);
    });    
})

app.post('/inscribeUser',(req, res)=>{
    let user = req.body.user;
    let escuela = req.body.escuelaId;
    database.inscribeUser(user,escuela,(resultado)=>{
        res.json(resultado);
    })    
})

app.post('/updateSocioMovil',(req, res)=>{
    let nombre = req.body.nombre;
    let apellidos = req.body.apellidos;
    let cp = req.body.cp;
    let email = req.body.email;
    let date = req.body.date; 
    let id = req.body.id;
    database.updateSocioMovil(nombre,apellidos,cp,email,date,id,(resultado)=>{
        res.json(resultado);
    }); 
    
})

//SI NO CONCUERDA LA URL INTRODUCIDA CON NINGUNA DE LAS ANTERIORES, LANZO UN ERROR
app.use((req, res) => {
    res.redirect('/error404');
});

//INICIO EL SERVIDOR EN EL PUERTO 3000
app.listen(3000,()=>{
    database.conectar();
});

