const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/cadastro', (req, res) => {
  const { nome, email, senha, nascimento, renda, profissao, objetivo } = req.body;

  if (!nome || !email || !senha || !nascimento || !renda || !profissao || !objetivo) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }

  const query = `INSERT INTO usuarios (nome, email, senha, nascimento, renda, profissao, objetivo)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [nome, email, senha, nascimento, renda, profissao, objetivo], function (err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
    }
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id: this.lastID });
  });
});

module.exports = router;
