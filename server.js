const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuario');
const gastosRoutes = require('./routes/gastos');
app.use('/api', gastosRoutes);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
