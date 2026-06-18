/* ============================================================
   CYBERSHIELD — SCRIPT PRINCIPAL (Vanilla JavaScript)
   Fonctionnalités :
     1. Menu mobile
     2. Compteurs animés (hero)
     3. Formulaire multi-étapes + validation
     4. Glisser-déposer fichiers (JPEG/PNG uniquement)
     5. Génération code de suivi anonyme
     6. Suivi de dossier (données simulées)
     7. Connexion Enquêteur (démo)
     8. Dashboard brigade avec cartes dynamiques
     9. Filtrage par statut
    10. Recherche avancée / Corrélation
    11. Modal visualiseur de preuves
    12. Modification de statut
    13. Marquer urgent (localStorage)
   ============================================================ */

/* ============================================================
   DONNÉES SIMULÉES (SEED DATA)
   Minimum 15-20 entrées réalistes à Pointe-Noire
   ============================================================ */
const DOSSIERS_SIMULES = [
  {
    id: "CS-2026-1001",
    typeArnaque: "phishing",
    quartier: "Tié-Tié",
    description: "Faux profil Facebook vendant des téléphones reconditionnés à prix cassé. Paiement demandé via MTN Mobile Money. Téléphone jamais livré.",
    contact: "+242 06 847 1234",
    lien: "https://faux-boutique-tietie.com/promo-iphone",
    date: "2026-06-01",
    statut: "nouveau",
    preuves: []
  },
  {
    id: "CS-2026-1002",
    typeArnaque: "phishing",
    quartier: "Mpaka",
    description: "Lien de phishing reçu par WhatsApp à Mpaka prétendant être Airtel Money : 'Votre compte sera suspendu, vérifiez maintenant'. Le lien copie l'interface Airtel.",
    contact: "+242 05 234 5678",
    lien: "https://airtel-money-verification.faux-site.net",
    date: "2026-06-02",
    statut: "en-cours",
    preuves: []
  },
  {
    id: "CS-2026-1003",
    typeArnaque: "fraude-financiere",
    quartier: "Lumumba",
    description: "Arnaque au dépôt de fonds à Lumumba. Un 'agent' promettait de doubler les dépôts MTN en 24h. Victime a envoyé 50 000 FCFA. L'agent est injoignable.",
    contact: "+242 06 321 9876",
    lien: "",
    date: "2026-06-02",
    statut: "nouveau",
    preuves: []
  },
  {
    id: "CS-2026-1004",
    typeArnaque: "usurpation-identite",
    quartier: "Centre-Ville",
    description: "Faux compte Instagram usurpant l'identité d'un directeur de LCDE (Laboratoire Congo). Sollicite des candidatures avec frais d'inscription de 15 000 FCFA.",
    contact: "faux.lcde.congo@gmail.com",
    lien: "https://instagram.com/faux_lcde_2026",
    date: "2026-06-03",
    statut: "cloture",
    preuves: []
  },
  {
    id: "CS-2026-1005",
    typeArnaque: "mobile-money",
    quartier: "Mbota",
    description: "SMS reçu prétendant venir de MTN Congo : 'Vous avez gagné un prix de 200 000 FCFA. Envoyez 5000 FCFA pour recevoir votre gain.' Numéro inconnu +242 06 000 1234.",
    contact: "+242 06 000 1234",
    lien: "",
    date: "2026-06-03",
    statut: "nouveau",
    preuves: []
  },
  {
    id: "CS-2026-1006",
    typeArnaque: "phishing",
    quartier: "Vindoulou",
    description: "Email frauduleux copiant l'interface La Congolaise de Banque demandant de mettre à jour les coordonnées bancaires via un faux formulaire en ligne.",
    contact: "noreply.lcb-verification@fake-bank.com",
    lien: "https://lcb-update-info.fraud-site.com/formulaire",
    date: "2026-06-04",
    statut: "en-cours",
    preuves: []
  },
  {
    id: "CS-2026-1007",
    typeArnaque: "fraude-financiere",
    quartier: "Mongo-Poukou",
    description: "Arnaque au faux investissement crypto via Telegram. Groupe 'CongoCrypto Profit' promet 300% de rendement. Victime a perdu 150 000 FCFA en Airtel Money.",
    contact: "+242 05 777 4321",
    lien: "https://t.me/CongoCryptoProfit_faux",
    date: "2026-06-04",
    statut: "nouveau",
    preuves: []
  },
  {
    id: "CS-2026-1008",
    typeArnaque: "usurpation-identite",
    quartier: "Plateau",
    description: "Faux recruteur usurpant l'identité de TotalEnergies Congo. Propose des emplois fictifs moyennant des frais de dossier de 25 000 FCFA payés sur Mobile Money.",
    contact: "recrutement.total-congo@gmail-faux.com",
    lien: "",
    date: "2026-06-05",
    statut: "en-cours",
    preuves: []
  },
  {
    id: "CS-2026-1009",
    typeArnaque: "mobile-money",
    quartier: "Mvou-Mvou",
    description: "Faux agent Airtel contactant des clients pour une 'mise à niveau du compte'. Demande code PIN et code OTP reçu par SMS pour 'vérification identité'.",
    contact: "+242 06 111 2222",
    lien: "",
    date: "2026-06-05",
    statut: "nouveau",
    preuves: []
  },
  {
    id: "CS-2026-1010",
    typeArnaque: "phishing",
    quartier: "Nkombo",
    description: "Fausse page de connexion MTN Mobile Money hébergée sur un domaine similaire. Lien envoyé par SMS en masse dans le quartier Nkombo le 5 juin 2026.",
    contact: "+242 06 847 1234",
    lien: "https://mtn-mobilemoney-pn.faux-login.com",
    date: "2026-06-06",
    statut: "en-cours",
    preuves: []
  },
  {
    id: "CS-2026-1011",
    typeArnaque: "fraude-financiere",
    quartier: "Bas-Kouilou",
    description: "Faux loterie nationale par SMS : 'Vous avez gagné 500 000 FCFA à la loterie nationale. Appelez ce numéro.' Frais de déblocage réclamés.",
    contact: "+242 05 999 0001",
    lien: "",
    date: "2026-06-06",
    statut: "cloture",
    preuves: []
  },
  {
    id: "CS-2026-1012",
    typeArnaque: "usurpation-identite",
    quartier: "Louango",
    description: "Faux compte Facebook du maire de Pointe-Noire demandant des contributions pour un projet humanitaire. Collecte via Mobile Money sur numéro inconnu.",
    contact: "+242 06 444 5555",
    lien: "https://facebook.com/faux-mairie-pn-2026",
    date: "2026-06-07",
    statut: "nouveau",
    preuves: []
  },
  {
    id: "CS-2026-1013",
    typeArnaque: "phishing",
    quartier: "Tié-Tié",
    description: "Deuxième victime du même numéro +242 06 847 1234 signalant un faux site de vente sur Facebook Marketplace. Article commandé, argent envoyé, pas de livraison.",
    contact: "+242 06 847 1234",
    lien: "https://marketplace-faux.facebook-pn.com",
    date: "2026-06-08",
    statut: "en-cours",
    preuves: []
  },
  {
    id: "CS-2026-1014",
    typeArnaque: "mobile-money",
    quartier: "Centre-Ville",
    description: "Arnaque à la recharge : SMS promettant une recharge gratuite de 10 000 FCFA en échange d'une 'recharge test' de 2 000 FCFA envoyée à un numéro inconnu.",
    contact: "+242 05 123 4567",
    lien: "",
    date: "2026-06-09",
    statut: "nouveau",
    preuves: []
  },
  {
    id: "CS-2026-1015",
    typeArnaque: "fraude-financiere",
    quartier: "Mpaka",
    description: "Même numéro +242 05 234 5678 associé à une arnaque d'investissement agricole fictif. Promet des rendements sur vente de manioc exporté vers le Gabon.",
    contact: "+242 05 234 5678",
    lien: "",
    date: "2026-06-10",
    statut: "nouveau",
    preuves: []
  },
  {
    id: "CS-2026-1016",
    typeArnaque: "phishing",
    quartier: "Mbota",
    description: "Fausse application bancaire téléchargeable via lien WhatsApp. Simule l'interface de Ecobank Congo et collecte les identifiants des utilisateurs.",
    contact: "app-ecobank-update@fake-apk.net",
    lien: "https://update-ecobank-apk.com/ecobank_congo.apk",
    date: "2026-06-11",
    statut: "en-cours",
    preuves: []
  },
  {
    id: "CS-2026-1017",
    typeArnaque: "usurpation-identite",
    quartier: "Vindoulou",
    description: "Faux conseiller de l'Ambassade de France contactant par mail pour des faux visas. Demande paiement de frais consulaires via Mobile Money au lieu du consulat.",
    contact: "visa.france.congo.pn@gmail-consulat-faux.com",
    lien: "",
    date: "2026-06-12",
    statut: "cloture",
    preuves: []
  },
  {
    id: "CS-2026-1018",
    typeArnaque: "fraude-financiere",
    quartier: "Lumumba",
    description: "Troisième victime liée à l'arnaque au doublement d'argent à Lumumba. Même modus operandi, même numéro +242 06 321 9876. Réseau d'arnaqueurs sériels confirmé.",
    contact: "+242 06 321 9876",
    lien: "",
    date: "2026-06-13",
    statut: "en-cours",
    preuves: []
  }
];

