// ================================================================
// HISTORIA DE USUARIO - SEMANA 3
// StreamHub — Gestión de contenido y usuarios en MongoDB
// Motor: MongoDB 6+
// Ejecutar en: mongosh o MongoDB Compass
// ================================================================

// ── Seleccionar / crear la base de datos
use("streamhub");


// TASK 1 — DISEÑO DE COLECCIONES (documentación en comentarios)

// COLECCIONES DEFINIDAS:
//
// 1. usuarios       → datos del perfil + historial de vistas embebido
//                     (embed porque historial siempre se consulta con el usuario)
//
// 2. peliculas      → catálogo de películas + reseñas embebidas
//                     (embed porque las reseñas raramente se consultan solas)
//
// 3. series         → catálogo de series con detalle de temporadas
//
// 4. valoraciones   → colección separada para calificaciones
//                     (separada porque se agregan con frecuencia por usuario Y por contenido)
//
// 5. listas         → listas personalizadas del usuario con referencias a contenido
//
// DECISIÓN EMBED vs REFERENCIA:
//   • Embed  → datos que siempre se leen juntos (historial del usuario, reseñas de película)
//   • Ref    → datos que se consultan de forma independiente (valoraciones)

// TASK 2 — INSERCIÓN DE DATOS

// ── Limpiar colecciones para pruebas repetibles
db.usuarios.drop();
db.peliculas.drop();
db.series.drop();
db.valoraciones.drop();
db.listas.drop();


// ── 2.1 Insertar películas (insertMany)
db.peliculas.insertMany([
  {
    titulo: "Origen",
    genero: ["ciencia ficción", "acción", "thriller"],
    duracion_min: 148,
    anio: 2010,
    director: "Christopher Nolan",
    reparto: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    idioma: "inglés",
    calificacion_promedio: 4.8,
    total_valoraciones: 4200,
    disponible: true,
    resenias: [
      { usuario: "carlos_r", puntuacion: 5, comentario: "Obra maestra del cine moderno", fecha: new Date("2024-01-10") },
      { usuario: "laura_g",  puntuacion: 4, comentario: "Muy buena, algo confusa al inicio", fecha: new Date("2024-02-03") }
    ]
  },
  {
    titulo: "Parásitos",
    genero: ["drama", "thriller", "comedia negra"],
    duracion_min: 132,
    anio: 2019,
    director: "Bong Joon-ho",
    reparto: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    idioma: "coreano",
    calificacion_promedio: 4.9,
    total_valoraciones: 3800,
    disponible: true,
    resenias: [
      { usuario: "valeria_r", puntuacion: 5, comentario: "Increíble narrativa y fotografía", fecha: new Date("2024-03-15") }
    ]
  },
  {
    titulo: "Dune: Parte Dos",
    genero: ["ciencia ficción", "aventura", "drama"],
    duracion_min: 166,
    anio: 2024,
    director: "Denis Villeneuve",
    reparto: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    idioma: "inglés",
    calificacion_promedio: 4.7,
    total_valoraciones: 2900,
    disponible: true,
    resenias: [
      { usuario: "sebas_lopez", puntuacion: 5, comentario: "Visual y narrativamente perfecta", fecha: new Date("2024-05-20") },
      { usuario: "daniela_c",  puntuacion: 4, comentario: "Excelente, aunque larga", fecha: new Date("2024-05-22") }
    ]
  },
  {
    titulo: "El Conjuro",
    genero: ["terror", "thriller"],
    duracion_min: 112,
    anio: 2013,
    director: "James Wan",
    reparto: ["Vera Farmiga", "Patrick Wilson"],
    idioma: "inglés",
    calificacion_promedio: 4.2,
    total_valoraciones: 3100,
    disponible: true,
    resenias: []
  },
  {
    titulo: "Soul",
    genero: ["animación", "comedia", "drama"],
    duracion_min: 100,
    anio: 2020,
    director: "Pete Docter",
    reparto: ["Jamie Foxx", "Tina Fey"],
    idioma: "inglés",
    calificacion_promedio: 4.6,
    total_valoraciones: 2500,
    disponible: false,
    resenias: [
      { usuario: "carlos_r", puntuacion: 5, comentario: "Una joya de Pixar", fecha: new Date("2024-04-01") }
    ]
  }
]);


