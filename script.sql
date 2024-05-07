CREATE USER 'carlos'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON *.* TO 'carlos'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE DATABASE ALQUIPISTAS;
USE ALQUIPISTAS;

CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    contraseña VARCHAR(100),
    correo VARCHAR(255)
);

CREATE TABLE Tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    correoElectrónico VARCHAR(255) NOT NULL,
    fechaExpiración DATETIME NOT NULL
);
ALTER TABLE Tokens
ADD COLUMN valido BOOLEAN NOT NULL DEFAULT TRUE;

INSERT INTO Usuario (nombre_completo, username, contraseña, correo) VALUES ('Nombre Apellido', 'username123', 'contraseña123', 'correo@gmail.com');