/* Données de suivi simulées pour citoyens */
const SUIVI_SIMULE = {
  "CS-2026-1001": { statut: "nouveau",  type: "Phishing", date: "01/06/2026", quartier: "Tié-Tié" },
  "CS-2026-1002": { statut: "en-cours", type: "Phishing", date: "02/06/2026", quartier: "Mpaka" },
  "CS-2026-1003": { statut: "nouveau",  type: "Fraude Financière", date: "02/06/2026", quartier: "Lumumba" },
  "CS-2026-1004": { statut: "cloture",  type: "Usurpation d'identité", date: "03/06/2026", quartier: "Centre-Ville" },
  "CS-2026-1018": { statut: "en-cours", type: "Fraude Financière", date: "13/06/2026", quartier: "Lumumba" }
};

/* ============================================================
   1. MENU MOBILE
   ============================================================ */
(function initMenuMobile() {
  const boutonMenu = document.getElementById('bouton-menu-mobile');
  const menuMobile = document.getElementById('menu-mobile');
  if (!boutonMenu || !menuMobile) return;

  boutonMenu.addEventListener('click', function () {
    const estOuvert = menuMobile.classList.toggle('menu-mobile-ouvert');
    menuMobile.classList.toggle('menu-mobile-ferme', !estOuvert);
    boutonMenu.setAttribute('aria-expanded', estOuvert);
  });

  /* Fermer le menu au clic sur un lien */
  menuMobile.querySelectorAll('.lien-mobile').forEach(function (lien) {
    lien.addEventListener('click', function () {
      menuMobile.classList.remove('menu-mobile-ouvert');
      menuMobile.classList.add('menu-mobile-ferme');
      boutonMenu.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ============================================================
   2. COMPTEURS ANIMÉS (HERO)
   ============================================================ */
(function initCompteurs() {
  const chiffres = document.querySelectorAll('.stat-chiffre');
  if (!chiffres.length) return;

  function animer(element) {
    const cible = parseInt(element.dataset.cible, 10);
    const duree = 1800;
    const debut = performance.now();

    function etape(maintenant) {
      const elapsed = maintenant - debut;
      const progres = Math.min(elapsed / duree, 1);
      /* Ease-out cubique */
      const valeur = Math.floor(cible * (1 - Math.pow(1 - progres, 3)));
      element.textContent = valeur;
      if (progres < 1) requestAnimationFrame(etape);
    }

    requestAnimationFrame(etape);
  }

  /* Lancer l'animation quand le hero est visible */
  const observateur = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (entree) {
      if (entree.isIntersecting) {
        chiffres.forEach(animer);
        observateur.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const hero = document.getElementById('section-hero');
  if (hero) observateur.observe(hero);
})();


/* ============================================================
   3. FORMULAIRE MULTI-ÉTAPES
   ============================================================ */
(function initFormulaire() {
  /* --- Sélection du type d'arnaque --- */
  const cartesType = document.querySelectorAll('.carte-type');
  const inputTypeArnaque = document.getElementById('type-arnaque');

  cartesType.forEach(function (carte) {
    carte.addEventListener('click', function () {
      cartesType.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      carte.setAttribute('aria-pressed', 'true');
      if (inputTypeArnaque) inputTypeArnaque.value = carte.dataset.valeur;
    });
  });

  /* --- Compteur de caractères description --- */
  const descriptionTextarea = document.getElementById('description-arnaque');
  const compteDesc = document.getElementById('compte-desc');

  if (descriptionTextarea && compteDesc) {
    descriptionTextarea.addEventListener('input', function () {
      compteDesc.textContent = descriptionTextarea.value.length;
    });
  }

  /* --- Navigation entre étapes --- */
  function afficherEtape(numeroEtape) {
    document.querySelectorAll('.etape-formulaire').forEach(function (etape) {
      etape.classList.add('cachee');
    });
    const etapeCible = document.getElementById('etape-' + numeroEtape);
    if (etapeCible) {
      etapeCible.classList.remove('cachee');
      /* Scroll vers le formulaire en mobile */
      etapeCible.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* Étape 1 → 2 */
  const btnEtape2 = document.getElementById('btn-etape-2');
  if (btnEtape2) {
    btnEtape2.addEventListener('click', function () {
      if (!validerEtape1()) return;
      afficherEtape(2);
    });
  }

  /* Étape 2 → 1 (retour) */
  const btnRetour1 = document.getElementById('btn-retour-1');
  if (btnRetour1) btnRetour1.addEventListener('click', function () { afficherEtape(1); });

  /* Étape 2 → 3 */
  const btnEtape3 = document.getElementById('btn-etape-3');
  if (btnEtape3) btnEtape3.addEventListener('click', function () { afficherEtape(3); });

  /* Étape 3 → 2 (retour) */
  const btnRetour2 = document.getElementById('btn-retour-2');
  if (btnRetour2) btnRetour2.addEventListener('click', function () { afficherEtape(2); });

  /* --- Validation étape 1 --- */
  function validerEtape1() {
    const type = inputTypeArnaque ? inputTypeArnaque.value : '';
    const quartier = document.getElementById('quartier-victime');
    const description = descriptionTextarea;
    let valide = true;

    if (!type) {
      afficherErreurChamp('groupe-type-arnaque', 'Veuillez sélectionner un type d\'escroquerie.');
      valide = false;
    }

    if (quartier && !quartier.value) {
      afficherErreurChamp('quartier-victime', 'Veuillez sélectionner votre quartier.');
      valide = false;
    }

    if (description && description.value.trim().length < 30) {
      afficherErreurChamp('description-arnaque', 'Décrivez l\'arnaque en au moins 30 caractères.');
      valide = false;
    }

    return valide;
  }

  function afficherErreurChamp(idChamp, message) {
    const champ = document.getElementById(idChamp);
    if (!champ) return;
    champ.style.border = '2px solid var(--couleur-nouveau)';
    champ.focus();

    /* Supprimer l'erreur à la prochaine saisie */
    champ.addEventListener('change', function () {
      champ.style.border = '';
    }, { once: true });

    alert(message); /* Simple pour version académique */
  }

  /* --- Soumission finale --- */
  const btnSoumettre = document.getElementById('btn-soumettre');
  if (btnSoumettre) {
    btnSoumettre.addEventListener('click', function () {
      const consentement = document.getElementById('consentement');
      if (!consentement || !consentement.checked) {
        alert('Veuillez cocher la case de consentement avant d\'envoyer.');
        return;
      }

      /* Simuler envoi : générer code de suivi */
      const codeSuivi = genererCodeSuivi();
      const elementCode = document.getElementById('code-suivi-genere');
      if (elementCode) elementCode.textContent = codeSuivi;

      /* Ajouter au suivi local simulé */
      const typeVal = inputTypeArnaque ? inputTypeArnaque.value : 'phishing';
      const quartierVal = document.getElementById('quartier-victime');
      SUIVI_SIMULE[codeSuivi] = {
        statut: 'nouveau',
        type: nomTypeLisible(typeVal),
        date: new Date().toLocaleDateString('fr-FR'),
        quartier: quartierVal ? quartierVal.options[quartierVal.selectedIndex].text : '—'
      };

      afficherEtape('confirmation');
    });
  }

  function genererCodeSuivi() {
    const nombre = Math.floor(1000 + Math.random() * 9000);
    return 'CS-2026-' + nombre;
  }

  /* Copier le code de suivi */
  const btnCopierCode = document.getElementById('btn-copier-code');
  if (btnCopierCode) {
    btnCopierCode.addEventListener('click', function () {
      const code = document.getElementById('code-suivi-genere');
      if (code && navigator.clipboard) {
        navigator.clipboard.writeText(code.textContent).then(function () {
          btnCopierCode.textContent = '✅ Copié !';
          setTimeout(function () { btnCopierCode.textContent = '📋 Copier'; }, 2000);
        });
      }
    });
  }
})();


/* ============================================================
   4. GLISSER-DÉPOSER FICHIERS (JPEG/PNG UNIQUEMENT)
   ============================================================ */
(function initDepotFichiers() {
  const zoneDragDrop = document.getElementById('zone-depot-fichiers');
  const inputFichiers = document.getElementById('input-fichiers');
  const apercuFichiers = document.getElementById('apercu-fichiers');
  const erreurFichier = document.getElementById('message-erreur-fichier');

  if (!zoneDragDrop || !inputFichiers) return;

  /* Types autorisés (JPEG et PNG uniquement — exigence sécurité PDF) */
  const TYPES_AUTORISES = ['image/jpeg', 'image/png'];
  const TAILLE_MAX_MO = 5;

  function validerFichier(fichier) {
    if (!TYPES_AUTORISES.includes(fichier.type)) {
      return 'Le fichier "' + fichier.name + '" n\'est pas autorisé. Seuls JPEG et PNG sont acceptés.';
    }
    if (fichier.size > TAILLE_MAX_MO * 1024 * 1024) {
      return 'Le fichier "' + fichier.name + '" dépasse la taille maximale de ' + TAILLE_MAX_MO + ' Mo.';
    }
    return null;
  }

  function afficherApercu(fichier) {
    const erreur = validerFichier(fichier);
    if (erreur) {
      if (erreurFichier) {
        erreurFichier.textContent = erreur;
        erreurFichier.classList.remove('cachee');
      }
      return;
    }

    if (erreurFichier) erreurFichier.classList.add('cachee');

    const lecteur = new FileReader();
    lecteur.onload = function (e) {
      const div = document.createElement('div');
      div.className = 'apercu-item';

      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Capture : ' + fichier.name;

      const btnSupprimer = document.createElement('button');
      btnSupprimer.type = 'button';
      btnSupprimer.className = 'btn-supprimer';
      btnSupprimer.textContent = '✕';
      btnSupprimer.setAttribute('aria-label', 'Supprimer cette capture');
      btnSupprimer.addEventListener('click', function () { div.remove(); });

      div.appendChild(img);
      div.appendChild(btnSupprimer);
      if (apercuFichiers) apercuFichiers.appendChild(div);
    };
    lecteur.readAsDataURL(fichier);
  }

  /* Clic sur la zone */
  zoneDragDrop.addEventListener('click', function (e) {
    if (!e.target.closest('.btn-supprimer')) {
      inputFichiers.click();
    }
  });

  /* Clavier (accessibilité) */
  zoneDragDrop.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputFichiers.click();
    }
  });

  /* Sélection via l'input */
  inputFichiers.addEventListener('change', function () {
    Array.from(inputFichiers.files).forEach(afficherApercu);
  });

  /* Glisser-déposer */
  zoneDragDrop.addEventListener('dragover', function (e) {
    e.preventDefault();
    zoneDragDrop.classList.add('survol-actif');
  });

  zoneDragDrop.addEventListener('dragleave', function () {
    zoneDragDrop.classList.remove('survol-actif');
  });

  zoneDragDrop.addEventListener('drop', function (e) {
    e.preventDefault();
    zoneDragDrop.classList.remove('survol-actif');
    Array.from(e.dataTransfer.files).forEach(afficherApercu);
  });
})();


/* ============================================================
   5. SUIVI DE DOSSIER (PORTAIL PUBLIC)
   ============================================================ */
(function initSuivi() {
  const inputCode = document.getElementById('input-code-suivi');
  const btnRechercher = document.getElementById('btn-rechercher-dossier');
  const resultSuivi = document.getElementById('resultat-suivi');
  const erreurSuivi = document.getElementById('erreur-suivi');

  if (!btnRechercher) return;

  btnRechercher.addEventListener('click', rechercherDossier);
  if (inputCode) {
    inputCode.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') rechercherDossier();
    });
  }

  function rechercherDossier() {
    if (!inputCode) return;
    const code = inputCode.value.trim().toUpperCase();

    if (resultSuivi) resultSuivi.classList.add('cachee');
    if (erreurSuivi) erreurSuivi.classList.add('cachee');

    if (!code) {
      if (erreurSuivi) {
        erreurSuivi.textContent = 'Entrez votre code de suivi.';
        erreurSuivi.classList.remove('cachee');
      }
      return;
    }

    const dossier = SUIVI_SIMULE[code];

    if (!dossier) {
      if (erreurSuivi) {
        erreurSuivi.textContent = 'Aucun dossier trouvé avec le code "' + code + '". Vérifiez la saisie.';
        erreurSuivi.classList.remove('cachee');
      }
      return;
    }

    /* Afficher les informations */
    const refEl = document.getElementById('ref-dossier-suivi');
    const badgeEl = document.getElementById('badge-statut-suivi');
    const typeEl = document.getElementById('type-dossier-suivi');
    const dateEl = document.getElementById('date-dossier-suivi');
    const quartierEl = document.getElementById('quartier-dossier-suivi');

    if (refEl) refEl.textContent = code;
    if (badgeEl) {
      badgeEl.textContent = libellStatut(dossier.statut);
      badgeEl.className = 'badge-statut statut-' + dossier.statut;
    }
    if (typeEl) typeEl.textContent = dossier.type;
    if (dateEl) dateEl.textContent = dossier.date;
    if (quartierEl) quartierEl.textContent = dossier.quartier;

    /* Frise chronologique */
    mettreAJourFriseStatut(dossier.statut);

    if (resultSuivi) resultSuivi.classList.remove('cachee');
  }

  function mettreAJourFriseStatut(statut) {
    const etapeNouveau = document.getElementById('statut-nouveau');
    const etapeAnalyse = document.getElementById('statut-analyse');
    const etapeCloture = document.getElementById('statut-cloture');

    if (etapeNouveau) etapeNouveau.className = 'etape-statut terminee';
    if (etapeAnalyse) etapeAnalyse.className = 'etape-statut' + (statut === 'en-cours' || statut === 'cloture' ? ' terminee' : '');
    if (etapeCloture) etapeCloture.className = 'etape-statut' + (statut === 'cloture' ? ' terminee' : '');
  }
})();


/* ============================================================
   6. CONNEXION BRIGADE (DÉMO)
   ============================================================ */
(function initConnexionBrigade() {
  const btnConnexion = document.getElementById('btn-connexion');
  const btnDeconnexion = document.getElementById('btn-deconnexion');
  const zoneConnexion = document.getElementById('zone-connexion-brigade');
  const dashboardBrigade = document.getElementById('dashboard-brigade');
  const btnVoirMdp = document.getElementById('btn-voir-mdp');
  const champMdp = document.getElementById('mot-de-passe-enqueteur');

  /* Identifiants de démo */
  const IDENTIFIANTS_DEMO = { ADMIN: 'brigade2026' };

  if (btnConnexion) {
    btnConnexion.addEventListener('click', function () {
      const matricule = document.getElementById('matricule-enqueteur');
      const motDePasse = document.getElementById('mot-de-passe-enqueteur');

      if (!matricule || !motDePasse) return;

      const mat = matricule.value.trim().toUpperCase();
      const mdp = motDePasse.value;

      if (IDENTIFIANTS_DEMO[mat] && IDENTIFIANTS_DEMO[mat] === mdp) {
        /* Connexion réussie */
        if (zoneConnexion) zoneConnexion.classList.add('cachee');
        if (dashboardBrigade) dashboardBrigade.classList.remove('cachee');

        /* Afficher le nom de l'enquêteur */
        const nomAffiche = document.getElementById('nom-enqueteur-affiche');
        if (nomAffiche) nomAffiche.textContent = 'Enquêteur ' + mat;

        /* Charger les dossiers */
        chargerDossiers('tous');
      } else {
        alert('Matricule ou mot de passe incorrect. Essayez : ADMIN / brigade2026');
      }
    });
  }

  /* Déconnexion */
  if (btnDeconnexion) {
    btnDeconnexion.addEventListener('click', function () {
      if (dashboardBrigade) dashboardBrigade.classList.add('cachee');
      if (zoneConnexion) zoneConnexion.classList.remove('cachee');
      /* Réinitialiser les champs */
      const matricule = document.getElementById('matricule-enqueteur');
      const motDePasse = document.getElementById('mot-de-passe-enqueteur');
      if (matricule) matricule.value = '';
      if (motDePasse) motDePasse.value = '';
    });
  }

  /* Afficher/masquer mot de passe */
  if (btnVoirMdp && champMdp) {
    btnVoirMdp.addEventListener('click', function () {
      const visible = champMdp.type === 'text';
      champMdp.type = visible ? 'password' : 'text';
      btnVoirMdp.textContent = visible ? '👁' : '🙈';
    });
  }
})();


/* ============================================================
   7. DASHBOARD – CHARGEMENT ET AFFICHAGE DES DOSSIERS
   ============================================================ */
/* Récupérer les urgents depuis localStorage */
function getUrgents() {
  try {
    return JSON.parse(localStorage.getItem('cybershield_urgents') || '[]');
  } catch (e) {
    return [];
  }
}

function setUrgents(liste) {
  localStorage.setItem('cybershield_urgents', JSON.stringify(liste));
}

function estUrgent(id) {
  return getUrgents().indexOf(id) !== -1;
}

function basculerUrgent(id) {
  const urgents = getUrgents();
  const idx = urgents.indexOf(id);
  if (idx === -1) {
    urgents.push(id);
  } else {
    urgents.splice(idx, 1);
  }
  setUrgents(urgents);
  return idx === -1; /* true si maintenant urgent */
}

function chargerDossiers(filtre) {
  const grille = document.getElementById('grille-dossiers-brigade');
  if (!grille) return;

  /* Trier : urgents en premier */
  let dossiersTries = DOSSIERS_SIMULES.slice();
  dossiersTries.sort(function (a, b) {
    return estUrgent(b.id) - estUrgent(a.id);
  });

  /* Filtrer */
  let dossiersFiltre;
  if (filtre === 'tous') {
    dossiersFiltre = dossiersTries;
  } else if (filtre === 'urgent') {
    dossiersFiltre = dossiersTries.filter(function (d) { return estUrgent(d.id); });
  } else {
    dossiersFiltre = dossiersTries.filter(function (d) { return d.statut === filtre; });
  }

  grille.innerHTML = '';

  if (dossiersFiltre.length === 0) {
    grille.innerHTML = '<p style="color: rgba(255,255,255,0.4); font-size: 0.9rem; padding: 2rem;">Aucun dossier dans cette catégorie.</p>';
    return;
  }

  dossiersFiltre.forEach(function (dossier) {
    const carte = creerCarteDossier(dossier);
    grille.appendChild(carte);
  });
}

function creerCarteDossier(dossier) {
  const urgent = estUrgent(dossier.id);
  const div = document.createElement('div');
  div.className = 'carte-dossier' + (urgent ? ' urgent' : '');
  div.setAttribute('data-id', dossier.id);
  div.setAttribute('role', 'button');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', 'Ouvrir le dossier ' + dossier.id);

  div.innerHTML =
    (urgent ? '<span class="icone-epingle">📌</span>' : '') +
    '<div class="entete-carte">' +
      '<span class="ref-carte">' + dossier.id + '</span>' +
      '<div class="badges-carte">' +
        '<span class="badge-statut statut-' + dossier.statut + '">' + libellStatut(dossier.statut) + '</span>' +
        '<span class="badge-type type-' + dossier.typeArnaque + '">' + nomTypeLisible(dossier.typeArnaque) + '</span>' +
      '</div>' +
    '</div>' +
    '<p class="titre-carte">' + echapper(dossier.description.substring(0, 100)) + '…</p>' +
    '<div class="meta-carte">' +
      '<span>📍 ' + echapper(dossier.quartier) + '</span>' +
      '<span>📅 ' + dossier.date + '</span>' +
      (dossier.contact ? '<span>📞 ' + echapper(dossier.contact) + '</span>' : '') +
    '</div>';

  div.addEventListener('click', function () { ouvrirModal(dossier); });
  div.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrirModal(dossier); }
  });

  return div;
}


/* ============================================================
   8. FILTRES DE STATUT
   ============================================================ */
(function initFiltres() {
  const boutonsFiltres = document.querySelectorAll('.btn-filtre');
  boutonsFiltres.forEach(function (btn) {
    btn.addEventListener('click', function () {
      boutonsFiltres.forEach(function (b) { b.classList.remove('actif'); });
      btn.classList.add('actif');
      chargerDossiers(btn.dataset.filtre);
    });
  });
})();


/* ============================================================
   9. RECHERCHE AVANCÉE / CORRÉLATION
   ============================================================ */
(function initRechercheAvancee() {
  const btnRecherche = document.getElementById('btn-recherche-avancee');
  const inputRecherche = document.getElementById('input-recherche-avancee');
  const zoneResultats = document.getElementById('zone-resultat-correlation');
  const listeResultats = document.getElementById('liste-resultats-correlation');
  const nbResultats = document.getElementById('nb-resultats-correlation');
  const btnFermer = document.getElementById('btn-fermer-correlation');

  if (!btnRecherche) return;

  btnRecherche.addEventListener('click', lancerRecherche);
  if (inputRecherche) {
    inputRecherche.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') lancerRecherche();
    });
  }

  function lancerRecherche() {
    if (!inputRecherche) return;
    const terme = inputRecherche.value.trim().toLowerCase();
    if (!terme) return;

    /* Scanner tous les champs de tous les dossiers */
    const resultats = DOSSIERS_SIMULES.filter(function (d) {
      return (
        d.id.toLowerCase().includes(terme) ||
        d.description.toLowerCase().includes(terme) ||
        d.quartier.toLowerCase().includes(terme) ||
        d.contact.toLowerCase().includes(terme) ||
        d.lien.toLowerCase().includes(terme) ||
        d.typeArnaque.toLowerCase().includes(terme)
      );
    });

    if (listeResultats) {
      listeResultats.innerHTML = '';
      resultats.forEach(function (d) {
        const carte = creerCarteDossier(d);
        listeResultats.appendChild(carte);
      });
    }

    if (nbResultats) {
      nbResultats.textContent = resultats.length + ' dossier(s) trouvé(s)';
    }

    if (zoneResultats) zoneResultats.classList.remove('cachee');
    if (zoneResultats) zoneResultats.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (btnFermer) {
    btnFermer.addEventListener('click', function () {
      if (zoneResultats) zoneResultats.classList.add('cachee');
      if (inputRecherche) inputRecherche.value = '';
    });
  }
})();


/* ============================================================
   10. MODAL VISUALISEUR DE PREUVES
   ============================================================ */
let dossierEnCours = null;

function ouvrirModal(dossier) {
  dossierEnCours = dossier;
  const modal = document.getElementById('modal-dossier');
  const fondModal = document.getElementById('fond-modal');

  if (!modal) return;

  /* Remplir les informations */
  const titreModal = document.getElementById('titre-modal-dossier');
  if (titreModal) titreModal.textContent = 'Dossier ' + dossier.id;

  const badgeStatut = document.getElementById('modal-badge-statut');
  if (badgeStatut) {
    badgeStatut.textContent = libellStatut(dossier.statut);
    badgeStatut.className = 'badge-statut statut-' + dossier.statut;
  }

  const badgeType = document.getElementById('modal-badge-type');
  if (badgeType) {
    badgeType.textContent = nomTypeLisible(dossier.typeArnaque);
    badgeType.className = 'badge-type type-' + dossier.typeArnaque;
  }

  const badgeUrgent = document.getElementById('modal-badge-urgent');
  if (badgeUrgent) {
    estUrgent(dossier.id) ? badgeUrgent.classList.remove('cachee') : badgeUrgent.classList.add('cachee');
  }

  const elementsInfo = {
    'modal-quartier': dossier.quartier || '—',
    'modal-date': dossier.date || '—',
    'modal-contact-escroc': dossier.contact || 'Non renseigné',
    'modal-description': dossier.description || '—'
  };

  Object.keys(elementsInfo).forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = elementsInfo[id];
  });

  /* Lien suspect */
  const lienEl = document.getElementById('modal-lien-suspect');
  const btnCopierLien = document.getElementById('btn-copier-lien');
  if (lienEl) {
    if (dossier.lien) {
      lienEl.textContent = dossier.lien;
      if (btnCopierLien) {
        btnCopierLien.classList.remove('cachee');
        btnCopierLien.onclick = function () {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(dossier.lien).then(function () {
              btnCopierLien.textContent = '✅ Copié !';
              setTimeout(function () { btnCopierLien.textContent = '📋 Copier le lien'; }, 2000);
            });
          }
        };
      }
    } else {
      lienEl.textContent = 'Aucun lien fourni';
      if (btnCopierLien) btnCopierLien.classList.add('cachee');
    }
  }

  /* Galerie de preuves */
  const galerie = document.getElementById('galerie-preuves');
  const msgAucune = document.getElementById('msg-aucune-preuve');
  if (galerie) {
    galerie.innerHTML = '';
    if (dossier.preuves && dossier.preuves.length > 0) {
      if (msgAucune) msgAucune.style.display = 'none';
      dossier.preuves.forEach(function (src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Preuve numérique';
        img.className = 'image-preuve';
        galerie.appendChild(img);
      });
    } else {
      if (msgAucune) msgAucune.style.display = 'block';
    }
  }

  /* Bouton urgent */
  const btnUrgent = document.getElementById('btn-marquer-urgent');
  if (btnUrgent) {
    mettreAJourBoutonUrgent(dossier.id);
  }

  /* Ouvrir */
  modal.classList.remove('cachee');
  if (fondModal) fondModal.classList.remove('cachee');
  document.body.style.overflow = 'hidden';
}