// ── 2.2 Insertar series (insertMany)
db.series.insertMany([
  {
    titulo: "Breaking Bad",
    genero: ["drama", "crimen", "thriller"],
    temporadas: 5,
    episodios_totales: 62,
    duracion_ep_min: 47,
    anio_inicio: 2008,
    anio_fin: 2013,
    estado: "finalizada",
    calificacion_promedio: 4.9,
    total_valoraciones: 8100,
    disponible: true,
    creador: "Vince Gilligan"
  },
  {
    titulo: "Stranger Things",
    genero: ["ciencia ficción", "terror", "drama"],
    temporadas: 4,
    episodios_totales: 42,
    duracion_ep_min: 51,
    anio_inicio: 2016,
    anio_fin: null,
    estado: "en emisión",
    calificacion_promedio: 4.7,
    total_valoraciones: 6500,
    disponible: true,
    creador: "Los Hermanos Duffer"
  },
  {
    titulo: "Euphoria",
    genero: ["drama", "romance"],
    temporadas: 2,
    episodios_totales: 16,
    duracion_ep_min: 55,
    anio_inicio: 2019,
    anio_fin: null,
    estado: "en emisión",
    calificacion_promedio: 4.3,
    total_valoraciones: 4200,
    disponible: true,
    creador: "Sam Levinson"
  }
]);


// ── 2.3 Insertar usuarios (insertMany) con historial embebido
db.usuarios.insertMany([
  {
    nombre: "Carlos Ramírez",
    email: "carlos_r@streamhub.com",
    plan: "premium",
    fecha_registro: new Date("2023-01-15"),
    activo: true,
    preferencias: ["ciencia ficción", "thriller", "animación"],
    historial: [
      { titulo: "Origen",           tipo: "pelicula", fecha_vista: new Date("2024-01-10"), completado: true,  minutos_vistos: 148 },
      { titulo: "Breaking Bad",     tipo: "serie",    fecha_vista: new Date("2024-02-01"), completado: true,  minutos_vistos: 2914 },
      { titulo: "Soul",             tipo: "pelicula", fecha_vista: new Date("2024-04-01"), completado: true,  minutos_vistos: 100 },
      { titulo: "Dune: Parte Dos",  tipo: "pelicula", fecha_vista: new Date("2024-05-20"), completado: false, minutos_vistos: 90 },
      { titulo: "Stranger Things",  tipo: "serie",    fecha_vista: new Date("2024-06-10"), completado: false, minutos_vistos: 300 },
      { titulo: "Parásitos",        tipo: "pelicula", fecha_vista: new Date("2024-07-05"), completado: true,  minutos_vistos: 132 }
    ]
  },
  {
    nombre: "Laura Gómez",
    email: "laura_g@streamhub.com",
    plan: "estándar",
    fecha_registro: new Date("2023-03-20"),
    activo: true,
    preferencias: ["drama", "romance", "comedia"],
    historial: [
      { titulo: "Parásitos",     tipo: "pelicula", fecha_vista: new Date("2024-02-03"), completado: true,  minutos_vistos: 132 },
      { titulo: "Euphoria",      tipo: "serie",    fecha_vista: new Date("2024-03-01"), completado: false, minutos_vistos: 220 },
      { titulo: "Origen",        tipo: "pelicula", fecha_vista: new Date("2024-04-10"), completado: true,  minutos_vistos: 148 }
    ]
  },
  {
    nombre: "Valeria Ruiz",
    email: "valeria_r@streamhub.com",
    plan: "premium",
    fecha_registro: new Date("2022-11-05"),
    activo: true,
    preferencias: ["thriller", "ciencia ficción", "terror"],
    historial: [
      { titulo: "Parásitos",        tipo: "pelicula", fecha_vista: new Date("2024-03-15"), completado: true,  minutos_vistos: 132 },
      { titulo: "El Conjuro",       tipo: "pelicula", fecha_vista: new Date("2024-04-20"), completado: true,  minutos_vistos: 112 },
      { titulo: "Breaking Bad",     tipo: "serie",    fecha_vista: new Date("2024-05-01"), completado: false, minutos_vistos: 1500 },
      { titulo: "Dune: Parte Dos",  tipo: "pelicula", fecha_vista: new Date("2024-06-18"), completado: true,  minutos_vistos: 166 },
      { titulo: "Stranger Things",  tipo: "serie",    fecha_vista: new Date("2024-07-10"), completado: true,  minutos_vistos: 2142 },
      { titulo: "Origen",           tipo: "pelicula", fecha_vista: new Date("2024-08-01"), completado: true,  minutos_vistos: 148 }
    ]
  },
  {
    nombre: "Sebastián López",
    email: "sebas_lopez@streamhub.com",
    plan: "básico",
    fecha_registro: new Date("2024-01-10"),
    activo: true,
    preferencias: ["acción", "aventura", "ciencia ficción"],
    historial: [
      { titulo: "Dune: Parte Dos", tipo: "pelicula", fecha_vista: new Date("2024-05-20"), completado: true,  minutos_vistos: 166 },
      { titulo: "Origen",          tipo: "pelicula", fecha_vista: new Date("2024-06-05"), completado: false, minutos_vistos: 60 }
    ]
  },
  {
    nombre: "Daniela Castillo",
    email: "daniela_c@streamhub.com",
    plan: "estándar",
    fecha_registro: new Date("2023-07-22"),
    activo: false,
    preferencias: ["animación", "comedia", "drama"],
    historial: [
      { titulo: "Soul",          tipo: "pelicula", fecha_vista: new Date("2024-01-30"), completado: true,  minutos_vistos: 100 },
      { titulo: "Dune: Parte Dos", tipo: "pelicula", fecha_vista: new Date("2024-05-22"), completado: false, minutos_vistos: 45 },
      { titulo: "Euphoria",      tipo: "serie",    fecha_vista: new Date("2024-06-01"), completado: false, minutos_vistos: 165 }
    ]
  }
]);


