CREATE DATABASE CyberShield;

CREATE TABLE workspaces(
id_workspaces SERIAL PRIMARY KEY,
nom VARCHAR(20) NOT NULL,
zone_geographique VARCHAR(100) NOT NULL,
description TEXT,
date_creation TIMESTAMPTZ,
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
nb_signalements INTEGER NOT NULL,
email_suspects VARCHAR(50) NOT NULL
);

CREATE TABLE typeactions (
id_typeactions SERIAL PRIMARY KEY,
description TEXT NOT NULL,
code VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE traite (
id_traite SERIAL PRIMARY KEY,
commentaire TEXT ,
statut VARCHAR(50) NOT NULL,
date_traite TIMESTAMPTZ NOT NULL
);

CREATE TABLE signalements(
id_signalements SERIAL PRIMARY KEY,
description TEXT NOT NULL,
date_signalement TIMESTAMPTZ NOT NULL,
niveau_priorite VARCHAR(15) NOT NULL,
quartier VARCHAR(20) NOT NULL,
code_suivi VARCHAR(10) UNIQUE NOT NULL,

id_workspace INT,
id_typearnaque INT,
id_status INT,

CONSTRAINT fk_signalements_workspaces  FOREIGN KEY(id_workspace) REFERENCES workspaces(id_workspaces) ON DELETE SET NULL,
CONSTRAINT fk_signalements_typearnaques  FOREIGN KEY(id_typearnaque) REFERENCES typearnaques(id_typearnaques) ON DELETE SET NULL,
CONSTRAINT fk_signalements_status  FOREIGN KEY(id_status) REFERENCES status(id_status) ON DELETE SET NULL
);

CREATE TABLE enqueteurs(
id_enqueteurs SERIAL PRIMARY KEY,
nom VARCHAR(15),
email VARCHAR(50) UNIQUE NOT NULL,
mot_de_passe_hash TEXT UNIQUE NOT NULL,
matricule VARCHAR(50) UNIQUE NOT NULL,
actif BOOLEAN NOT NULL,

id_workspace INT,
id_roles INT,

CONSTRAINT fk_enqueteurs_workspaces FOREIGN KEY(id_workspace) REFERENCES workspaces(id_workspaces) ON DELETE SET NULL,
CONSTRAINT fk_enqueteurs_roles FOREIGN KEY(id_roles) REFERENCES roles(id_roles) ON DELETE SET NULL
);

CREATE TABLE preuves(
id_preuves SERIAL PRIMARY KEY,
date_depot timestamptz NOT NULL,
type_depreuve VARCHAR(50) NOT NULL,
lien_fichier VARCHAR(100) NOT NULL,
plateforme VARCHAR(50) NOT NULL,
compte_mm VARCHAR(20) NOT NULL,
valide BOOLEAN NOT NULL,

id_signalement INT,
id_suspect INT,

CONSTRAINT fk_preuves_signalements  FOREIGN KEY(id_signalement) REFERENCES signalements(id_signalements) ON DELETE SET NULL,
CONSTRAINT fk_preuves_suspects  FOREIGN KEY(id_suspect) REFERENCES suspects(id_suspects) ON DELETE SET NULL
);


CREATE TABLE correspondances (
id_affectations SERIAL PRIMARY KEY,
date_correspondance TIMESTAMPTZ NOT NULL,

id_signalement INT,
id_suspect INT,

CONSTRAINT fk_correspondances_signalements  FOREIGN KEY(id_signalement) REFERENCES signalements(id_signalements) ON DELETE SET NULL,
CONSTRAINT fk_correspondances_suspects  FOREIGN KEY(id_suspect) REFERENCES suspects(id_suspects) ON DELETE SET NULL
);


CREATE TABLE affectations (
id_affectations SERIAL PRIMARY KEY,

id_tache INT,
id_roles INT,

CONSTRAINT fk_affectations_taches  FOREIGN KEY(id_tache) REFERENCES taches(id_taches) ON DELETE SET NULL,
CONSTRAINT fk_affectations_roles  FOREIGN KEY(id_roles) REFERENCES roles(id_roles) ON DELETE SET NULL
);

CREATE TABLE autorisations (
id_autorisations SERIAL PRIMARY KEY,
nom_action VARCHAR(20) NOT NULL,
description TEXT,

id_roles INT,

CONSTRAINT fk_autorisations_roles  FOREIGN KEY(id_roles) REFERENCES roles(id_roles) ON DELETE SET NULL
);

CREATE TABLE actions (
id_actions SERIAL PRIMARY KEY,
action_fait VARCHAR(255) NOT NULL,
date_action TIMESTAMPTZ NOT NULL,

id_enqueteur INT,
id_typeaction INT,
id_autorisation INT,

CONSTRAINT fk_actions_enqueteurs  FOREIGN KEY(id_enqueteur) REFERENCES enqueteurs(id_enqueteurs) ON DELETE SET NULL,
CONSTRAINT fk_actions_typeactions  FOREIGN KEY(id_typeaction) REFERENCES typeactions(id_typeactions) ON DELETE SET NULL,
CONSTRAINT fk_actions_autorisations  FOREIGN KEY(id_autorisation) REFERENCES autorisations(id_autorisations) ON DELETE SET NULL
);


