const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const pool   = require('./src/config/database');
const routes = require('./src/routes/index');

const app = express();

const cors = require('cors');

const corsOptions = {
  origin: 'https://cybershield-h04h.onrender.com',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());


app.use('/api', routes);


app.get('/', (req, res) => {
  res.json({ message: 'CyberShield API — opérationnelle' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Serveur CyberShield démarré sur http://localhost:${PORT}`);
});