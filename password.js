//imports
const bcrypt = require('bcryptjs');
//salt para la contraseña
const salt = '$2a$10$ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//metodo que encripta la contraseña
const encripta = async (contraseña)=>{
    const hashedPassword = bcrypt.hashSync(contraseña, salt);
    return hashedPassword;
}

module.exports = {
    encripta
};