const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./financeiro.db');

db.serialize(() => {
  // Tabela de usuários (atualizada com novos campos)
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    nascimento TEXT NOT NULL,
    renda REAL NOT NULL,
    profissao TEXT NOT NULL,
    objetivo TEXT NOT NULL,
    telefone TEXT,
    endereco TEXT,
    estado_civil TEXT,
    cpf TEXT,
    rg TEXT,
    gasto TEXT,
    motivo_juntar TEXT,
    beneficio TEXT,
    reserva TEXT
  )`);

  // Tabela de gastos (nova)
  db.run(`CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valor REAL NOT NULL,
    categoria TEXT NOT NULL,
    descricao TEXT,
    data TEXT NOT NULL
  )`);
});


module.exports = db;
