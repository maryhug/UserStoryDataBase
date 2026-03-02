-- ================================================================
-- HISTORIA DE USUARIO - SEMANA 2
-- Sistema Académico: gestion_academica_universidad
-- PostgreSQL
-- ================================================================

-- TASK 1: CREACIÓN DE LA BASE DE DATOS Y TABLAS
CREATE DATABASE gestion_academica_universidad;

-- Conectar: \c gestion_academica_universidad  (en psql)

-- Tabla: docentes  (se crea ANTES que cursos porque cursos la referencia)
CREATE TABLE docentes (
    id_docente              SERIAL          PRIMARY KEY,
    nombre_completo         VARCHAR(150)    NOT NULL,
    correo_institucional    VARCHAR(150)    NOT NULL UNIQUE,
    departamento_academico  VARCHAR(100)    NOT NULL,
    anios_experiencia       INTEGER         NOT NULL CHECK (anios_experiencia >= 0)
);

-- Tabla: cursos
-- ON DELETE SET NULL → si se elimina un docente, el curso queda sin docente
--                       (no se pierde el curso, se puede reasignar)
CREATE TABLE cursos (
    id_curso    SERIAL          PRIMARY KEY,
    nombre      VARCHAR(150)    NOT NULL,
    codigo      VARCHAR(20)     NOT NULL UNIQUE,
    creditos    INTEGER         NOT NULL CHECK (creditos BETWEEN 1 AND 10),
    semestre    INTEGER         NOT NULL CHECK (semestre BETWEEN 1 AND 10),
    id_docente  INTEGER         REFERENCES docentes(id_docente) ON DELETE SET NULL
);

-- Tabla: estudiantes
CREATE TABLE estudiantes (
    id_estudiante       SERIAL          PRIMARY KEY,
    nombre_completo     VARCHAR(150)    NOT NULL,
    correo_electronico  VARCHAR(150)    NOT NULL UNIQUE,
    genero              CHAR(1)         NOT NULL CHECK (genero IN ('M', 'F', 'O')),
    identificacion      VARCHAR(20)     NOT NULL UNIQUE,
    carrera             VARCHAR(100)    NOT NULL,
    fecha_nacimiento    DATE            NOT NULL,
    fecha_ingreso       DATE            NOT NULL DEFAULT CURRENT_DATE
);

-- Tabla: inscripciones
-- ON DELETE CASCADE    → si se elimina un estudiante, sus inscripciones se eliminan
-- ON DELETE RESTRICT   → no se puede eliminar un curso que tenga inscripciones activas
-- calificacion_final puede ser NULL (aún no calificado)
CREATE TABLE inscripciones (
    id_inscripcion      SERIAL          PRIMARY KEY,
    id_estudiante       INTEGER         NOT NULL REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
    id_curso            INTEGER         NOT NULL REFERENCES cursos(id_curso) ON DELETE RESTRICT,
    fecha_inscripcion   DATE            NOT NULL DEFAULT CURRENT_DATE,
    calificacion_final  NUMERIC(4,2)    CHECK (calificacion_final BETWEEN 0.0 AND 5.0)
);

-- TASK 2: INSERCIÓN DE DATOS
-- 3 Docentes
INSERT INTO docentes (nombre_completo, correo_institucional, departamento_academico, anios_experiencia)
VALUES
    ('Carlos Ramírez Ospina',  'c.ramirez@univ.edu.co',  'Ingeniería de Sistemas',    10),
    ('Laura Gómez Restrepo',   'l.gomez@univ.edu.co',    'Matemáticas y Estadística',  4),
    ('Andrés Montoya Herrera', 'a.montoya@univ.edu.co',  'Ciencias Básicas',            7);

-- 4 Cursos
INSERT INTO cursos (nombre, codigo, creditos, semestre, id_docente)
VALUES
    ('Bases de Datos I',                  'BD101',  3, 3, 1),
    ('Cálculo Diferencial',               'MAT201', 4, 2, 2),
    ('Programación Orientada a Objetos',  'POO301', 3, 4, 1),
    ('Fundamentos de Física',             'FIS101', 3, 1, 3);

