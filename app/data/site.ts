export const site = {
  nom: "Silas Clamens Albert",
  marque: "SILART",
  url: "https://bysilart.fr",
  email: "contact.silart@gmail.com",
  linkedin: "https://www.linkedin.com/in/silas-clamens-albert-3b46b0327/",
  titrePrincipal: "Développeur web full-stack",
  slogan: "Designer · Développeur · Créatif",
};

/**
 * Infos légales pour la page /mentions-legales.
 * Les champs laissés vides ("") ne sont pas affichés sur la page.
 * Choix de l'éditeur : ne pas publier l'adresse ni le SIRET (éditeur
 * particulier, non immatriculé). Dès qu'un SIRET existe, le renseigner :
 * la mention "éditeur particulier" disparaît alors automatiquement.
 */
export const legal = {
  // Éditeur du site
  editeurNom: "Silas Clamens Albert",
  editeurStatut: "Développeur web & créatif — SILART",
  editeurAdresse: "", // volontairement non publiée (communiquée à l'hébergeur)
  editeurEmail: "contact.silart@gmail.com",
  editeurTelephone: "", // optionnel
  siret: "", // à renseigner dès l'immatriculation d'une micro-entreprise
  tva: "", // n° TVA intracommunautaire si applicable

  // Responsable de la publication
  responsablePublication: "Silas Clamens Albert",

  // Hébergeur du site
  hebergeurNom: "Vercel Inc.", // ⚠️ à adapter selon ton hébergement réel
  hebergeurAdresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  hebergeurSite: "https://vercel.com",

  // Date de dernière mise à jour des mentions
  miseAJour: "juillet 2026",
};
