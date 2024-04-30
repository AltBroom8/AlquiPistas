const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const database = require('./database.js');
const session = require('express-session');
const path = require('path');

app.use(express.static('./'));
app.use(bodyParser.json());
app.use(session({
    secret: 'Van_dos_fantasmas_y_se_cae_el_del_médium.',
    resave: false,
    saveUninitialized: true
}));
app.get('/', (req, res) => {
    res.sendFile('./login.html', {root : __dirname});
});

app.get('/home', (req, res) => {
    if (!req.session.username) {
        return res.status(404).send('Error: No se encuentra la pagina');
    }
    res.sendFile('./home.html', {root : __dirname});
})

app.post('/login', async (req, res) => {
    console.log('El usuario es '+req.body.username);
    console.log('La contraseña es '+req.body.password);
    database.loginCorrecto(req.body.username, req.body.password,resultado=>{
        console.log('La respuesta es '+resultado);
        if(resultado){
            req.session.username = req.body.username;
        }
        res.send(resultado);
    });
    
})
app.post('/compruebaUsername', async (req, res) => {
    database.compUser(req.body.username, resultado=>{
        console.log('La bbdd devuelve '+resultado);
        res.send(resultado);
    });    
});

app.post('/compruebaMail', async (req, res) => {
    console.log(req.body.correo);
    database.compMail(req.body.correo, resultado=>{
        console.log('m2La bbdd devuelve '+resultado);
        res.send(resultado);
    });    
});

app.post('/registro', async (req, res)=>{
    database.registro(req.body.name,req.body.usuario,req.body.correo,req.body.pass,resultado=>{
        if(resultado){
            req.session.username = req.body.usuario;
        }
        console.log(resultado);
        res.send(resultado);
    });
})

app.post('/inicializar',  (req, res)=>{
    const datos = {
        username: req.session.username
    };
    res.json(datos);
})

app.listen(3000);