-- 5 Estudiantes
INSERT INTO estudiantes (nombre_completo, correo_electronico, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso)
VALUES
    ('María José Torres',    'mjtorres@est.edu.co',   'F', '1001234567', 'Ingeniería de Sistemas', '2003-05-14', '2022-01-20'),
    ('Juan Pablo Herrera',   'jpherrera@est.edu.co',  'M', '1002345678', 'Ingeniería de Sistemas', '2002-11-30', '2021-08-05'),
    ('Valeria Ruiz Salcedo', 'vruiz@est.edu.co',      'F', '1003456789', 'Matemáticas',            '2004-02-08', '2023-01-18'),
    ('Sebastián López',      'slopez@est.edu.co',     'M', '1004567890', 'Ingeniería Civil',       '2001-07-22', '2020-08-10'),
    ('Daniela Castillo',     'dcastillo@est.edu.co',  'F', '1005678901', 'Ingeniería de Sistemas', '2003-09-15', '2022-08-08');

-- 8 Inscripciones distribuidas
INSERT INTO inscripciones (id_estudiante, id_curso, fecha_inscripcion, calificacion_final)
VALUES
    (1, 1, '2024-01-22', 4.5),   -- María José   → BD101
    (1, 3, '2024-01-22', 3.8),   -- María José   → POO301
    (2, 1, '2024-01-23', 3.2),   -- Juan Pablo   → BD101
    (2, 2, '2024-01-23', 2.9),   -- Juan Pablo   → Cálculo
    (3, 2, '2024-01-24', 4.7),   -- Valeria      → Cálculo
    (4, 4, '2024-01-25', 3.0),   -- Sebastián    → Física
    (4, 1, '2024-01-25', 2.5),   -- Sebastián    → BD101
    (5, 3, '2024-01-26', 4.1);   -- Daniela      → POO301


-- TASK 3: CONSULTAS BÁSICAS Y MANIPULACIÓN

-- ── 3.1 Todos los estudiantes con sus inscripciones y cursos (INNER JOIN)
SELECT
    e.nombre_completo       AS estudiante,
    c.nombre                AS curso,
    c.semestre,
    i.fecha_inscripcion,
    i.calificacion_final
FROM inscripciones i
INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
INNER JOIN cursos c      ON i.id_curso      = c.id_curso
ORDER BY e.nombre_completo, c.semestre;

-- ── 3.2 Cursos de docentes con > 5 años de experiencia
SELECT
    c.nombre                AS curso,
    c.codigo,
    c.semestre,
    d.nombre_completo       AS docente,
    d.anios_experiencia
FROM cursos c
INNER JOIN docentes d ON c.id_docente = d.id_docente
WHERE d.anios_experiencia > 5
ORDER BY d.anios_experiencia DESC;

-- ── 3.3 Promedio de calificaciones por curso (GROUP BY + AVG)
SELECT
    c.nombre                            AS curso,
    COUNT(i.id_inscripcion)             AS total_inscritos,
    ROUND(AVG(i.calificacion_final), 2) AS promedio_calificacion
FROM cursos c
LEFT JOIN inscripciones i ON c.id_curso = i.id_curso
GROUP BY c.id_curso, c.nombre
ORDER BY promedio_calificacion DESC NULLS LAST;

-- ── 3.4 Estudiantes inscritos en más de un curso (HAVING COUNT > 1)
SELECT
    e.nombre_completo           AS estudiante,
    COUNT(i.id_inscripcion)     AS cantidad_cursos
FROM inscripciones i
INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
GROUP BY e.id_estudiante, e.nombre_completo
HAVING COUNT(i.id_inscripcion) > 1
ORDER BY cantidad_cursos DESC;

-- ── 3.5 ALTER TABLE: agregar columna estado_academico
ALTER TABLE estudiantes
ADD COLUMN estado_academico VARCHAR(20) NOT NULL DEFAULT 'activo'
    CHECK (estado_academico IN ('activo', 'inactivo', 'graduado', 'suspendido'));

-- ── 3.6 Eliminar un docente y observar efecto ON DELETE SET NULL
--    ANTES de eliminar: ver cursos asignados a Laura Gómez (id=2)
SELECT id_curso, nombre, id_docente FROM cursos WHERE id_docente = 2;

DELETE FROM docentes WHERE id_docente = 2;  -- Elimina: Laura Gómez

--    DESPUÉS: Cálculo Diferencial queda con id_docente = NULL
SELECT id_curso, nombre, id_docente FROM cursos WHERE codigo = 'MAT201';
-- Resultado esperado: id_docente = NULL  (el curso no se elimina, solo queda sin docente)

-- ── 3.7 Cursos con más de 2 estudiantes inscritos (GROUP BY + HAVING)
SELECT
    c.nombre                        AS curso,
    COUNT(i.id_inscripcion)         AS total_inscritos