function fermerModal() {
  const modal = document.getElementById('modal-dossier');
  const fondModal = document.getElementById('fond-modal');
  if (modal) modal.classList.add('cachee');
  if (fondModal) fondModal.classList.add('cachee');
  document.body.style.overflow = '';
  dossierEnCours = null;
}

/* Fermer le modal */
document.addEventListener('DOMContentLoaded', function () {
  const btnFermerModal = document.getElementById('btn-fermer-modal');
  const fondModal = document.getElementById('fond-modal');

  if (btnFermerModal) btnFermerModal.addEventListener('click', fermerModal);
  if (fondModal) fondModal.addEventListener('click', fermerModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fermerModal();
  });

  /* --- Changement de statut dans la modal --- */
  document.querySelectorAll('.btn-statut').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!dossierEnCours) return;
      const nouveauStatut = btn.dataset.statut;
      dossierEnCours.statut = nouveauStatut;

      /* Mettre à jour le badge dans la modal */
      const badgeStatut = document.getElementById('modal-badge-statut');
      if (badgeStatut) {
        badgeStatut.textContent = libellStatut(nouveauStatut);
        badgeStatut.className = 'badge-statut statut-' + nouveauStatut;
      }

      /* Recharger la grille */
      const filtreActif = document.querySelector('.btn-filtre.actif');
      chargerDossiers(filtreActif ? filtreActif.dataset.filtre : 'tous');

      /* Notification visuelle */
      btn.textContent = '✅ Statut mis à jour';
      setTimeout(function () {
        btn.textContent = btn.dataset.statut === 'nouveau' ? '🔴 Nouveau'
          : btn.dataset.statut === 'en-cours' ? '🔵 En cours' : '🟢 Clôturé';
      }, 1500);
    });
  });

  /* --- Marquer urgent (localStorage) --- */
  const btnUrgent = document.getElementById('btn-marquer-urgent');
  if (btnUrgent) {
    btnUrgent.addEventListener('click', function () {
      if (!dossierEnCours) return;
      const maintenant = basculerUrgent(dossierEnCours.id);
      mettreAJourBoutonUrgent(dossierEnCours.id);

      /* Mettre à jour le badge urgent dans la modal */
      const badgeUrgent = document.getElementById('modal-badge-urgent');
      if (badgeUrgent) {
        maintenant ? badgeUrgent.classList.remove('cachee') : badgeUrgent.classList.add('cachee');
      }

      /* Recharger la grille */
      const filtreActif = document.querySelector('.btn-filtre.actif');
      chargerDossiers(filtreActif ? filtreActif.dataset.filtre : 'tous');
    });
  }
});

