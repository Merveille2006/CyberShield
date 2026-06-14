// ====================================================
// BASE DE DONNÉES DE DÉPART (15 signalements réalistes)
// ====================================================
let signalements = [
    { id: "CS-1001", date: "2026-06-01", type: "Usurpation d'identité", quartier: "Tié-Tié", element: "Profil FB: 'Vente Privée Congo'", desc: "Faux profil Facebook vendant des téléphones sur Tié-Tié. Demande un acompte puis bloque l'acheteur.", statut: "Nouveau", cellule: "Brouteurs" },
    { id: "CS-1002", date: "2026-06-02", type: "Phishing", quartier: "Mpaka", element: "+242 06 444 11 22", desc: "Lien de phishing reçu par WhatsApp à Mpaka usurpant l'identité d'un service public.", statut: "En cours d'analyse", cellule: "Phishing" },
    { id: "CS-1003", date: "2026-06-02", type: "Fraude financière", quartier: "Lumumba", element: "WhatsApp: +242 05 555 88 99", desc: "Arnaque au dépôt de fonds à Lumumba promettant des gains sur une plateforme d'investissement fictive.", statut: "Enquête clôturée", cellule: "Fraude mobile" },
    { id: "CS-1004", date: "2026-06-03", type: "Fraude financière", quartier: "Grand Marché", element: "*150*4*...", desc: "Paiement frauduleux forcé par un faux agent Mobile Money au Grand Marché.", statut: "Transmis à la justice", cellule: "Fraude mobile" },
    { id: "CS-1005", date: "2026-06-04", type: "Usurpation d'identité", quartier: "Centre-ville", element: "E-mail: direction@agence-congo.com", desc: "Usurpation d'identité d'un directeur de banque locale ciblant les commerçants du centre-ville.", statut: "Nouveau", cellule: "Brouteurs" },
    { id: "CS-1006", date: "2026-06-04", type: "Phishing", quartier: "Tié-Tié", element: "https://connexion-securise-money.net", desc: "Faux site imitant un portail de paiement pour voler les codes secrets.", statut: "En cours d'analyse", cellule: "Phishing" },
    { id: "CS-1007", date: "2026-06-05", type: "Fraude financière", quartier: "Mpaka", element: "+242 06 111 22 33", desc: "SMS promettant un héritage fictif en échange de frais de dossier.", statut: "Nouveau", cellule: "Fraude mobile" },
    { id: "CS-1008", date: "2026-06-05", type: "Usurpation d'identité", quartier: "Lumumba", element: "TikTok: @star_afrique_fraud", desc: "Compte TikTok utilisant les photos d'un influenceur local pour soutirer de l'argent.", statut: "En cours d'analyse", cellule: "Brouteurs" },
    { id: "CS-1009", date: "2026-06-06", type: "Phishing", quartier: "Centre-ville", element: "https://mise-a-jour-sim.com", desc: "Lien envoyé par SMS demandant de mettre à jour la carte SIM pour pirater la ligne.", statut: "Enquête clôturée", cellule: "Phishing" },
    { id: "CS-1010", date: "2026-06-06", type: "Fraude financière", quartier: "Tié-Tié", element: "+242 05 999 00 11", desc: "Faux projet d'élevage de volailles demandant un financement participatif suspect.", statut: "Transmis à la justice", cellule: "Fraude mobile" },
    { id: "CS-1011", date: "2026-06-07", type: "Phishing", quartier: "Lumumba", element: "https://congo-subventions-2026.org", desc: "Formulaire en ligne promettant une bourse d'étude pour collecter les passeports.", statut: "Nouveau", cellule: "Phishing" },
    { id: "CS-1012", date: "2026-06-07", type: "Usurpation d'identité", quartier: "Mpaka", element: "Facebook: 'Cabinet Juridique Associé'", desc: "Arnaque aux faux frais d'avocat pour débloquer une situation imaginaire.", statut: "Nouveau", cellule: "Brouteurs" },
    { id: "CS-1013", date: "2026-06-08", type: "Fraude financière", quartier: "Grand Marché", element: "Cash direct", desc: "Vente pyramidale déguisée proposée dans les boutiques du Grand Marché.", statut: "En cours d'analyse", cellule: "Fraude mobile" },
    { id: "CS-1014", date: "2026-06-08", type: "Phishing", quartier: "Centre-ville", element: "https://wifi-gratuit-aeroport.info", desc: "Faux point d'accès Wi-Fi capturant les identifiants de messagerie.", statut: "Enquête clôturée", cellule: "Phishing" },
    { id: "CS-1015", date: "2026-06-09", type: "Usurpation d'identité", quartier: "Tié-Tié", element: "WhatsApp: +242 06 777 55 44", desc: "Individu se faisant passer pour un membre de la famille en voyage demandant de l'aide.", statut: "Transmis à la justice", cellule: "Brouteurs" }
];

let celluleActive = "Tous";

// ====================================================
// LOGIQUE DE NAVIGATION (SPA ÉPURÉE)
// ====================================================
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');

    // Mettre à jour la vue du dashboard si l'agent s'y connecte
    if (viewId === 'page-dashboard') {
        rendreDashboard();
    }
}

