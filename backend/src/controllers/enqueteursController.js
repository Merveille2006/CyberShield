const pool = require('../config/database');
const bcrypt = require('bcrypt');


const getAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id_enqueteurs, e.nom, e.email, e.matricule, e.actif,
              r.nom_roles, w.nom as workspace
       FROM enqueteurs e
       LEFT JOIN roles r ON e.id_roles = r.id_roles
       LEFT JOIN workspaces w ON e.id_workspace = w.id_workspaces
       ORDER BY e.nom`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const getById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id_enqueteurs, e.nom, e.email, e.matricule, e.actif,
              r.nom_roles, w.nom as workspace
       FROM enqueteurs e
       LEFT JOIN roles r ON e.id_roles = r.id_roles
       LEFT JOIN workspaces w ON e.id_workspace = w.id_workspaces
       WHERE e.id_enqueteurs = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Enquêteur introuvable' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const create = async (req, res) => {
  const { nom, email, mot_de_passe, matricule, id_roles, id_workspace } = req.body;
  if (!email || !mot_de_passe || !matricule) {
    return res.status(400).json({ success: false, message: 'email, mot_de_passe et matricule sont requis' });
  }
  try {
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await pool.query(
      `INSERT INTO enqueteurs (nom, email, mot_de_passe_hash, matricule, actif, id_roles, id_workspace)
       VALUES ($1, $2, $3, $4, true, $5, $6) RETURNING id_enqueteurs, nom, email, matricule`,
      [nom || null, email, hash, matricule, id_roles || null, id_workspace || null]
    );
    res.status(201).json({ success: true, message: 'Enquêteur créé', data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ success: false, message: 'Email ou matricule déjà utilisé' });
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const update = async (req, res) => {
  const { nom, actif, id_roles, id_workspace } = req.body;
  try {
    const result = await pool.query(
      `UPDATE enqueteurs SET
         nom = COALESCE($1, nom),
         actif = COALESCE($2, actif),
         id_roles = COALESCE($3, id_roles),
         id_workspace = COALESCE($4, id_workspace)
       WHERE id_enqueteurs = $5 RETURNING id_enqueteurs, nom, email, matricule, actif`,
      [nom, actif, id_roles, id_workspace, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Enquêteur introuvable' });
    res.json({ success: true, message: 'Enquêteur mis à jour', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const remove = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE enqueteurs SET actif = false WHERE id_enqueteurs = $1 RETURNING id_enqueteurs`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Enquêteur introuvable' });
    res.json({ success: true, message: 'Enquêteur désactivé' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { getAll, getById, create, update, remove };
