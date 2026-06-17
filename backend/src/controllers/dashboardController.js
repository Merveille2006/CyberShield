const pool = require('../config/database');

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const [signalements, suspects, preuves, parStatut, parType, parQuartier] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM signalements'),
      pool.query('SELECT COUNT(*) as total FROM suspects'),
      pool.query('SELECT COUNT(*) as total FROM preuves'),
      pool.query(
        `SELECT st.libelle, st.couleur, COUNT(sig.id_signalements) as total
         FROM status st
         LEFT JOIN signalements sig ON sig.id_status = st.id_status
         GROUP BY st.id_status, st.libelle, st.couleur
         ORDER BY st.ordre`
      ),
      pool.query(
        `SELECT ta.nom, COUNT(sig.id_signalements) as total
         FROM typearnaques ta
         LEFT JOIN signalements sig ON sig.id_typearnaque = ta.id_typearnaques
         GROUP BY ta.id_typearnaques, ta.nom`
      ),
      pool.query(
        `SELECT quartier, COUNT(*) as total
         FROM signalements
         GROUP BY quartier
         ORDER BY total DESC
         LIMIT 5`
      )
    ]);

    res.json({
      success: true,
      data: {
        totaux: {
          signalements: parseInt(signalements.rows[0].total),
          suspects: parseInt(suspects.rows[0].total),
          preuves: parseInt(preuves.rows[0].total)
        },
        par_statut: parStatut.rows,
        par_type: parType.rows,
        top_quartiers: parQuartier.rows
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { getStats };
