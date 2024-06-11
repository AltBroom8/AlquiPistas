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


CREATE TABLE Socios(
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    apellidos VARCHAR(200),
    direccion VARCHAR(300),
    codigoPostal VARCHAR(5),
    email VARCHAR(200),
    fNac DATE,
    iban VARCHAR(34),
    socio BOOLEAN,
    idTutor INT,
    fAlta DATE,
    fBaja DATE,
    alta BOOLEAN NOT NULL,
    FOREIGN KEY (idTutor) REFERENCES Socios(id)
);
ALTER TABLE Socios
ADD COLUMN username VARCHAR(255) NOT NULL

ALTER TABLE Socios
ADD COLUMN poblacion VARCHAR(255) NOT NULL

CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE escuela (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    inicio_inscripcion DATE NOT NULL,
    fin_inscripcion DATE NOT NULL,
    edad_min INT,
    edad_max INT,
    categoria INT,
    FOREIGN KEY (categoria) REFERENCES categoria(id)
);

ALTER TABLE escuela
ADD COLUMN eliminado BOOLEAN NOT NULL DEFAULT false;


CREATE TABLE usuario_escuela (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escuela_id INT,
    usuario_id INT,
    FOREIGN KEY (escuela_id) REFERENCES escuela(id),
    FOREIGN KEY (usuario_id) REFERENCES Socios(id)
);
ALTER TABLE usuario_escuela
ADD COLUMN eliminado BOOLEAN NOT NULL DEFAULT false;







INSERT INTO Usuario (nombre_completo, username, contraseña, correo) VALUES ('Nombre Apellido', 'username123', 'contraseña123', 'correo@gmail.com');


