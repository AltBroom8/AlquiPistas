const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'ALQUIPISTAS'
});
let conectado = false;

function conectar(){
    conexion.connect((error) => {
        if (error) {
            console.error('Error al conectar a la base de datos:', error);
            return;
        }
        console.log('Conexión a la base de datos exitosa');
        conectado=true;
        });
}

function loginCorrecto(usuario,contraseña,callback){
    if(!conectado){
        conectar();
    }
    
    conexion.query(
        'SELECT * FROM Usuario WHERE username = ? AND contraseña = ?',
        [usuario, contraseña],
        (error, results) => {
            if (error) {
                console.error('Error al realizar la consulta:', error);
                callback(false);
                return;
            }
            if (results.length > 0) {
                console.log('Usuario y contraseña válidos');
                callback(true);
                return;
            } else {
                console.log('Usuario y/o contraseña incorrectos');
                callback(false);
                return ;
            }
        }
        );
}

function compUser(username,callback){
    if(!conectado){
        conectar();
    }
    conexion.query(
        'SELECT * FROM Usuario WHERE username = ?',
        [username],
        (error, results) => {
            if (error) {
                console.error('Error al realizar la consulta:', error);
                callback(false);
                return;
            }
            if (results.length > 0) {
                console.log('Usuario ya existe, no es valido');
                callback(false);
                return;
            } else {
                console.log('Usuario disponible');
                callback(true);
                return ;
            }
        }
        );
}

function compMail(correo,callback){
    if(!conectado){
        conectar();
    }
    conexion.query(
        'SELECT * FROM Usuario WHERE correo = ?',
        [correo],
        (error, results) => {
            
            if (error) {
                console.error('Error al realizar la consulta:', error);
                callback(false);
                return;
            }
            if (results.length > 0) {
                console.log('El correo ya existe, no es valido');
                callback(false);
                return;
            } else {
                console.log('Correo disponible');
                callback(true);
                return ;
            }
        }
        );
}

function registro(nombre,user,mail,password,callback){
    console.log("nombre: "+nombre+" user: "+user+" password: "+password+" email: "+mail);
    if(!conectado){
        conectar();
    }
    conexion.query(
        'INSERT INTO Usuario (nombre_completo, username, correo, contraseña) VALUES (?, ?, ?, ?);',
        [nombre,user,mail,password],
        (error, result) => {
            if (error) {
            console.error('Error al insertar usuario:', error);
            callback(false);
            return;
        } else {
            console.log('Usuario insertado correctamente');
            callback(true)
            return;
        }
        }
    )
}

module.exports = { loginCorrecto,compUser,compMail,registro};

