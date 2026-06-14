const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const pool = require('./src/config/database');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: ' CyberShield API — opérationnelle' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Serveur CyberShield démarré sur http://localhost:${PORT}`);
});