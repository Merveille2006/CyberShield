// ==========================================================================
// MOCK DATA EMBEDDED : Jeu de Seeding Réaliste Exigé (Pointe-Noire)
// ==========================================================================
const baseDonneesSeeding = [
    { id: "CS-4011", type: "Fraude Financière", quartier: "Tié-Tié", description: "Faux profil Facebook usurpant l'identité d'un vendeur de téléphones à Tié-Tié. Demande un versement anticipé par Mobile Money.", preuve: "+242064445566", statut: "Nouveau" },
    { id: "CS-2055", type: "Phishing", quartier: "Mpaka", description: "Lien frauduleux reçu en masse par WhatsApp à Mpaka détournant l'image d'une banque pour capturer les codes.", preuve: "http://ma-banque-congo-securite.com", statut: "En cours d'analyse" },
    { id: "CS-8891", type: "Fraude Financière", quartier: "Lumumba", description: "Arnaque pyramidale au faux placement de fonds à Lumumba promettant un doublement de capital.", preuve: "+242055551122", statut: "Clôturé" },
    { id: "CS-3102", type: "Usurpation d'identité", quartier: "Grand Marché", description: "Copie intégrale des photos d'une boutique du Grand Marché pour flouer les clients à distance.", preuve: "boutique_clone_pnr", statut: "Nouveau" },
    { id: "CS-7761", type: "Phishing", quartier: "Ngoio", description: "Faux site Airtel/MTN promettant des gigas gratuits si l'on entre ses identifiants personnels.", preuve: "http://gain-congo-loto.xyz", statut: "En cours d'analyse" },
    { id: "CS-9910", type: "Fraude Financière", quartier: "Tié-Tié", description: "Escroquerie au faux technicien télécom annulant prétendument un blocage de compte.", preuve: "+242064445566", statut: "Nouveau" }, // Corrélation d'indice voulue
    { id: "CS-1022", type: "Phishing", quartier: "Lumumba", description: "Page miroir de messagerie sécurisée ciblant les administrations du centre-ville.", preuve: "http://ma-banque-congo-securite.com", statut: "Nouveau" }, // Corrélation d'indice voulue
    { id: "CS-5051", type: "Usurpation d'identité", quartier: "Mpaka", description: "Piratage de compte WhatsApp suivi de demandes urgentes d'assistance financière fictive.", preuve: "+242051112233", statut: "Nouveau" },
    { id: "CS-6062", type: "Fraude Financière", quartier: "Grand Marché", description: "Faux canal Telegram vendant des placements d'or fictifs.", preuve: "t.me/crypto_congo_richesse", statut: "Clôturé" },
    { id: "CS-1114", type: "Phishing", quartier: "Tié-Tié", description: "Fausse notification par email d'un problème de livraison nécessitant un paiement de 500 CFA.", preuve: "http://verification-mails-cg.net", statut: "Nouveau" },
    { id: "CS-2321", type: "Fraude Financière", quartier: "Ngoio", description: "Frais de dossier frauduleux demandés pour un faux recrutement sur site industriel.", preuve: "+242069998877", statut: "En cours d'analyse" },
    { id: "CS-9403", type: "Usurpation d'identité", quartier: "Lumumba", description: "Création d'une fausse agence d'immigration pour vendre de faux visas pour l'Europe.", preuve: "http://congo-voyages-vols.com", statut: "Nouveau" },
    { id: "CS-7023", type: "Fraude Financière", quartier: "Mpaka", description: "Maraboutage en ligne exigeant de l'argent en contrepartie de bénédictions.", preuve: "+242057776655", statut: "Nouveau" },
    { id: "CS-8812", type: "Phishing", quartier: "Tié-Tié", description: "Alerte SMS prétextant un compte mobile bloqué, renvoyant vers un formulaire de piratage.", preuve: "http://securite-carte-cg.com", statut: "Nouveau" },
    { id: "CS-5550", type: "Usurpation d'identité", quartier: "Grand Marché", description: "Vente en ligne de faux produits cosmétiques de luxe par usurpation de logo.", preuve: "@belles_de_pnr_arnaque", statut: "En cours d'analyse" }
];

let listeSignalements = [...baseDonneesSeeding];

// ==========================================================================
// GESTION ET NAVIGATION DES ONGLETS
// ==========================================================================
document.getElementById('onglet-public').addEventListener('click', function() {
    basculerOnglet('onglet-public', 'section-portail-public');
});

document.getElementById('onglet-interne').addEventListener('click', function() {
    basculerOnglet('onglet-interne', 'section-espace-interne');
    renderDashboard();
});

function basculerOnglet(idOnglet, idSection) {
    document.querySelectorAll('.bouton-onglet').forEach(b => b.classList.remove('actif'));
    document.querySelectorAll('.zone-affichage').forEach(s => s.classList.add('cache'));
    
    document.getElementById(idOnglet).classList.add('actif');
    document.getElementById(idSection).classList.remove('cache');
}