// ── 2.4 Insertar valoraciones (colección separada)
db.valoraciones.insertMany([
  { nombre_usuario: "carlos_r",   titulo_contenido: "Origen",          tipo: "pelicula", puntuacion: 5, comentario: "Obra maestra",                     fecha: new Date("2024-01-10"), likes: 24 },
  { nombre_usuario: "carlos_r",   titulo_contenido: "Breaking Bad",    tipo: "serie",    puntuacion: 5, comentario: "La mejor serie de todos los tiempos", fecha: new Date("2024-02-15"), likes: 41 },
  { nombre_usuario: "laura_g",    titulo_contenido: "Parásitos",       tipo: "pelicula", puntuacion: 5, comentario: "Absolutamente brillante",           fecha: new Date("2024-02-03"), likes: 18 },
  { nombre_usuario: "laura_g",    titulo_contenido: "Origen",          tipo: "pelicula", puntuacion: 4, comentario: "Muy buena, algo confusa",           fecha: new Date("2024-04-10"), likes: 7  },
  { nombre_usuario: "valeria_r",  titulo_contenido: "Parásitos",       tipo: "pelicula", puntuacion: 5, comentario: "Cinematografía increíble",          fecha: new Date("2024-03-15"), likes: 30 },
  { nombre_usuario: "valeria_r",  titulo_contenido: "El Conjuro",      tipo: "pelicula", puntuacion: 4, comentario: "Muy tensa, me gustó",               fecha: new Date("2024-04-20"), likes: 12 },
  { nombre_usuario: "sebas_lopez", titulo_contenido: "Dune: Parte Dos", tipo: "pelicula", puntuacion: 5, comentario: "Épica visualmente",                fecha: new Date("2024-05-20"), likes: 19 },
  { nombre_usuario: "daniela_c",  titulo_contenido: "Dune: Parte Dos", tipo: "pelicula", puntuacion: 4, comentario: "Excelente, aunque larga",           fecha: new Date("2024-05-22"), likes: 9  }
]);


// ── 2.5 Insertar listas personalizadas (insertOne)
db.listas.insertOne({
  nombre_usuario: "carlos_r",
  nombre_lista: "Mis favoritas de Nolan",
  privada: false,
  fecha_creacion: new Date("2024-06-01"),
  contenidos: [
    { titulo: "Origen", tipo: "pelicula", fecha_agregado: new Date("2024-06-01") },
    { titulo: "Dune: Parte Dos", tipo: "pelicula", fecha_agregado: new Date("2024-06-02") }
  ]
});

// TASK 3 — CONSULTAS CON OPERADORES

// ── 3.1 Películas con duración > 120 minutos ($gt)
db.peliculas.find(
  { duracion_min: { $gt: 120 } },
  { titulo: 1, duracion_min: 1, genero: 1, _id: 0 }
);

// ── 3.2 Películas disponibles con calificación >= 4.5 ($gte + $eq)
db.peliculas.find(
  { disponible: { $eq: true }, calificacion_promedio: { $gte: 4.5 } },
  { titulo: 1, calificacion_promedio: 1, _id: 0 }
);