function mettreAJourBoutonUrgent(id) {
  const btnUrgent = document.getElementById('btn-marquer-urgent');
  if (!btnUrgent) return;
  if (estUrgent(id)) {
    btnUrgent.textContent = '✅ Retirer l\'urgence';
    btnUrgent.classList.add('urgent-actif');
  } else {
    btnUrgent.textContent = '🚨 Marquer comme Urgent';
    btnUrgent.classList.remove('urgent-actif');
  }
}


/* ============================================================
   FONCTIONS UTILITAIRES
   ============================================================ */
function libellStatut(statut) {
  const libelles = {
    'nouveau': 'Nouveau',
    'en-cours': 'En cours',
    'cloture': 'Clôturé'
  };
  return libelles[statut] || statut;
}

function nomTypeLisible(type) {
  const noms = {
    'phishing': 'Phishing',
    'fraude-financiere': 'Fraude Financière',
    'usurpation-identite': 'Usurpation d\'identité',
    'mobile-money': 'Mobile Money'
  };
  return noms[type] || type;
}

function echapper(texte) {
  if (!texte) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(texte));
  return div.innerHTML;
}


/* ============================================================
   ANIMATION SCROLL – APPARITION DES ÉLÉMENTS
   ============================================================ */
(function initAnimationScroll() {
  const cibles = document.querySelectorAll('.carte-dossier, .conteneur-formulaire, .conteneur-suivi, .conteneur-connexion');

  if (!window.IntersectionObserver) return;

  const observateur = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (entree) {
      if (entree.isIntersecting) {
        entree.target.style.opacity = '1';
        entree.target.style.transform = 'translateY(0)';
        observateur.unobserve(entree.target);
      }
    });
  }, { threshold: 0.1 });

  cibles.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observateur.observe(el);
  });
})();