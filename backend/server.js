const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const pool   = require('./src/config/database');
const routes = require('./src/routes/index');

const app = express();


const corsOptions = {
  origin: 'https://merveille2006.github.io', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'CyberShield API — opérationnelle' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur CyberShield démarré sur le port ${PORT}`);
});