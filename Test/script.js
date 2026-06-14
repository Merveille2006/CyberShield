// Base de données simulée en mémoire pour faire fonctionner le prototype immédiatement
let dossiers = [
    {
        id: "CS-8921",
        description: "Reçu un SMS indiquant un gain de loterie Mobile Money. Lien frauduleux demandant mes identifiants.",
        quartier: "Tié-Tié",
        preuveTextuelle: "+242 06 654 32 10",
        images: ["https://via.placeholder.com/150"],
        statut: "Nouveau",
        urgent: false
    },
    {
        id: "CS-4412",
        description: "Faux site d'investissement pétrolier promettant 300% de retour sur investissement en 48 heures.",
        quartier: "Centre-ville",
        preuveTextuelle: "https://congo-invest-arnaque.com",
        images: ["https://via.placeholder.com/150"],
        statut: "En cours d'analyse",
        urgent: true
    }
];

// Variables globales pour gérer le dossier en cours de consultation dans le modal
let currentCaseId = null;

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    chargerUrgentsDepuisLocalStorage();
    rendreTableauDeBord();
    
    // Gestion du Drag & Drop basique (visuel)
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");

    dropZone.addEventListener("click", () => fileInput.click());
    dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.style.background = "rgba(27, 162, 196, 0.2)"; });
    dropZone.addEventListener("dragleave", () => { dropZone.style.background = "rgba(27, 162, 196, 0.05)"; });
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.background = "rgba(27, 162, 196, 0.05)";
        alert("Fichiers acceptés pour la simulation !");
    });

    // Soumission du Formulaire Public
    document.getElementById("report-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Génération du code de suivi anonyme
        const randomCode = "CS-" + Math.floor(1000 + Math.random() * 9000);
        
        // Ajout du signalement dans notre base simulée
        const nouveauDossier = {
            id: randomCode,
            description: document.getElementById("report-desc").value,
            quartier: document.getElementById("report-neighborhood").value,
            preuveTextuelle: document.getElementById("report-evidence").value,
            images: ["https://via.placeholder.com/150"], // image simulée
            statut: "Nouveau",
            urgent: false
        };
        
        dossiers.push(nouveauDossier);
        
        // Affichage du code de suivi
        document.getElementById("tracking-code").innerText = randomCode;
        document.getElementById("success-message").classList.remove("hidden");
        
        // Réinitialisation du formulaire
        document.getElementById("report-form").reset();
        rendreTableauDeBord(); // Met à jour l'espace interne en arrière-plan
    });

    // Connexion Enquêteur
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        // Simulation d'authentification simple
        switchView('dashboard-brigade');
    });

    // Moteur de Recherche Avancé & Corrélation (Déclenchement dynamique à la saisie)
    document.getElementById("search-bar").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        rendreTableauDeBord(query);
    });
});

// Fonction de navigation entre les vues (SPA)
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function logout() {
    switchView('public-portal');
}

// Fonction de construction graphique des cartes de dossiers (Urgents et Généraux)
function rendreTableauDeBord(filtre = "") {
    const urgentContainer = document.getElementById("urgent-cards-container");
    const allContainer = document.getElementById("all-cards-container");
    
    urgentContainer.innerHTML = "";
    allContainer.innerHTML = "";

    dossiers.forEach(dossier => {
        // Appliquer le filtre du moteur de recherche sur la preuve textuelle (corrélation)
        if (filtre && !dossier.preuveTextuelle.toLowerCase().includes(filtre)) {
            return;
        }

        // Création du composant HTML de la carte
        const card = document.createElement("div");
        card.className = `case-card ${dossier.urgent ? 'urgent' : ''}`;
        card.innerHTML = `
            <div class="case-card-header">
                <span>Dossier: #${dossier.id}</span>
                <span>Statut: <strong>${dossier.statut}</strong></span>
            </div>
            <h4>Quartier : ${dossier.quartier}</h4>
            <div class="evidence-badge">${dossier.preuveTextuelle}</div>
            <p>${dossier.description.substring(0, 60)}...</p>
            <button class="btn-flag" onclick="toggleUrgent(event, '${dossier.id}')">🚩</button>
        `;
        
        // Ouvrir le visualiseur au clic sur la carte (sauf si clic sur le drapeau)
        card.addEventListener("click", () => openModal(dossier.id));

        // Distribution dans la bonne colonne
        if (dossier.urgent) {
            urgentContainer.appendChild(card);
        } else {
            allContainer.appendChild(card);
        }
    });
}

// Gestion des Dossiers Urgents via LocalStorage
function toggleUrgent(event, id) {
    event.stopPropagation(); // Évite d'ouvrir le modal en cliquant sur le drapeau
    const dossier = dossiers.find(d => d.id === id);
    if (dossier) {
        dossier.urgent = !dossier.urgent;
        sauvegarderUrgentsDansLocalStorage();
        rendreTableauDeBord();
    }
}

function sauvegarderUrgentsDansLocalStorage() {
    const listUrgentsIds = dossiers.filter(d => d.urgent).map(d => d.id);
    localStorage.setItem("cyberShield_urgents", JSON.stringify(listUrgentsIds));
}

function chargerUrgentsDepuisLocalStorage() {
    const stock = localStorage.getItem("cyberShield_urgents");
    if (stock) {
        const idsUrgents = JSON.parse(stock);
        dossiers.forEach(d => {
            if (idsUrgents.includes(d.id)) {
                d.urgent = true;
            }
        });
    }
}

// Visualiseur de Preuves (Modal d'analyse)
function openModal(id) {
    const dossier = dossiers.find(d => d.id === id);
    if (!dossier) return;

    currentCaseId = id;
    document.getElementById("modal-title").innerText = `Analyse du Dossier #${dossier.id}`;
    document.getElementById("modal-quartier").innerText = dossier.quartier;
    document.getElementById("modal-evidence").innerText = dossier.preuveTextuelle;
    document.getElementById("modal-desc").innerText = dossier.description;
    document.getElementById("modal-status").value = dossier.statut;

    // Remplissage des images
    const imgContainer = document.getElementById("modal-images-container");
    imgContainer.innerHTML = "";
    dossier.images.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        imgContainer.appendChild(img);
    });

    document.getElementById("proof-modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("proof-modal").classList.add("hidden");
    currentCaseId = null;
}

// Action de copie sécurisée des éléments suspects
function copyEvidence() {
    const text = document.getElementById("modal-evidence").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Élément copié dans le presse-papiers de manière sécurisée ! Prêt pour analyse externe.");
    });
}

// Assignation d'un nouveau statut
function updateCurrentCaseStatus() {
    if (!currentCaseId) return;
    const newStatus = document.getElementById("modal-status").value;
    const dossier = dossiers.find(d => d.id === currentCaseId);
    if (dossier) {
        dossier.statut = newStatus;
        rendreTableauDeBord();
    }
}