// ── 3.3 Series finalizadas o con calificación > 4.5 ($or)
db.series.find({
  $or: [
    { estado: { $eq: "finalizada" } },
    { calificacion_promedio: { $gt: 4.5 } }
  ]
}, { titulo: 1, estado: 1, calificacion_promedio: 1, _id: 0 });

// ── 3.4 Contenido de géneros específicos ($in)
db.peliculas.find(
  { genero: { $in: ["terror", "thriller"] } },
  { titulo: 1, genero: 1, duracion_min: 1, _id: 0 }
);

// ── 3.5 Buscar por título con $regex (búsqueda parcial, insensible a mayúsculas)
db.peliculas.find(
  { titulo: { $regex: "dune", $options: "i" } },
  { titulo: 1, anio: 1, _id: 0 }
);

// ── 3.6 Usuarios en plan premium con más de 5 contenidos en historial ($and + $size)
//    NOTA: $gt sobre arrays usa $expr + $size en MongoDB 6+
db.usuarios.find({
  $and: [
    { plan: { $eq: "premium" } },
    { $expr: { $gt: [{ $size: "$historial" }, 5] } }
  ]
}, { nombre: 1, plan: 1, _id: 0 });

// ── 3.7 Películas entre 100 y 150 minutos ($gte + $lte combinados)
db.peliculas.find(
  { duracion_min: { $gte: 100, $lte: 150 } },
  { titulo: 1, duracion_min: 1, _id: 0 }
);

// ── 3.8 Valoraciones con puntuación < 5 y con likes > 10 ($lt + $gt + $and)
db.valoraciones.find({
  $and: [
    { puntuacion: { $lt: 5 } },
    { likes: { $gt: 10 } }
  ]
}, { nombre_usuario: 1, titulo_contenido: 1, puntuacion: 1, likes: 1, _id: 0 });


// TASK 4 — ACTUALIZACIONES Y ELIMINACIONES

// ── 4.1 updateOne — actualizar calificación de una película
db.peliculas.updateOne(
  { titulo: "Soul" },
  {
    $set:  { calificacion_promedio: 4.7 },
    $inc:  { total_valoraciones: 1 }
  }
);

// ── 4.2 updateOne — agregar reseña al array de una película ($push)
db.peliculas.updateOne(
  { titulo: "El Conjuro" },
  {
    $push: {
      resenias: {
        usuario: "sebas_lopez",
        puntuacion: 4,
        comentario: "Muy buena para los amantes del terror",
        fecha: new Date()
      }
    }
  }
);

// ── 4.3 updateMany — marcar como no disponible películas anteriores a 2015
db.peliculas.updateMany(
  { anio: { $lt: 2015 } },
  { $set: { disponible: false } }
);

// ── 4.4 updateOne — agregar entrada al historial de un usuario ($push)
db.usuarios.updateOne(
  { email: "sebas_lopez@streamhub.com" },
  {
    $push: {
      historial: {
        titulo: "Breaking Bad",
        tipo: "serie",
        fecha_vista: new Date(),
        completado: false,
        minutos_vistos: 47
      }
    }
  }
);

// ── 4.5 updateMany — reactivar todos los usuarios inactivos del plan básico
db.usuarios.updateMany(
  { activo: { $eq: false }, plan: { $eq: "básico" } },
  { $set: { activo: true } }
);

// ── 4.6 deleteOne — eliminar una valoración específica
db.valoraciones.deleteOne(
  { nombre_usuario: "daniela_c", titulo_contenido: "Dune: Parte Dos" }
);

// ── 4.7 deleteMany — eliminar valoraciones con 0 likes
db.valoraciones.deleteMany(
  { likes: { $eq: 0 } }
);

// TASK 5 — ÍNDICES PARA PERFORMANCE

// ── 5.1 Índice simple en título de películas (consultas por nombre)
//    Justificación: la búsqueda por título es la más frecuente en un streaming
db.peliculas.createIndex(
  { titulo: 1 },
  { name: "idx_peliculas_titulo", unique: false }
);

// ── 5.2 Índice en género de películas (filtros por categoría)
//    Justificación: los usuarios filtran contenido por género constantemente
db.peliculas.createIndex(
  { genero: 1 },
  { name: "idx_peliculas_genero" }
);

// ── 5.3 Índice compuesto: disponible + calificacion_promedio
//    Justificación: consulta más común = "películas disponibles ordenadas por nota"
db.peliculas.createIndex(
  { disponible: 1, calificacion_promedio: -1 },
  { name: "idx_peliculas_disponible_calificacion" }
);

