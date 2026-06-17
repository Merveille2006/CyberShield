DROP TABLE IF EXISTS actions CASCADE;
DROP TABLE IF EXISTS autorisations CASCADE;
DROP TABLE IF EXISTS affectations CASCADE;
DROP TABLE IF EXISTS correspondances CASCADE;
DROP TABLE IF EXISTS preuves CASCADE;
DROP TABLE IF EXISTS enqueteurs CASCADE;
DROP TABLE IF EXISTS signalements CASCADE;
DROP TABLE IF EXISTS traite CASCADE;
DROP TABLE IF EXISTS typeactions CASCADE;
DROP TABLE IF EXISTS suspects CASCADE;
DROP TABLE IF EXISTS taches CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS status CASCADE;
DROP TABLE IF EXISTS typearnaques CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;

CREATE TABLE workspaces(
    id_workspaces SERIAL PRIMARY KEY,
    nom VARCHAR(20) NOT NULL,
    zone_geographique VARCHAR(100) NOT NULL,
    description TEXT,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    activite VARCHAR(50) NOT NULL
);

CREATE TABLE typearnaques(
    id_typearnaques SERIAL PRIMARY KEY,
    nom VARCHAR(30) NOT NULL,
    description TEXT NOT NULL 
);

CREATE TABLE status (
    id_status SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    ordre INTEGER NOT NULL,
    couleur VARCHAR(8) NOT NULL
);

CREATE TABLE roles (
    id_roles SERIAL PRIMARY KEY,
    nom_roles VARCHAR(35) NOT NULL
);

CREATE TABLE taches (
    id_taches SERIAL PRIMARY KEY,
    nom_taches VARCHAR(35) NOT NULL
);

CREATE TABLE suspects (
    id_suspects SERIAL PRIMARY KEY,
    telephone VARCHAR(20) NOT NULL,
    alias_suspects VARCHAR(20) NOT NULL,
    nb_signalements INTEGER NOT NULL DEFAULT 0,
    email_suspects VARCHAR(50) NOT NULL
);