// ====================================================
// FORMULAIRE DE SIGNALEMENT
// ====================================================
document.getElementById('form-plainte').addEventListener('submit', function(e) {
    e.preventDefault();

    // Génération du code unique
    const uniqueId = "CS-" + Math.floor(1000 + Math.random() * 9000);
    
    // Récupération automatique du type de cellule selon le type d'arnaque sélectionné
    const selectType = document.getElementById('sig-type').value;
    let celluleAssignee = "Hôtel Central";
    if (selectType === "Phishing") celluleAssignee = "Phishing";
    if (selectType === "Fraude financière") celluleAssignee = "Fraude mobile";
    if (selectType === "Usurpation d'identité") celluleAssignee = "Brouteurs";

    // Ajouter le nouvel objet au tableau
    const nouveau = {
        id: uniqueId,
        date: document.getElementById('sig-date').value,
        type: selectType,
        quartier: document.getElementById('sig-quartier').value,
        element: document.getElementById('sig-element').value,
        desc: document.getElementById('sig-description').value,
        statut: "Nouveau",
        cellule: celluleAssignee
    };

    signalements.unshift(nouveau); // Ajouter au début

    // Afficher le message de succès
    const alertBox = document.getElementById('alert-succes');
    document.getElementById('code-genere').innerText = uniqueId;
    alertBox.classList.remove('hidden');

    // Effacer le formulaire
    document.getElementById('form-plainte').reset();

    // EXIGENCE : Disparition automatique après quelques secondes (ex: 6 secondes)
    setTimeout(function() {
        alertBox.classList.add('hidden');
    }, 6000);
});

// ====================================================
// INTERFACE DE SUIVI DE L'AFFAIRE & INDEMNISATION
// ====================================================
function verifierStatutAffaire() {
    const codeSaisi = document.getElementById('input-suivi-code').value.trim();
    const resultatBox = document.getElementById('resultat-suivi');
    const badgeText = document.getElementById('statut-badge-text');
    const descText = document.getElementById('statut-description-text');
    const zoneIndem = document.getElementById('zone-indemnisation');

    // Recherche de la correspondance dans notre tableau d'objets
    const affaire = signalements.find(item => item.id === codeSaisi);

    if (affaire) {
        resultatBox.classList.remove('hidden');
        badgeText.innerText = affaire.statut;
        
        // Appliquer la bonne classe de couleur au badge texte
        badgeText.className = ""; // Reset
        if (affaire.statut === "Nouveau") badgeText.classList.add("status-nouveau");
        if (affaire.statut === "En cours d'analyse") badgeText.classList.add("status-analyse");
        if (affaire.statut === "Enquête clôturée" || affaire.statut === "Transmis à la justice") badgeText.classList.add("status-cloture");

        descText.innerText = `Dépôt enregistré le ${affaire.date} pour des faits de type [${affaire.type}] localisés à ${affaire.quartier}.`;

        // EXIGENCE : Activer l'indemnisation si résolu (Enquête clôturée ou Transmis à la justice)
        if (affaire.statut === "Enquête clôturée" || affaire.statut === "Transmis à la justice") {
            zoneIndem.classList.remove('hidden');
        } else {
            zoneIndem.classList.add('hidden');
        }
    } else {
        alert("Aucun dossier trouvé pour ce code. Veuillez vérifier votre saisie.");
        resultatBox.classList.add('hidden');
    }
}

function demanderIndemnisation() {
    const contact = document.getElementById('indem-contact').value.trim();
    if (contact === "") {
        alert("Veuillez saisir un numéro de téléphone ou une adresse mail valide.");
    } else {
        alert(`Votre demande d'indemnisation liée au dossier a bien été transmise. Nos équipes vous contacteront sur : ${contact}`);
        document.getElementById('indem-contact').value = "";
    }
}

// ====================================================
// ZONE AGENT / CONNEXION
// ====================================================
document.getElementById('form-connexion').addEventListener('submit', function(e) {
    e.preventDefault();
    // Passage direct sur le tableau de bord (La vérification du matricule en DB se fera plus tard)
    showView('page-dashboard');
});

// ====================================================
// WORKSPACE INTERNE (TABLEAU DE BORD AGENT)
// ====================================================
function filtrerWorkspace(nomCellule) {
    celluleActive = nomCellule;
    
    // Mettre à jour l'état visuel du menu filtre gauche
    document.querySelectorAll('.sidebar li').forEach(li => {
        li.classList.remove('active-filter');
    });
    event.target.classList.add('active-filter');

    rendreDashboard();
}

function rendreDashboard(listeAFiltrer = null) {
    const container = document.getElementById('container-signalements');
    container.innerHTML = "";

    // Choisir la liste de données à afficher
    let donnees = listeAFiltrer ? listeAFiltrer : signalements;

    // Filtrer par cellule d'enquête (Workspace)
    if (celluleActive !== "Tous") {
        donnees = donnees.filter(item => item.cellule === celluleActive);
    }

    // Parcourir et fabriquer les cartes HTML simples
    donnees.forEach(item => {
        let classeType = "type-usurpation";
        if (item.type === "Phishing") classeType = "type-phishing";
        if (item.type === "Fraude financière") classeType = "type-fraude";

        let classeStatut = "status-nouveau";
        if (item.statut === "En cours d'analyse") classeStatut = "status-analyse";
        if (item.statut === "Enquête clôturée" || item.statut === "Transmis à la justice") classeStatut = "status-cloture";

        const card = document.createElement('div');
        card.className = "case-card";
        card.innerHTML = `
            <div class="case-meta">
                <span>Ref: <strong>${item.id}</strong></span>
                <span>📅 ${item.date}</span>
            </div>
            <h4>📍 Quartier : ${item.quartier}</h4>
            <span class="badge-type ${classeType}">${item.type}</span>
            <div class="case-element">${item.element}</div>
            <p class="case-desc">${item.desc}</p>
            <div class="status-indicator ${classeStatut}">● ${item.statut}</div>
        `;
        container.appendChild(card);
    });
}

// Recherche de corrélation dynamique
function rechercherCorrelation() {
    const query = document.getElementById('search-correl').value.toLowerCase().trim();
    
    if (query === "") {
        rendreDashboard();
    } else {
        const resultatsFiltres = signalements.filter(item => {
            return item.element.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
        });
        rendreDashboard(resultatsFiltres);
    }
}