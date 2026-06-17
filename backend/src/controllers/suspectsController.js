const pool = require('../config/database');

// GET /api/suspects
const getAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, COUNT(c.id_affectations) as nb_signalements_lies
       FROM suspects s
       LEFT JOIN correspondances c ON s.id_suspects = c.id_suspect
       GROUP BY s.id_suspects
       ORDER BY s.nb_signalements DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// GET /api/suspects/:id
const getById = async (req, res) => {
  try {
    const suspect = await pool.query('SELECT * FROM suspects WHERE id_suspects = $1', [req.params.id]);
    if (suspect.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Suspect introuvable' });

    const signalements = await pool.query(
      `SELECT sig.id_signalements, sig.description, sig.code_suivi, sig.niveau_priorite,
              st.libelle as statut
       FROM correspondances c
       JOIN signalements sig ON c.id_signalement = sig.id_signalements
       LEFT JOIN status st ON sig.id_status = st.id_status
       WHERE c.id_suspect = $1`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...suspect.rows[0], signalements: signalements.rows } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// POST /api/suspects
const create = async (req, res) => {
  const { telephone, alias_suspects, email_suspects } = req.body;
  if (!telephone || !alias_suspects) {
    return res.status(400).json({ success: false, message: 'telephone et alias_suspects requis' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO suspects (telephone, alias_suspects, nb_signalements, email_suspects)
       VALUES ($1, $2, 0, $3) RETURNING *`,
      [telephone, alias_suspects, email_suspects || null]
    );
    res.status(201).json({ success: true, message: 'Suspect créé', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// POST /api/suspects/:id/lier-signalement
const lierSignalement = async (req, res) => {
  const { id_signalement } = req.body;
  if (!id_signalement) return res.status(400).json({ success: false, message: 'id_signalement requis' });

  try {
    await pool.query(
      `INSERT INTO correspondances (date_correspondance, id_signalement, id_suspect)
       VALUES (NOW(), $1, $2)`,
      [id_signalement, req.params.id]
    );
    await pool.query(
      `UPDATE suspects SET nb_signalements = nb_signalements + 1 WHERE id_suspects = $1`,
      [req.params.id]
    );
    res.status(201).json({ success: true, message: 'Suspect lié au signalement' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { getAll, getById, create, lierSignalement };
