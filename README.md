 CyberShield – Plateforme de Signalement et d'Investigation de la Cybercriminalité

 Présentation du projet
CyberShield est une plateforme web de gestion et de suivi des infractions numériques conçue pour accompagner les professionnels de la sécurité et de la justice dans la prise en charge des plaintes tout au long de leur parcours d'enquête. L'application permet la gestion des dossiers de fraude, des auditions, des analyses de preuves, des constantes d'infraction, des clôtures de dossiers, des réquisitions judiciaires et du suivi citoyen via un portail dédié.

 Corrections et améliorations réalisées

 Backend (API Node.js / Express)
* Gestion des fichiers et documents :Mise en place de la route statique `/uploads` pour la diffusion sécurisée des fichiers de preuves téléversés. Optimisation de la gestion des téléchargements de captures d'écran et pièces à conviction.
* Gestion des constantes d'infraction :Adaptation de la route `POST /api/signalements` afin de permettre l'enregistrement des indices soit à partir d'une investigation active, soit directement depuis le dossier d'infraction grâce au champ `signalement_id`.
* Gestion du risque et de la priorité :Création de la route `PATCH /api/signalements/:id/priorite` permettant la mise à jour dynamique du niveau de gravité d'une fraude (Normal, Urgent, Critique).
* Gestion des réquisitions et procédures :Ajout des routes `GET /api/requisitions/signalement/:signalementId` et `POST /api/requisitions` pour consulter et enregistrer des requêtes administratives ou judiciaires.
* Gestion de l'historique des statuts :Ajout des routes `GET /api/statuts/signalement/:signalementId` et `POST /api/statuts` pour l'enregistrement et la consultation de l'évolution des dossiers.
* Gestion des affectations d'enquêteurs :Ajout des routes `GET /api/enqueteurs/workspace/:workspaceId` et `PATCH /api/affectations/:id/enqueteur` permettant l'attribution et la libération des dossiers entre agents.
* Recherche avancée :Création de la route `GET /api/signalements/search?q=` offrant une recherche multicritère transversale sur les infractions.
* Portail public :Ajout de la route `GET /api/signalement/public/:id` pour l'affichage sécurisé des informations d'avancement publiques d'un dossier sans authentification JWT.

 Dashboard Enquêteur
* Gestion des dossiers d'infraction :Ajout de l'affichage des documents de preuves dans la fiche détaillée. Intégration d'un bouton de téléchargement pour chaque pièce à conviction. Correction du chemin d'accès aux fichiers téléversés.
* Suivi de la cybercriminalité :Modification du niveau d'urgence : Normal, Modéré, Élevé. Ajout de l'enregistrement des indices même en l'absence d'une investigation active.
* Ergonomie :Refonte visuelle des cartes de signalements. Ajout de badges et d'indicateurs colorés selon le niveau de gravité. Amélioration de la lisibilité générale de l'interface.
* Recherche :Recherche transversale par : numéro de téléphone d'escroc, nom de l'arnaque, quartier, typologie de fraude (Mobile Money, Phishing) et mots-clés.
* Gestion des alertes :Ajout de la fonctionnalité *Marquer comme critique*. Conservation de l'état d'épinglage via `localStorage`.
* Affectation et Workspace :Attribution et libération des dossiers d'enquête directement depuis le tableau de bord.
* Correctifs :Correction de plusieurs gestionnaires d'événements : mise à jour des signalements, indexation des preuves, statuts et affectations.

 Portail Citoyen (Suivi)
* Nouvel onglet « Mon Suivi » :Ajout d'un espace dédié permettant aux victimes de consulter : leurs informations de dépôt, leurs coordonnées déclarées et leur dossier de plainte simplifié.
* Amélioration de l'affichage documentaire :Affichage d'icônes dynamiques selon le type de fichier (image, PDF, texte). Optimisation de l'expérience utilisateur.
* Formulaire de téléversement :Ajout du champ obligatoire `type_preuve`. Validation améliorée des données envoyées.
* Confidentialité :Remplacement des exemples de plaintes réelles par des identifiants et des données anonymisées.

 Sécurité et contrôle d'accès
* Authentification :Protection des routes professionnelles de la brigade via JWT. Gestion sécurisée des sessions utilisateur.
* Restrictions d'accès :Les enquêteurs peuvent uniquement modifier les informations non identifiantes à l'enquête : numéro de contact de suivi, quartier, observations complémentaires. Les données sensibles d'identification initiale restent protégées.
* Vues SQL sécurisées :Création des vues `vue_signalement_public` et `vue_enqueteur_restreint` afin de limiter l'exposition des données selon le rôle de l'utilisateur.

 Base de données
* Évolutions du schéma :Ajout de la colonne `motif_cloture VARCHAR(...)` dans la table des signalements.
* Validation des scripts :Les scripts suivants ont été vérifiés et exécutés avec succès : `00_reset.sql`, `01_schema.sql`, `02_seed.sql`. Aucune erreur de cohérence ou d'intégrité n'a été détectée.


 Fonctionnalités opérationnelles

 Portail Citoyen
* Authentification anonyme par code de suivi unique.
* Consultation des statuts d'avancement.
* Consultation du calendrier des étapes de procédure.
* Téléversement de pièces à conviction compléments.
* Consultation des documents transmis.
* Accès au résumé du signalement personnel.

 Dashboard Enquêteur
* Authentification sécurisée par JWT.
* Consultation des statistiques criminelles et graphiques de fraude.
* Gestion complète des dossiers de signalements.
* Visualisation des indices et métadonnées collectées.
* Gestion des réquisitions et demandes de blocage.
* Gestion des affectations de dossiers.
* Téléchargement des documents et captures de preuves.

 Recherche Avancée
* Recherche multicritère par : nom de suspect, quartier, type de fraude, mot-clé, numéro Mobile Money suspecté.

 Gestion des Enquêtes
* Ouverture et prise en charge des dossiers.
* Clôture et archivage des enquêtes.
* Attribution des dossiers aux agents.
* Libération ou transfert des affaires.

 Suivi Analytique
* Enregistrement des indices de corrélation sérielle.
* Gestion des fraudes à propagation rapide.
* Enregistrement des résolutions d'affaires.


 Prochaines étapes

 Démonstration
* Réalisation d'une vidéo de présentation du projet.
* Publication de la vidéo explicative sur YouTube.

 Déploiement
* Mise en production de la plateforme.
* Mise en ligne du backend et de la base de donnée sur Render
* Mise en ligne du frontend sur Github Pages

 Améliorations futures
* Notifications SMS automatiques de changement de statut.
* Tableau de bord analytique et cartographie des fraudes par quartier.
* Export PDF certifié des dossiers d'infraction.
* Gestion multi-communes et inter-brigades.
* Historique complet des modifications de dossiers.



 Technologies utilisées

 Frontend
* HTML5
* CSS3
* JS

 Backend
* Node.js
* Express.js

 Base de données
* PostgreSQL

 Sécurité
* JWT (JSON Web Token)
* Contrôle d'accès par rôles (RBAC)