INSERT INTO Socios (id,username, nombre, apellidos, direccion, codigoPostal, email, fNac, iban, socio, idTutor, fAlta, fBaja, alta)
VALUES
(1,'user1', 'Juan', 'Pérez García', 'Calle Falsa 123', '28080', 'juan.perez@example.com', '1980-05-15', 'ES7921000813610123456789', TRUE, NULL, '2020-01-01', NULL, TRUE),
(2,'user2', 'María', 'López Martínez', 'Avenida Siempre Viva 742', '28045', 'maria.lopez@example.com', '1990-03-22', 'ES7921000813610123456790', TRUE, 1, '2021-02-15', NULL, TRUE),
(3,'user3', 'Carlos', 'Sánchez Fernández', 'Plaza Mayor 3', '28013', 'carlos.sanchez@example.com', '1985-07-30', 'ES7921000813610123456791', TRUE, 1, '2019-06-10', NULL, TRUE),
(4,'user4', 'Ana', 'Gómez Rodríguez', 'Calle del Pez 10', '28004', 'ana.gomez@example.com', '1995-11-05', 'ES7921000813610123456792', TRUE, 2, '2022-04-25', NULL, TRUE),
(5,'user5', 'David', 'Martín Ruiz', 'Gran Vía 20', '28013', 'david.martin@example.com', '1988-02-14', 'ES7921000813610123456793', TRUE, 3, '2021-09-30', NULL, TRUE),
(6,'user6', 'Lucía', 'Hernández Gómez', 'Calle Atocha 100', '28012', 'lucia.hernandez@example.com', '1992-12-01', 'ES7921000813610123456794', TRUE, 4, '2023-01-10', NULL, TRUE),
(7,'user7', 'Miguel', 'Torres Ortiz', 'Paseo de la Castellana 50', '28046', 'miguel.torres@example.com', '1983-04-18', 'ES7921000813610123456795', TRUE, 2, '2020-05-05', NULL, TRUE),
(8,'user8', 'Laura', 'Ramírez Sánchez', 'Calle de Alcalá 123', '28009', 'laura.ramirez@example.com', '1998-09-21', 'ES7921000813610123456796', TRUE, 5, '2018-07-19', NULL, TRUE),
(9,'user9', 'Jorge', 'Molina Blanco', 'Calle Serrano 89', '28006', 'jorge.molina@example.com', '1987-11-30', 'ES7921000813610123456797', TRUE, 7, '2021-03-11', NULL, TRUE),
(10,'user10', 'Elena', 'Núñez Castillo', 'Calle de Velázquez 15', '28001', 'elena.nunez@example.com', '1993-08-25', 'ES7921000813610123456798', TRUE, 6, '2022-08-20', NULL, TRUE),
(11,'user11', 'Juan', 'García Pérez', 'Calle Mayor 20', '28002', 'juan.garcia@example.com', '1990-05-12', 'ES7921000813610123456799', TRUE, 7, '2022-08-21', NULL, TRUE),
(12,'user12', 'María', 'López Martínez', 'Calle Gran Vía 30', '28003', 'maria.lopez@example.com', '1988-12-04', 'ES7921000813610123456700', TRUE, 8, '2022-08-22', NULL, TRUE),
(13,'user13', 'Pedro', 'Fernández Sánchez', 'Calle Alcalá 25', '28004', 'pedro.fernandez@example.com', '1995-03-19', 'ES7921000813610123456701', TRUE, 9, '2022-08-23', NULL, TRUE),
(14,'user14', 'Ana', 'Martínez Rodríguez', 'Calle Serrano 40', '28005', 'ana.martinez@example.com', '1987-07-08', 'ES7921000813610123456702', TRUE, 10, '2022-08-24', NULL, TRUE),
(15,'user15', 'Carlos', 'Gómez Fernández', 'Calle Princesa 10', '28006', 'carlos.gomez@example.com', '1992-10-30', 'ES7921000813610123456703', TRUE, 11, '2022-08-25', NULL, TRUE),
(16,'user16', 'Laura', 'Díaz Gutiérrez', 'Calle Goya 35', '28007', 'laura.diaz@example.com', '1994-01-15', 'ES7921000813610123456704', TRUE, 12, '2022-08-26', NULL, TRUE),
(17,'user17', 'Pablo', 'Rodríguez López', 'Calle Atocha 22', '28008', 'pablo.rodriguez@example.com', '1991-09-03', 'ES7921000813610123456705', TRUE, 13, '2022-08-27', NULL, TRUE),
(18,'user18', 'Carmen', 'Hernández Pérez', 'Calle Sol 45', '28009', 'carmen.hernandez@example.com', '1996-06-21', 'ES7921000813610123456706', TRUE, 14, '2022-08-28', NULL, TRUE),
(19,'user19', 'Daniel', 'Sánchez Gómez', 'Calle Preciados 5', '28010', 'daniel.sanchez@example.com', '1989-04-17', 'ES7921000813610123456707', TRUE, 15, '2022-08-29', NULL, TRUE),
(20,'user20', 'Sara', 'Gutiérrez Martínez', 'Calle Fuencarral 12', '28011', 'sara.gutierrez@example.com', '1993-11-10', 'ES7921000813610123456708', TRUE, 16, '2022-08-30', NULL, TRUE);
(21,'user21', 'Miguel', 'Fernández García', 'Calle Gran Vía 50', '28012', 'miguel.fernandez@example.com', '1990-08-15', 'ES7921000813610123456709', TRUE, 17, '2022-09-01', NULL, TRUE),
(22,'user22', 'Eva', 'López Sánchez', 'Calle Alcalá 30', '28013', 'eva.lopez@example.com', '1985-03-27', 'ES7921000813610123456710', TRUE, 18, '2022-09-02', NULL, TRUE),
(23,'user23', 'Javier', 'Martínez Ruiz', 'Calle Mayor 35', '28014', 'javier.martinez@example.com', '1997-01-08', 'ES7921000813610123456711', TRUE, 19, '2022-09-03', NULL, TRUE),
(24,'user24', 'Isabel', 'Gómez Rodríguez', 'Calle Atocha 40', '28015', 'isabel.gomez@example.com', '1992-06-03', 'ES7921000813610123456712', TRUE, 20, '2022-09-04', NULL, TRUE),
(25,'user25', 'Francisco', 'Díaz Martínez', 'Calle Sol 55', '28016', 'francisco.diaz@example.com', '1988-09-20', 'ES7921000813610123456713', TRUE, 21, '2022-09-05', NULL, TRUE),
(26,'user26', 'Sofía', 'Hernández López', 'Calle Gran Vía 60', '28017', 'sofia.hernandez@example.com', '1995-12-12', 'ES7921000813610123456714', TRUE, 22, '2022-09-06', NULL, TRUE),
(27,'user27', 'Alejandro', 'Pérez Gómez', 'Calle Alcalá 35', '28018', 'alejandro.perez@example.com', '1993-02-28', 'ES7921000813610123456715', TRUE, 23, '2022-09-07', NULL, TRUE),
(28,'user28', 'Lucía', 'García Martínez', 'Calle Mayor 40', '28019', 'lucia.garcia@example.com', '1990-07-17', 'ES7921000813610123456716', TRUE, 24, '2022-09-08', NULL, TRUE),
(29,'user29', 'Jorge', 'Fernández López', 'Calle Atocha 45', '28020', 'jorge.fernandez@example.com', '1987-04-11', 'ES7921000813610123456717', TRUE, 25, '2022-09-09', NULL, TRUE),
(30,'user30', 'Andrea', 'Martínez Sánchez', 'Calle Gran Vía 70', '28021', 'andrea.martinez@example.com', '1991-11-25', 'ES7921000813610123456718', TRUE, 26, '2022-09-10', NULL, TRUE);


