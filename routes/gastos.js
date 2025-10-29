const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/gasto', (req, res) => {
  const { valor, categoria, descricao, data } = req.body;

  if (!valor || !categoria || !data) {
    return res.status(400).json({ erro: 'Preencha os campos obrigatórios.' });
  }

  const query = `INSERT INTO gastos (valor, categoria, descricao, data)
                 VALUES (?, ?, ?, ?)`;

  db.run(query, [valor, categoria, descricao, data], function (err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao registrar gasto.' });
    }
    res.status(201).json({ mensagem: 'Gasto registrado com sucesso!', id: this.lastID });
  });
});

module.exports = router;
