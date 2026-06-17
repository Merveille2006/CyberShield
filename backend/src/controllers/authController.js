const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
  }

  try {
  
const result = await pool.query(
  `SELECT e.*, r.nom_roles FROM enqueteurs e
   LEFT JOIN roles r ON e.id_roles = r.id_roles
   WHERE e.email = $1 AND e.actif = true`,
  [email]
);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

    const enqueteur = result.rows[0];
    
    console.log("=== DIAGNOSTIC CONNEXION ===");
    console.log("Mot de passe reçu de Postman :", mot_de_passe);
    console.log("Hachage récupéré de la BDD :", enqueteur.mot_de_passe_hash);
    const passwordOk = await bcrypt.compare(mot_de_passe, enqueteur.mot_de_passe_hash);

    if (!passwordOk) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { id: enqueteur.id_enqueteurs, email: enqueteur.email, role: enqueteur.nom_roles },
      process.env.JWT_SECRET || 'cybershield_secret',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      enqueteur: {
        id: enqueteur.id_enqueteurs,
        nom: enqueteur.nom,
        email: enqueteur.email,
        matricule: enqueteur.matricule,
        role: enqueteur.nom_roles
      }
    });
  } catch (err) {
    console.error('Erreur login :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


const getProfil = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id_enqueteurs, e.nom, e.email, e.matricule, e.actif,
              r.nom_roles, w.nom as workspace
       FROM enqueteurs e
       LEFT JOIN roles r ON e.id_roles = r.id_roles
       LEFT JOIN workspaces w ON e.id_workspace = w.id_workspaces
       WHERE e.id_enqueteurs = $1`,
      [req.enqueteur.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

    
module.exports = { login, getProfil, };