FROM cursos c
INNER JOIN inscripciones i ON c.id_curso = i.id_curso
GROUP BY c.id_curso, c.nombre
HAVING COUNT(i.id_inscripcion) > 2
ORDER BY total_inscritos DESC;

-- TASK 4: SUBCONSULTAS Y FUNCIONES

-- ── 4.1 Estudiantes con promedio MAYOR al promedio general (subconsulta)
SELECT
    e.nombre_completo                           AS estudiante,
    ROUND(AVG(i.calificacion_final), 2)         AS promedio_personal,
    (SELECT ROUND(AVG(calificacion_final), 2)
     FROM inscripciones)                        AS promedio_general
FROM inscripciones i
INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
GROUP BY e.id_estudiante, e.nombre_completo
HAVING AVG(i.calificacion_final) > (
    SELECT AVG(calificacion_final) FROM inscripciones
)
ORDER BY promedio_personal DESC;

-- ── 4.2 Carreras cuyos estudiantes están en cursos de semestre >= 2 (EXISTS)
SELECT DISTINCT e.carrera
FROM estudiantes e
WHERE EXISTS (
    SELECT 1
    FROM inscripciones i
    INNER JOIN cursos c ON i.id_curso = c.id_curso
    WHERE i.id_estudiante = e.id_estudiante
      AND c.semestre >= 2
)
ORDER BY e.carrera;

-- ── 4.3 Indicadores generales con ROUND / SUM / MAX / MIN / COUNT
SELECT
    COUNT(DISTINCT e.id_estudiante)                 AS total_estudiantes,
    COUNT(DISTINCT c.id_curso)                      AS cursos_con_inscritos,
    COUNT(i.id_inscripcion)                         AS total_inscripciones,
    ROUND(AVG(i.calificacion_final), 2)             AS promedio_general,
    MAX(i.calificacion_final)                       AS nota_maxima,
    MIN(i.calificacion_final)                       AS nota_minima,
    SUM(c.creditos)                                 AS total_creditos_cursados
FROM inscripciones i
INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
INNER JOIN cursos c      ON i.id_curso      = c.id_curso;

-- TASK 5: VISTA — vista_historial_academico

CREATE OR REPLACE VIEW vista_historial_academico AS
SELECT
    e.nombre_completo       AS nombre_estudiante,
    c.nombre                AS nombre_curso,
    COALESCE(d.nombre_completo, 'Sin docente asignado') AS nombre_docente,
    c.semestre,
    i.calificacion_final
FROM inscripciones i
INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
INNER JOIN cursos c      ON i.id_curso      = c.id_curso
LEFT  JOIN docentes d    ON c.id_docente    = d.id_docente
ORDER BY e.nombre_completo, c.semestre;

-- Consultar la vista
SELECT * FROM vista_historial_academico;

-- TASK 6: CONTROL DE ACCESO Y TRANSACCIONES

-- ── 6.1 Crear el rol
CREATE ROLE revisor_academico;

-- ── 6.2 Otorgar SOLO LECTURA sobre la vista
GRANT SELECT ON vista_historial_academico TO revisor_academico;

-- ── 6.3 Revocar permisos de modificación en inscripciones
REVOKE INSERT, UPDATE, DELETE ON inscripciones FROM revisor_academico;

-- ── 6.4 Transacción con BEGIN / SAVEPOINT / ROLLBACK / COMMIT
--    Escenario: actualizar notas con posibilidad de deshacer cambios parciales

BEGIN;

    -- Cambio 1: actualizar nota de María José en BD101
    UPDATE inscripciones
    SET calificacion_final = 4.8
    WHERE id_estudiante = 1 AND id_curso = 1;

    SAVEPOINT sp_nota_maria;   -- Punto de guardado seguro

    -- Cambio 2: actualizar nota de Juan Pablo en BD101
    UPDATE inscripciones
    SET calificacion_final = 1.5   -- Supuesto error: nota muy baja
    WHERE id_estudiante = 2 AND id_curso = 1;

    -- Verificar antes de decidir
    SELECT id_inscripcion, id_estudiante, id_curso, calificacion_final
    FROM inscripciones WHERE id_curso = 1;

    -- Se decide deshacer SOLO el cambio de Juan Pablo, conservar el de María
    ROLLBACK TO SAVEPOINT sp_nota_maria;

    -- Confirmar el cambio de María José
COMMIT;

-- Verificar resultado final en la vista
SELECT * FROM vista_historial_academico;