// ==========================================================================
// GESTION DU SOUUMISSION FORMULAIRE CITOYEN
// ==========================================================================
document.getElementById('formulaire-signalement').addEventListener('submit', function(e) {
    e.preventDefault();

    const type = document.getElementById('type-arnaque').value;
    const quartier = document.getElementById('quartier-victime').value;
    const description = document.getElementById('description-faits').value;
    const preuve = document.getElementById('preuve-texte').value;
    
    // ID anonymisé unique
    const codeGenere = `CS-${Math.floor(1000 + Math.random() * 9000)}`;

    const nouveauDossier = {
        id: codeGenere,
        type: type,
        quartier: quartier,
        description: description,
        preuve: preuve,
        statut: "Nouveau"
    };

    listeSignalements.unshift(nouveauDossier);

    // Affichage Réussite UI
    document.getElementById('code-suivi-genere').innerText = codeGenere;
    document.getElementById('zone-succes-code').classList.remove('cache');
    
    this.reset();
});

// ==========================================================================
// LOGIQUE DE TRAITEMENT LOCALSTORAGE (Dossiers Urgents)
// ==========================================================================
function obtenirUrgentsLocalStorage() {
    const data = localStorage.getItem('cybershield_urgents');
    return data ? JSON.parse(data) : [];
}

function modifierUrgenceDossier(id) {
    let urgents = obtenirUrgentsLocalStorage();
    if (urgents.includes(id)) {
        urgents = urgents.filter(item => item !== id);
    } else {
        urgents.push(id);
    }
    localStorage.setItem('cybershield_urgents', JSON.stringify(urgents));
    renderDashboard();
}

// Changer le statut administratif
function modifierStatutDossier(id, nouveauStatut) {
    const index = listeSignalements.findIndex(d => d.id === id);
    if (index !== -1) {
        listeSignalements[index].statut = nouveauStatut;
        renderDashboard();
    }
}

// ==========================================================================
// MOTEUR DE RECHERCHE CROISÉE ET CORRÉLATION AUTOMATIQUE
// ==========================================================================
document.getElementById('champ-recherche').addEventListener('input', renderDashboard);

function renderDashboard() {
    const fluxGlobalHTML = document.getElementById('liste-flux-global');
    const fluxUrgentsHTML = document.getElementById('liste-dossiers-urgents');
    
    fluxGlobalHTML.innerHTML = "";
    fluxUrgentsHTML.innerHTML = "";

    const recherche = document.getElementById('champ-recherche').value.toLowerCase().trim();
    const listeUrgents = obtenirUrgentsLocalStorage();

    listeSignalements.forEach(dossier => {
        // Corrélation croisée d'indices (recherche globale sur tous les champs)
        const matchIndex = 
            dossier.id.toLowerCase().includes(recherche) ||
            dossier.quartier.toLowerCase().includes(recherche) ||
            dossier.description.toLowerCase().includes(recherche) ||
            dossier.preuve.toLowerCase().includes(recherche);

        if (recherche !== "" && !matchIndex) return;

        // Association des styles de statuts et de types exigés
        const cssStatut = dossier.statut === "Nouveau" ? "statut-nouveau" : (dossier.statut === "En cours d'analyse" ? "statut-analyse" : "statut-cloture");
        const cssType = dossier.type === "Phishing" ? "type-phishing" : (dossier.type === "Fraude Financière" ? "type-fraude" : "type-identite");
        const estPrioritaire = listeUrgents.includes(dossier.id);

        const cardStructure = `
            <div class="carte-dossier-cyber">
                <div class="ligne-entete-carte">
                    <span class="id-dossier">N° ${dossier.id}</span>
                    <span class="badge-premium ${cssStatut}">${dossier.statut}</span>
                </div>
                <div>
                    <span class="badge-type-tag ${cssType}">${dossier.type}</span>
                    <p class="corps-dossier-texte"><strong>[${dossier.quartier}]</strong> ${dossier.description}</p>
                    <div class="zone-indice-preuve">
                        🔑 Indice de corrélation : <code>${dossier.preuve}</code>
                    </div>
                </div>
                <div class="barre-actions-carte">
                    <button class="bouton-urgence-switch ${estPrioritaire ? 'actif' : ''}" onclick="modifierUrgenceDossier('${dossier.id}')">
                        ${estPrioritaire ? "📌 Désancrer" : "🔥 Marquer Urgent"}
                    </button>
                    <select class="select-statut-cyber" onchange="modifierStatutDossier('${dossier.id}', this.value)">
                        <option value="Nouveau" ${dossier.statut === 'Nouveau' ? 'selected' : ''}>Nouveau</option>
                        <option value="En cours d'analyse" ${dossier.statut === "En cours d'analyse" ? 'selected' : ''}>En cours d'analyse</option>
                        <option value="Clôturé" ${dossier.statut === 'Clôturé' ? 'selected' : ''}>Clôturé</option>
                    </select>
                </div>
            </div>
        `;

        if (estPrioritaire) {
            fluxUrgentsHTML.insertAdjacentHTML('beforeend', cardStructure);
        } else {
            fluxGlobalHTML.insertAdjacentHTML('beforeend', cardStructure);
        }
    });

    if (fluxGlobalHTML.innerHTML === "" && fluxUrgentsHTML.innerHTML === "") {
        fluxGlobalHTML.innerHTML = `<p style="text-align:center; color:#94a3b8; padding:20px; font-size:0.9rem;">Aucun suspect ou indice correspondant trouvé dans la base.</p>`;
    }
}