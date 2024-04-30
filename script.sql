CREATE DATABASE ALQUIPISTAS;
USE ALQUIPISTAS;

CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    contraseña VARCHAR(100),
    correo VARCHAR(255)
);

INSERT INTO Usuario (nombre_completo, username, contraseña, correo) VALUES ('Nombre Apellido', 'username123', 'contraseña123', 'correo@gmail.com');
