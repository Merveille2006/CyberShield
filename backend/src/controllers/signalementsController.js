const pool = require('../config/database');


const getAll = async (req, res) => {
  try {
    const { statut, priorite, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let conditions = [];
    let params = [];
    let i = 1;

    if (statut) { conditions.push(`s.code_suivi IS NOT NULL AND st.code = $${i++}`); params.push(statut); }
    if (priorite) { conditions.push(`sig.niveau_priorite = $${i++}`); params.push(priorite); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    params.push(limit, offset);

    const result = await pool.query(
      `SELECT sig.*, st.libelle as statut_libelle, st.couleur,
              ta.nom as type_arnaque, w.nom as workspace
       FROM signalements sig
       LEFT JOIN status st ON sig.id_status = st.id_status
       LEFT JOIN typearnaques ta ON sig.id_typearnaque = ta.id_typearnaques
       LEFT JOIN workspaces w ON sig.id_workspace = w.id_workspaces
       ${where}
       ORDER BY sig.date_signalement DESC
       LIMIT $${i++} OFFSET $${i++}`,
      params
    );

    const count = await pool.query('SELECT COUNT(*) FROM signalements');
    res.json({
      success: true,
      data: result.rows,
      pagination: { total: parseInt(count.rows[0].count), page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const getById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sig.*, st.libelle as statut_libelle, st.couleur,
              ta.nom as type_arnaque, w.nom as workspace
       FROM signalements sig
       LEFT JOIN status st ON sig.id_status = st.id_status
       LEFT JOIN typearnaques ta ON sig.id_typearnaque = ta.id_typearnaques
       LEFT JOIN workspaces w ON sig.id_workspace = w.id_workspaces
       WHERE sig.id_signalements = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Signalement introuvable' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const getBySuivi = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sig.description, sig.date_signalement, sig.niveau_priorite,
              sig.quartier, sig.code_suivi,
              st.libelle as statut, st.couleur,
              ta.nom as type_arnaque
       FROM signalements sig
       LEFT JOIN status st ON sig.id_status = st.id_status
       LEFT JOIN typearnaques ta ON sig.id_typearnaque = ta.id_typearnaques
       WHERE sig.code_suivi = $1`,
      [req.params.code]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Code de suivi introuvable' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const create = async (req, res) => {
  const { description, quartier, niveau_priorite, id_typearnaque, id_workspace } = req.body;

  if (!description || !quartier || !niveau_priorite) {
    return res.status(400).json({ success: false, message: 'Champs obligatoires manquants' });
  }

  try {
    const prefix = quartier.substring(0, 2).toUpperCase();
    const countRes = await pool.query('SELECT COUNT(*) FROM signalements');
    const num = String(parseInt(countRes.rows[0].count) + 1).padStart(4, '0');
    const code_suivi = `SIG-${prefix}${num}`;

    
    const statutRes = await pool.query("SELECT id_status FROM status WHERE code = 'SOUMIS'");
    const id_status = statutRes.rows[0]?.id_status || 1;

    const result = await pool.query(
      `INSERT INTO signalements (description, date_signalement, niveau_priorite, quartier, code_suivi, id_workspace, id_typearnaque, id_status)
       VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7) RETURNING *`,
      [description, niveau_priorite, quartier, code_suivi, id_workspace || null, id_typearnaque || null, id_status]
    );

    res.status(201).json({ success: true, message: 'Signalement créé', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const updateStatut = async (req, res) => {
  const { id_status } = req.body;
  if (!id_status) return res.status(400).json({ success: false, message: 'id_status requis' });

  try {
    const result = await pool.query(
      `UPDATE signalements SET id_status = $1 WHERE id_signalements = $2 RETURNING *`,
      [id_status, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Signalement introuvable' });
    res.json({ success: true, message: 'Statut mis à jour', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const remove = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM signalements WHERE id_signalements = $1 RETURNING id_signalements',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Signalement introuvable' });
    res.json({ success: true, message: 'Signalement supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { getAll, getById, getBySuivi, create, updateStatut, remove };
