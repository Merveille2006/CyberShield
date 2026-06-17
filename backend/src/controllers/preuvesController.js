const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/preuves');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `preuve_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.pdf', '.mp4', '.mp3'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Type de fichier non autorisé'));
  }
});


const getAll = async (req, res) => {
  try {
    const { id_signalement } = req.query;
    let query = `SELECT p.*, s.alias_suspects FROM preuves p LEFT JOIN suspects s ON p.id_suspect = s.id_suspects`;
    const params = [];
    if (id_signalement) { query += ' WHERE p.id_signalement = $1'; params.push(id_signalement); }
    query += ' ORDER BY p.date_depot DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const create = async (req, res) => {
  const { type_depreuve, plateforme, compte_mm, id_signalement, id_suspect } = req.body;

  if (!req.file) return res.status(400).json({ success: false, message: 'Fichier requis' });
  if (!type_depreuve || !plateforme || !compte_mm)
    return res.status(400).json({ success: false, message: 'Champs obligatoires manquants' });

  try {
    const lien_fichier = `/uploads/preuves/${req.file.filename}`;
    const result = await pool.query(
      `INSERT INTO preuves (date_depot, type_depreuve, lien_fichier, plateforme, compte_mm, valide, id_signalement, id_suspect)
       VALUES (NOW(), $1, $2, $3, $4, false, $5, $6) RETURNING *`,
      [type_depreuve, lien_fichier, plateforme, compte_mm, id_signalement || null, id_suspect || null]
    );
    res.status(201).json({ success: true, message: 'Preuve ajoutée', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const valider = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE preuves SET valide = true WHERE id_preuves = $1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Preuve introuvable' });
    res.json({ success: true, message: 'Preuve validée', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { upload, getAll, create, valider };
