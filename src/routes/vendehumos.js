const { Router } = require('express');
const db = require('../db');
const { VALORES_CATEGORIA } = require('../models/categorias');

const router = Router();

const insertStmt = db.prepare(`
  INSERT INTO vendehumos (nombre, foto_url, categoria, descripcion, num_votos)
  VALUES (@nombre, @fotoUrl, @categoria, @descripcion, @numVotos)
`);

const findByIdStmt = db.prepare('SELECT * FROM vendehumos WHERE id = ?');

function toDto(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    fotoUrl: row.foto_url,
    categoria: row.categoria,
    descripcion: row.descripcion,
    numVotos: row.num_votos,
  };
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validar(body) {
  const errores = [];
  const { nombre, fotoUrl, categoria, descripcion, numVotos } = body || {};

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push('nombre es obligatorio y debe ser un texto no vacío');
  }
  if (fotoUrl !== undefined && fotoUrl !== null && (typeof fotoUrl !== 'string' || !isValidUrl(fotoUrl))) {
    errores.push('fotoUrl debe ser una URL http(s) válida');
  }
  if (!VALORES_CATEGORIA.includes(categoria)) {
    errores.push(`categoria debe ser uno de: ${VALORES_CATEGORIA.join(', ')}`);
  }
  if (descripcion !== undefined && descripcion !== null && typeof descripcion !== 'string') {
    errores.push('descripcion debe ser un texto');
  }
  if (numVotos !== undefined && (!Number.isInteger(numVotos) || numVotos < 0)) {
    errores.push('numVotos debe ser un entero mayor o igual que 0');
  }

  return errores;
}

// POST /vendehumos -> crea un vendehumo
router.post('/', (req, res) => {
  const errores = validar(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos no válidos', detalles: errores });
  }

  const { nombre, fotoUrl, categoria, descripcion, numVotos } = req.body;
  const result = insertStmt.run({
    nombre: nombre.trim(),
    fotoUrl: fotoUrl ?? null,
    categoria,
    descripcion: descripcion ?? null,
    numVotos: numVotos ?? 0,
  });

  const creado = toDto(findByIdStmt.get(result.lastInsertRowid));
  res.status(201).location(`/vendehumos/${creado.id}`).json(creado);
});

module.exports = router;
