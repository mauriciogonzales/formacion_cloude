const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { VALORES_CATEGORIA } = require('./models/categorias');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'vendehumos.db');

if (DB_PATH !== ':memory:') {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const categoriasSql = VALORES_CATEGORIA.map((c) => `'${c}'`).join(', ');

db.exec(`
  CREATE TABLE IF NOT EXISTS vendehumos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    foto_url    TEXT,
    categoria   TEXT    NOT NULL CHECK (categoria IN (${categoriasSql})),
    descripcion TEXT,
    num_votos   INTEGER NOT NULL DEFAULT 0 CHECK (num_votos >= 0)
  )
`);

module.exports = db;