INSERT INTO categoria (nombre) VALUES ('Natación');
INSERT INTO categoria (nombre) VALUES ('Fútbol');
INSERT INTO categoria (nombre) VALUES ('Baloncesto');
INSERT INTO categoria (nombre) VALUES ('Tenis');
INSERT INTO categoria (nombre) VALUES ('Atletismo');
INSERT INTO categoria (nombre) VALUES ('Voleibol');
INSERT INTO categoria (nombre) VALUES ('Gimnasia');
INSERT INTO categoria (nombre) VALUES ('Karate');
INSERT INTO categoria (nombre) VALUES ('Judo');
INSERT INTO categoria (nombre) VALUES ('Ciclismo');
INSERT INTO categoria (nombre) VALUES ('Boxeo');
INSERT INTO categoria (nombre) VALUES ('Esgrima');
INSERT INTO categoria (nombre) VALUES ('Rugby');
INSERT INTO categoria (nombre) VALUES ('Hockey');
INSERT INTO categoria (nombre) VALUES ('Escalada');
INSERT INTO categoria (nombre) VALUES ('Remo');
INSERT INTO categoria (nombre) VALUES ('Patinaje');
INSERT INTO categoria (nombre) VALUES ('Bádminton');
INSERT INTO categoria (nombre) VALUES ('Golf');
INSERT INTO categoria (nombre) VALUES ('Surf');


INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Escuela de Natación', '2024-07-01', '2024-07-31', '2024-06-01', '2024-06-30', 6, 12, 1);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Academia de Fútbol', '2024-08-01', '2024-08-31', '2024-07-01', '2024-07-31', 8, 15, 2);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Club de Baloncesto', '2024-09-01', '2024-09-30', '2024-08-01', '2024-08-31', 10, 16, 3);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Escuela de Tenis', '2024-10-01', '2024-10-31', '2024-09-01', '2024-09-30', 7, 14, 4);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Centro de Atletismo', '2024-11-01', '2024-11-30', '2024-10-01', '2024-10-31', 12, 18, 5);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Academia de Voleibol', '2024-12-01', '2024-12-31', '2024-11-01', '2024-11-30', 9, 16, 6);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Gimnasio Infantil', '2024-06-01', '2024-06-30', '2024-05-01', '2024-05-31', 4, 10, 7);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Dojo de Karate', '2024-07-15', '2024-08-15', '2024-06-15', '2024-07-14', 8, 14, 8);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Academia de Judo', '2024-08-01', '2024-08-31', '2024-07-01', '2024-07-31', 7, 13, 9);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Escuela de Ciclismo', '2024-09-01', '2024-09-30', '2024-08-01', '2024-08-31', 10, 17, 10);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Club de Boxeo', '2024-10-01', '2024-10-31', '2024-09-01', '2024-09-30', 14, 18, 11);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Escuela de Esgrima', '2024-11-01', '2024-11-30', '2024-10-01', '2024-10-31', 12, 18, 12);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Academia de Rugby', '2024-12-01', '2024-12-31', '2024-11-01', '2024-11-30', 10, 16, 13);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Escuela de Hockey', '2024-06-01', '2024-06-30', '2024-05-01', '2024-05-31', 8, 14, 14);

INSERT INTO escuela (nombre, fecha_inicio, fecha_fin, inicio_inscripcion, fin_inscripcion, edad_min, edad_max, categoria)
VALUES ('Centro de Escalada', '2024-07-01', '2024-07-31', '2024-06-01', '2024-06-30', 9, 15, 15);


INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (1, 1); 
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (1, 2); 
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (2, 3); 
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (2, 4); 
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (3, 5); 
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (3, 6); 
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (4, 7); 
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (4, 8); 
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (5, 9); 
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (5, 10);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (6, 11);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (6, 12);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (7, 13);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (7, 14);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (8, 15);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (8, 16);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (9, 17);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (9, 18);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (10, 19);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (10, 20);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (11, 21);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (11, 22);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (12, 23);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (12, 24);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (13, 25);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (13, 26);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (14, 27);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (14, 28);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (15, 29);
INSERT INTO usuario_escuela (escuela_id, usuario_id) VALUES (15, 30);