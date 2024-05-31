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

async function numSocios(busqueda, ordenar, forma, callback) {
    // Validar el valor de `forma`
    if (forma !== 'ASC' && forma !== 'DESC') {
        console.error('El valor de `forma` debe ser "ASC" o "DESC"');
        callback(-1);
        return;
    }

    // Lista de columnas válidas para ordenar
    const columnasValidas = ['username', 'nombre', 'apellidos', 'email','fAlta']; 
    // Validar el valor de `ordenar`
    if (!columnasValidas.includes(ordenar)) {
        console.error('El valor de `ordenar` no es válido');
        callback(-1);
        return;
    }
    let miOrderBy;
    if (ordenar === 'nombre') {
        miOrderBy = `CONCAT(nombre, ' ', apellidos) ${forma}`;
    } else {
        miOrderBy = `${ordenar} ${forma}`;
    }
    // Construir la consulta
    const consulta = `
        SELECT * FROM socios 
        WHERE username LIKE ? OR CONCAT(nombre, ' ', apellidos) LIKE ? OR email LIKE ? 
        AND alta = true
        ORDER BY ${miOrderBy}`;

    // Preparar los valores para los parámetros LIKE
    const valores = [`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`];

    // Ejecutar la consulta
    conexion.query(consulta, valores, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            callback(-1);
            return;
        }
        if (results.length > 0) {
            console.log('Hay ' + results.length + ' socios');
            callback(results.length);
        } else {
            console.log('No hay socios');
            callback(0);
        }
    });
}

async function devuelveSocios(busqueda, ordenar, forma,actual,callback){

    let userPerPage = 12;
    // Validar el valor de `forma`
    if (forma !== 'ASC' && forma !== 'DESC') {
        console.error('El valor de `forma` debe ser "ASC" o "DESC"');
        callback(-1);
        return;
    }

    // Lista de columnas válidas para ordenar
    const columnasValidas = ['username', 'nombre', 'apellidos', 'email','fAlta']; 
    // Validar el valor de `ordenar`
    if (!columnasValidas.includes(ordenar)) {
        console.error('El valor de `ordenar` no es válido');
        callback(-1);
        return;
    }
    let miOrderBy;
    if (ordenar === 'nombre') {
        miOrderBy = `CONCAT(nombre, ' ', apellidos) ${forma}`;
    } else {
        miOrderBy = `${ordenar} ${forma}`;
    }
    
    const consulta = `
        SELECT * FROM socios 
        WHERE (username LIKE ? OR CONCAT(nombre, ' ', apellidos) LIKE ? OR email LIKE ? )
        AND alta = TRUE
        ORDER BY ${miOrderBy} LIMIT ${(actual-1)*userPerPage},${userPerPage}`;

    // Preparar los valores para los parámetros LIKE
    const valores = [`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`];

    conexion.query(consulta, valores, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            callback(error);
            return;
        }
        if (results.length > 0) {
            console.log('Hay ' + results.length + ' socios');
            callback(results);
        } else {
            console.log('No hay socios');
            callback(null);
        }
    });



}

async function existeSocio(id, callback) {

    const consulta = `
        SELECT * FROM socios 
        WHERE id = ?`;

    const valores = [id];

    conexion.query(consulta, valores, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            callback(-1);
            return;
        }
        if (results.length > 0) {
            
            callback(true);
        } else {
            console.log('No hay socios');
            callback(false);
        }
    });
}


async function insertSocio(username,nombre,apellidos,direccion,poblacion,cp,fnac,email,iban,esSocio,tutorNum,
    socioNum,fechaAlta,fechaBaja,callback
){

    const consulta = `
    INSERT INTO Socios (id,username, nombre, apellidos, direccion,poblacion, codigoPostal, email, fNac, iban, socio,
        idTutor, fAlta, fBaja, alta) VALUES
    (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const valores = [socioNum,username,nombre,apellidos,direccion,poblacion,cp,email,fnac,iban,esSocio,tutorNum,fechaAlta,
        fechaBaja,true
    ]
    console.log("SocioNum: " + socioNum);
    
    conexion.query(consulta, valores, 
        (error, result) => {
            if (error) {
            console.error('Error al insertar socio:', error);
            callback(false);
        } else {
            console.log('Socio insertado correctamente')
            callback(true);
        }
        });

}

async function getHijos(id,callback){
    const consulta = `
    SELECT * FROM socios 
    WHERE idTutor = ?`;

const valores = [id];

conexion.query(consulta, valores, (error, results) => {
    if (error) {
        console.error('Error al realizar la consulta:', error);
        callback(null);
        return;
    }
    if (results.length > 0) {
        
        callback(results);
    } else {
        console.log('No hay socios');
        callback(null);
    }
});
}

async function getSocio(id, callback) {

    const consulta = `
        SELECT * FROM socios 
        WHERE id = ?`;

    const valores = [id];

    conexion.query(consulta, valores, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            callback(null,error);
            return;
        }
        if (results.length > 0) {
            
            callback(results[0],null);
        } else {
            console.log('No hay socios');
            callback(null,null);
        }
    });
}

async function updateSocio(id,username,nombre,apellidos,direccion,poblacion,cp,
    fnac,email,IBAN,socio,alta,fAlta,fBaja, callback) {

    const consulta = `
        Update socios SET username = ?,nombre  = ?,apellidos = ?,direccion = ?,poblacion = ?,codigoPostal = ?,
        email = ?,fNac = ?, iban = ?,socio = ?,alta = ?, fAlta = ?,fBaja = ? WHERE id = ?
    `;

    const valores = [username,nombre,apellidos,direccion,poblacion,cp,email,fnac,IBAN,socio,alta,fAlta,fBaja,id];

    conexion.query(consulta, valores, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            callback(false);
        } else {
            console.log('Se ha actualizado el socio');
            callback(true);
        }
    });
}

async function deleteSocio(id, callback) {

    const consulta = `
    UPDATE socios 
    SET alta = false,
    fBaja = NOW() 
    WHERE id = ?;`;

    const valores = [id];

    conexion.query(consulta, valores, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            callback(false);
        } else {
            console.log('Se ha eliminado el socio');
            callback(true);
        }
    });
}

async function idMasAlto(callback){
    const consulta = `SELECT MAX(id) AS max_id FROM socios;`;

    conexion.query(consulta, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            callback(false);
        } else {
            console.log('El ID más alto es:', results[0].max_id);
            callback(results[0].max_id);
        }
    });
}



module.exports = { loginCorrecto,compUser,compMail,registro,mailPorUsername,insertaToken,buscarToken,correoExiste,
    cambiarValidez, updatePassword,conectar,numSocios,devuelveSocios,existeSocio,insertSocio,getHijos,getSocio,updateSocio,
    deleteSocio,idMasAlto};