CREATE TABLE typeactions (
    id_typeactions SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE traite (
    id_traite SERIAL PRIMARY KEY,
    commentaire TEXT,
    statut VARCHAR(50) NOT NULL,
    date_traite TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE signalements(
    id_signalements SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    date_signalement TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    niveau_priorite VARCHAR(15) NOT NULL,
    quartier VARCHAR(20) NOT NULL,
    code_suivi VARCHAR(10) UNIQUE NOT NULL,
    id_workspace INT,
    id_typearnaque INT,
    id_status INT,
    CONSTRAINT fk_signalements_workspaces FOREIGN KEY(id_workspace) REFERENCES workspaces(id_workspaces) ON DELETE SET NULL,
    CONSTRAINT fk_signalements_typearnaques FOREIGN KEY(id_typearnaque) REFERENCES typearnaques(id_typearnaques) ON DELETE SET NULL,
    CONSTRAINT fk_signalements_status FOREIGN KEY(id_status) REFERENCES status(id_status) ON DELETE SET NULL
);

CREATE TABLE enqueteurs(
    id_enqueteurs SERIAL PRIMARY KEY,
    nom VARCHAR(15),
    email VARCHAR(50) UNIQUE NOT NULL,
    mot_de_passe_hash TEXT NOT NULL, 
    matricule VARCHAR(50) UNIQUE NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    id_workspace INT,
    id_roles INT,
    CONSTRAINT fk_enqueteurs_workspaces FOREIGN KEY(id_workspace) REFERENCES workspaces(id_workspaces) ON DELETE SET NULL,
    CONSTRAINT fk_enqueteurs_roles FOREIGN KEY(id_roles) REFERENCES roles(id_roles) ON DELETE SET NULL
);

CREATE TABLE preuves(
    id_preuves SERIAL PRIMARY KEY,
    date_depot TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type_depreuve VARCHAR(50) NOT NULL,
    lien_fichier VARCHAR(100) NOT NULL,
    plateforme VARCHAR(50) NOT NULL,
    compte_mm VARCHAR(20) NOT NULL,
    valide BOOLEAN NOT NULL DEFAULT FALSE,
    id_signalement INT,
    id_suspect INT,
    CONSTRAINT fk_preuves_signalements FOREIGN KEY(id_signalement) REFERENCES signalements(id_signalements) ON DELETE SET NULL,
    CONSTRAINT fk_preuves_suspects FOREIGN KEY(id_suspect) REFERENCES suspects(id_suspects) ON DELETE SET NULL
);

CREATE TABLE correspondances (
    id_affectations SERIAL PRIMARY KEY,
    date_correspondance TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    id_signalement INT,
    id_suspect INT,
    CONSTRAINT fk_correspondances_signalements FOREIGN KEY(id_signalement) REFERENCES signalements(id_signalements) ON DELETE SET NULL,
    CONSTRAINT fk_correspondances_suspects FOREIGN KEY(id_suspect) REFERENCES suspects(id_suspects) ON DELETE SET NULL
);

CREATE TABLE affectations (
    id_affectations SERIAL PRIMARY KEY,
    id_tache INT,
    id_roles INT,
    CONSTRAINT fk_affectations_taches FOREIGN KEY(id_tache) REFERENCES taches(id_taches) ON DELETE SET NULL,
    CONSTRAINT fk_affectations_roles FOREIGN KEY(id_roles) REFERENCES roles(id_roles) ON DELETE SET NULL
);

CREATE TABLE autorisations (
    id_autorisations SERIAL PRIMARY KEY,
    nom_action VARCHAR(20) NOT NULL,
    description TEXT,
    id_roles INT,
    CONSTRAINT fk_autorisations_roles FOREIGN KEY(id_roles) REFERENCES roles(id_roles) ON DELETE SET NULL
);

CREATE TABLE actions (
    id_actions SERIAL PRIMARY KEY,
    action_fait VARCHAR(255) NOT NULL,
    date_action TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    id_enqueteur INT,
    id_typeaction INT,
    id_autorisation INT,
    CONSTRAINT fk_actions_enqueteurs FOREIGN KEY(id_enqueteur) REFERENCES enqueteurs(id_enqueteurs) ON DELETE SET NULL,
    CONSTRAINT fk_actions_typeactions FOREIGN KEY(id_typeaction) REFERENCES typeactions(id_typeactions) ON DELETE SET NULL,
    CONSTRAINT fk_actions_autorisations FOREIGN KEY(id_autorisation) REFERENCES autorisations(id_autorisations) ON DELETE SET NULL
);


DELETE FROM enqueteurs WHERE email = 'justice@cybershield.cg';


INSERT INTO enqueteurs (nom, email, mot_de_passe_hash, matricule, actif, id_workspace, id_roles) VALUES 
('Mvouama', 'justice@cybershield.cg', '$2b$10$Emy7G7A6vUPr.b9A6CdfmeP21aKstWJ0N/B95y.125m9O6wS8A5vG',  'CH-2026-X', true, NULL, NULL);

INSERT INTO status (code, libelle, ordre, couleur) VALUES
('SOUMIS', 'Nouveau / Non assigné', 1, '#FF0000'),
('EN_COURS', 'En cours d''analyse', 2, '#0000FF'),
('CLOTURE', 'Clôturé / Transmis à la justice', 3, '#00AA00'),
('REJETE', 'Rejeté', 4, '#808080');

INSERT INTO typearnaques (nom, description) VALUES
('Phishing', 'Hameçonnage et fausses pages web'),
('Fraude Financière', 'Arnaques financières et Mobile Money'),
('Usurpation', 'Usurpation d''identité');

INSERT INTO typeactions (code, description) VALUES
('SIGNALEMENT_SOUMIS', 'Un nouveau signalement a été déposé'),
('STATUT_CHANGE', 'Le statut du signalement a été modifié'),
('PREUVE_AJOUTEE', 'Une preuve a été ajoutée'),
('SUSPECT_AJOUTE', 'Un suspect a été lié au signalement'),
('SUIVI_AJOUTE', 'Une note de suivi a été ajoutée');

INSERT INTO roles (nom_roles) VALUES
('SUPER_ADMIN'),
('ENQUETEUR'),
('SUPERVISEUR');

INSERT INTO workspaces (nom, activite, zone_geographique) VALUES
('Cellule Mobile Money', 'Fraude Financière', 'Pointe-Noire Centre'),
('Cellule Phishing', 'Phishing & Fausses Pages', 'Pointe-Noire Nord'),
('Antenne Centrale', 'Généraliste', 'Pointe-Noire');


UPDATE enqueteurs 
SET id_roles = (SELECT id_roles FROM roles WHERE nom_roles = 'SUPER_ADMIN') 
WHERE email = 'justice@cybershield.cg';


INSERT INTO signalements (description, quartier, niveau_priorite, code_suivi, id_typearnaque, id_status) VALUES
('Faux profil Facebook vendant des téléphones à Tié-Tié. Le vendeur demande un acompte via Mobile Money avant de disparaître.', 'Tié-Tié', 'ELEVE', 'SIG-TT0001', (SELECT id_typearnaques FROM typearnaques WHERE nom='Fraude Financière'), (SELECT id_status FROM status WHERE code='SOUMIS')),
('Lien de phishing reçu par WhatsApp à Mpaka, usurpant MTN Mobile Money. La page demande le code PIN.', 'Mpaka', 'CRITIQUE', 'SIG-MP0002', (SELECT id_typearnaques FROM typearnaques WHERE nom='Phishing'), (SELECT id_status FROM status WHERE code='SOUMIS')),
('SMS promettant un gain de loterie de 500.000 FCFA contre un versement de 15.000 FCFA à Lumumba.', 'Lumumba', 'MOYEN', 'SIG-LU0003', (SELECT id_typearnaques FROM typearnaques WHERE nom='Fraude Financière'), (SELECT id_status FROM status WHERE code='EN_COURS')),
('Fausse page Facebook de vente de billets d''avion à Fond Tié-Tié. Paiement demandé via Airtel Money.', 'Fond Tié-Tié', 'ELEVE', 'SIG-FT0004', (SELECT id_typearnaques FROM typearnaques WHERE nom='Fraude Financière'), (SELECT id_status FROM status WHERE code='SOUMIS')),
('Arnaque à l''emploi sur WhatsApp. Faux recruteur demandant 20.000 FCFA pour frais de dossier.', 'Bacongo', 'MOYEN', 'SIG-BC0005', (SELECT id_typearnaques FROM typearnaques WHERE nom='Fraude Financière'), (SELECT id_status FROM status WHERE code='EN_COURS')),
('Phishing par SMS usurpant la BSCA Bank. Lien demandant identifiants bancaires.', 'Mvou-Mvou', 'CRITIQUE', 'SIG-MV0006', (SELECT id_typearnaques FROM typearnaques WHERE nom='Phishing'), (SELECT id_status FROM status WHERE code='SOUMIS')),
('Faux compte Instagram vendant des pagnes à prix réduit. Livraison jamais effectuée après paiement.', 'Mongo-Poukou', 'FAIBLE', 'SIG-MK0007', (SELECT id_typearnaques FROM typearnaques WHERE nom='Fraude Financière'), (SELECT id_status FROM status WHERE code='CLOTURE')),
('Usurpation d''identité d''un agent SCDP sur Facebook pour escroquer des demandeurs d''emploi.', 'Centre-Ville', 'ELEVE', 'SIG-CV0008', (SELECT id_typearnaques FROM typearnaques WHERE nom='Usurpation'), (SELECT id_status FROM status WHERE code='EN_COURS')),
('Faux site de paris sportifs copiant 1xBet. Gains impossibles à retirer après dépôt.', 'Plateau des 15 ans', 'MOYEN', 'SIG-PL0009', (SELECT id_typearnaques FROM typearnaques WHERE nom='Phishing'), (SELECT id_status FROM status WHERE code='SOUMIS')),
('Arnaque au faux investissement crypto sur Telegram. Promesse de x10 en 48h.', 'Tié-Tié', 'CRITIQUE', 'SIG-TT0010', (SELECT id_typearnaques FROM typearnaques WHERE nom='Fraude Financière'), (SELECT id_status FROM status WHERE code='EN_COURS')),
('Faux profil de vendeur de voitures d''occasion sur Facebook. Acompte demandé via Mobile Money.', 'Kouhoula', 'ELEVE', 'SIG-KH0011', (SELECT id_typearnaques FROM typearnaques WHERE nom='Fraude Financière'), (SELECT id_status FROM status WHERE code='SOUMIS')),
('SMS d''hameçonnage imitant Airtel Congo demandant recharge urgente pour éviter suspension.', 'Ngoyo', 'MOYEN', 'SIG-NG0012', (SELECT id_typearnaques FROM typearnaques WHERE nom='Phishing'), (SELECT id_status FROM status WHERE code='SOUMIS')),
('Faux transporteur sur WhatsApp proposant envoi de colis. Frais de douane fictifs demandés.', 'Loandjili', 'FAIBLE', 'SIG-LJ0013', (SELECT id_typearnaques FROM typearnaques WHERE nom='Fraude Financière'), (SELECT id_status FROM status WHERE code='CLOTURE')),
('Usurpation d''un médecin pour vendre de faux médicaments contre le diabète en ligne.', 'Mpaka', 'ELEVE', 'SIG-MP0014', (SELECT id_typearnaques FROM typearnaques WHERE nom='Usurpation'), (SELECT id_status FROM status WHERE code='EN_COURS')),
('Fausse loterie MTN par SMS. Le gagnant doit payer 5.000 FCFA pour débloquer son prix.', 'Vingt-Cinq', 'MOYEN', 'SIG-VC0015', (SELECT id_typearnaques FROM typearnaques WHERE nom='Fraude Financière'), (SELECT id_status FROM status WHERE code='SOUMIS'));