//Import
const mysql = require('mysql');
//Configuracion de la conexion
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'ALQUIPISTAS'
});

//Metodo para conectar
function conectar(){
    conexion.connect((error) => {
        if (error) {
            console.error('Error al conectar a la base de datos:', error);
            return;
        }
        });
}
//Comprueba si el login es correcto
function loginCorrecto(usuario,contraseña,callback){
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
//Recibe el mail y devuelve el usuario
function mailPorUsername(email,callback){
    conexion.query(
        'SELECT username FROM Usuario WHERE correo = ?',
        [email],
        (error, results) => {
            if (error) {
                callback(null);
                return;
            }
            if (results.length > 0) {
                callback(results[0].username);
                return;
            } else {
                callback(null);
                return ;
            }
        }
        );
}
//Comprueba si un usuario existe en la base de datos
function compUser(username,callback){
    
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
//Comprueba si un mail existe en la base de datos
function compMail(correo,callback){
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
//Realiza un registro
function registro(nombre,user,mail,password,callback){
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
//Inserta un token en su tabla
function insertaToken(token,email,fecha){
    conexion.query(
        'INSERT INTO Tokens (token, correoElectrónico, fechaExpiración) VALUES (?, ?, ?);',
        [token,email,fecha],
        (error, result) => {
            if (error) {
            console.error('Error al insertar token:', error);
            return;
        } else {
            console.log('Token insertado correctamente')
            return;
        }
        }
    )
}
//Busca un token en la tabla
function buscarToken(token, callback) {
    conexion.query(
        'SELECT * FROM Tokens WHERE token = ?',
        [token],
        (error, results) => {
            if (error) {
                console.error('Error al realizar la consulta:', error);
                callback(error, null); 
                return;
            }
            if (Array.isArray(results) && results.length > 0) {
                console.log('Token encontrado');
                callback(null, results[0]); 
            } else {
                console.log('Token no encontrado');
                callback(null, null);
            }
        }
    );
}
//Cambia la validez de un token cuando ya se ha usado
async function cambiarValidez(token) {

    try {
        await new Promise((resolve, reject) => {
            conexion.query(
                'UPDATE Tokens SET valido= 0 WHERE token = ?',
                [token],
                (error, results) => {
                    if (error) {
                        console.error('Error al realizar la consulta:', error);
                        reject(error);
                    } else {
                        console.log('Token actualizado');
                        resolve(results);
                    }
                }
            );
        });
    } catch (error) {
        // Manejar el error aquí si es necesario
        console.error('Error al cambiar la validez del token:', error);
    }
}

function correoExiste(correo,callback){
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
                console.log('El correo existe');
                callback(true);
                return;
            } else {
                console.log('Correo no existe');
                callback(false);
                return ;
            }
        }
        );
}

async function updatePassword(email, password) {

    try {
        await new Promise((resolve, reject) => {
            conexion.query(
                'UPDATE usuario SET contraseña = ? WHERE correo = ?',
                [password, email],
                (error, results) => {
                    if (error) {
                        console.error('Error al realizar la consulta:', error);
                        reject(false);
                    } else {
                        console.log('Se ha actualizado la contraseña');
                        resolve(true);
                    }
                }
            );
        });
        return;
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        return;
    }
}




module.exports = { loginCorrecto,compUser,compMail,registro,mailPorUsername,insertaToken,buscarToken,correoExiste,
    cambiarValidez, updatePassword,conectar};

