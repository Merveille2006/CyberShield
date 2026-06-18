// GESTION DU FORMULAIRE DE SIGNALEMENT
const formPlainte = document.getElementById('formulaire-plainte');
if (formPlainte) {
  formPlainte.addEventListener('submit', function(e) {
    e.preventDefault();
    const codeGen = "CS-2026-" + Math.floor(Math.random() * 9000 + 1000);
    document.getElementById('code-genere').innerText = codeGen;
    document.getElementById('message-succes').classList.remove('cache');
    this.reset();
  });
}

// GESTION DU DASHBOARD
const listeGlobale = document.getElementById('liste-globale');
if (listeGlobale) {
    // Ton code existant pour afficher les dossiers (renderDashboard)
    renderDashboard(); 
}