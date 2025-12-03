const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/cadastro', (req, res) => {
  const { nome, email, senha, nascimento, renda, profissao, objetivo, telefone, endereco, estado_civil, cpf, rg, gasto, motivo_juntar, beneficio, reserva } = req.body;

  if (!nome || !email || !senha || !nascimento || !renda || !profissao || !objetivo || !telefone || !endereco || !estado_civil || !cpf || !gasto || !motivo_juntar || !beneficio || !reserva) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  const query = `INSERT INTO usuarios (nome, email, senha, nascimento, renda, profissao, objetivo, telefone, endereco, estado_civil, cpf, rg, gasto, motivo_juntar, beneficio, reserva)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [nome, email, senha, nascimento, renda, profissao, objetivo, telefone, endereco, estado_civil, cpf, rg, gasto, motivo_juntar, beneficio, reserva], function (err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
    }
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id: this.lastID });
  });
});

// Novo endpoint para obter todos os usuários (para o dashboard do administrador)
router.get('/usuarios', (req, res) => {
  const query = `SELECT nome, email, telefone, profissao, renda, reserva, motivo_juntar, objetivo, beneficio, estado_civil, endereco, cpf, rg, nascimento, gasto FROM usuarios`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
    }
    res.status(200).json(rows);
  });
});

// Novo endpoint para obter a receita total dos usuários
router.get('/receita-total', (req, res) => {
  const query = `SELECT SUM(renda) as total FROM usuarios`;

  db.get(query, [], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao calcular receita total.' });
    }
    res.status(200).json({ total: row.total || 0 });
  });
});

module.exports = router;