// ── 5.4 Índice en email de usuarios (login y búsqueda de perfil)
//    Justificación: email es el identificador de acceso, único y consultado siempre
db.usuarios.createIndex(
  { email: 1 },
  { name: "idx_usuarios_email", unique: true }
);

// ── 5.5 Índice de texto en título (soporte para búsqueda tipo $regex optimizada)
//    Justificación: permite búsqueda full-text eficiente en lugar de regex simple
db.peliculas.createIndex(
  { titulo: "text", director: "text" },
  { name: "idx_peliculas_texto" }
);

// ── 5.6 Índice en nombre_usuario de valoraciones
//    Justificación: se consultan las valoraciones de un usuario frecuentemente
db.valoraciones.createIndex(
  { nombre_usuario: 1 },
  { name: "idx_valoraciones_usuario" }
);

// ── Verificar TODOS los índices creados
db.peliculas.getIndexes();
db.usuarios.getIndexes();
db.valoraciones.getIndexes();


// TASK 6 — AGREGACIONES (pipelines)

// ── PIPELINE 1: Top películas por calificación con total de reseñas
//    Operadores: $match, $project, $sort, $limit
db.peliculas.aggregate([
  { $match: { disponible: true } },                         // solo disponibles
  { $project: {
      titulo: 1,
      calificacion_promedio: 1,
      total_valoraciones: 1,
      cantidad_resenias: { $size: "$resenias" },            // contar reseñas embebidas
      _id: 0
  }},
  { $sort: { calificacion_promedio: -1 } },                 // mayor calificación primero
  { $limit: 5 }
]);


// ── PIPELINE 2: Promedio de puntuación por tipo de contenido (película vs serie)
//    Operadores: $group, $avg, $sum, $sort
db.valoraciones.aggregate([
  { $group: {
      _id: "$tipo",
      promedio_puntuacion: { $avg: "$puntuacion" },
      total_valoraciones:  { $sum: 1 },
      total_likes:         { $sum: "$likes" }
  }},
  { $sort: { promedio_puntuacion: -1 } },
  { $project: {
      tipo: "$_id",
      promedio_puntuacion: { $round: ["$promedio_puntuacion", 2] },
      total_valoraciones: 1,
      total_likes: 1,
      _id: 0
  }}
]);


// ── PIPELINE 3: Usuarios más activos (por cantidad de contenidos vistos)
//    Operadores: $project, $addFields, $sort — usando $size sobre array historial
db.usuarios.aggregate([
  { $project: {
      nombre: 1,
      plan: 1,
      email: 1,
      contenidos_vistos: { $size: "$historial" },
      _id: 0
  }},
  { $sort: { contenidos_vistos: -1 } },
  { $limit: 5 }
]);


// ── PIPELINE 4: Géneros más populares en el historial de usuarios
//    Operadores: $unwind (desanida el array historial), $group, $sort
//    Nota: usamos peliculas para expandir géneros
db.peliculas.aggregate([
  { $unwind: "$genero" },                                   // desanidar array de géneros
  { $group: {
      _id: "$genero",
      total_peliculas:    { $sum: 1 },
      promedio_calif:     { $avg: "$calificacion_promedio" },
      max_calificacion:   { $max: "$calificacion_promedio" },
      min_calificacion:   { $min: "$calificacion_promedio" }
  }},
  { $sort: { total_peliculas: -1, promedio_calif: -1 } },
  { $project: {
      genero: "$_id",
      total_peliculas: 1,
      promedio_calif: { $round: ["$promedio_calif", 2] },
      max_calificacion: 1,
      min_calificacion: 1,
      _id: 0
  }}
]);


// ── PIPELINE 5: Reseñas detalladas expandidas desde películas ($unwind en embebidos)
//    Operadores: $unwind, $match, $project, $sort
db.peliculas.aggregate([
  { $unwind: "$resenias" },                                 // desanidar array de reseñas embebidas
  { $match: { "resenias.puntuacion": { $gte: 4 } } },       // solo reseñas positivas
  { $project: {
      titulo_pelicula: "$titulo",
      reviewAutor:     "$resenias.usuario",
      puntuacion:      "$resenias.puntuacion",
      comentario:      "$resenias.comentario",
      fecha:           "$resenias.fecha",
      _id: 0
  }},
  { $sort: { puntuacion: -1, fecha: -1 } }
]);