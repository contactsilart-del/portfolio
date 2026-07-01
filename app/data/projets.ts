export type Pole = "dev" | "branding" | "audiovisuel";

export type Projet = {
  slug: string;
  titre: string;
  pole: Pole;
  type: string;
  resume: string;
  description: string[];
  tags: string[];
  role?: string;
  annee?: string;
  lien: string | null;
  lienLabel: string | null;
};

export const poles: { id: Pole; titre: string; sousTitre: string }[] = [
  {
    id: "dev",
    titre: "Développement web & UI/UX",
    sousTitre: "Sites sur mesure, e-commerce et intégration front/back.",
  },
  {
    id: "branding",
    titre: "Branding & design",
    sousTitre: "Identités visuelles, stratégie de marque et print.",
  },
  {
    id: "audiovisuel",
    titre: "Audiovisuel & contenu",
    sousTitre: "Vidéo, photo, VFX et prises de vues aériennes.",
  },
];

export const projets: Projet[] = [
  // ── Développement web & UI/UX ─────────────────────────────
  {
    slug: "van-alaska",
    titre: "Van Alaska",
    pole: "dev",
    type: "Site de réservation",
    resume:
      "Site complet de location d'un van vintage : calendrier de disponibilités, paiement d'acompte en ligne, espace client et back-office d'administration.",
    description: [
      "Van Alaska est une application web full-stack de location d'un van aménagé. Le visiteur consulte les disponibilités sur un calendrier en temps réel, réserve ses dates et règle son acompte directement en ligne.",
      "Côté client, un espace personnel permet de suivre ses réservations. Côté gérant, un back-office d'administration donne la main sur les dates, les tarifs et les réservations sans jamais toucher au code.",
      "Le projet couvre toute la chaîne : conception de l'interface, développement front et back, intégration du paiement Stripe, base de données Prisma/PostgreSQL et mise en ligne sur Vercel.",
    ],
    tags: ["Next.js", "React", "Prisma", "PostgreSQL", "Stripe", "Tailwind"],
    annee: "2025",
    lien: "https://vanalaska.fr",
    lienLabel: "vanalaska.fr",
  },
  {
    slug: "color-war",
    titre: "Color War Arena",
    pole: "dev",
    type: "Plateforme de réservation",
    resume:
      "Plateforme de réservation d'événements Color War, développée en front et back avec espace de gestion.",
    description: [
      "Color War Arena est une plateforme de réservation autour d'événements « Color War ». Le projet a été mené de bout en bout, du front-end à la logique back-end de gestion des créneaux et des inscriptions.",
      "L'objectif : offrir un parcours de réservation clair et une interface dynamique fidèle à l'énergie de l'événement.",
    ],
    tags: ["Front-end", "Back-end", "UI Design"],
    lien: "https://clamensalbertsilas.mmiweb.iut-tlse3.fr/ColorWarArena/",
    lienLabel: "Voir le site",
  },
  {
    slug: "onze-posters",
    titre: "11 Posters",
    pole: "dev",
    type: "E-commerce & copywriting",
    resume:
      "Boutique en ligne de posters, avec travail de copywriting et de mise en avant produit.",
    description: [
      "11 Posters est une boutique e-commerce dédiée à la vente de posters. En plus de l'intégration du site, j'ai travaillé le copywriting : fiches produits, accroches et ton de marque.",
      "L'accent a été mis sur une présentation soignée des visuels et un parcours d'achat simple.",
    ],
    tags: ["E-commerce", "Copywriting", "Intégration"],
    lien: "https://clamensalbertsilas.mmiweb.iut-tlse3.fr/onzeposters/",
    lienLabel: "Voir le site",
  },
  {
    slug: "modemalin",
    titre: "ModeMalin",
    pole: "dev",
    type: "E-commerce Shopify",
    resume:
      "Boutique e-commerce construite sur Shopify : configuration du thème, catalogue et tunnel de vente.",
    description: [
      "ModeMalin est une boutique e-commerce développée sur Shopify. J'ai pris en charge la configuration de la boutique, la personnalisation du thème, la gestion du catalogue et l'optimisation du tunnel de vente.",
      "Un projet centré sur l'expérience d'achat et la conversion.",
    ],
    tags: ["Shopify", "E-commerce", "Thème"],
    lien: null,
    lienLabel: null,
  },
  {
    slug: "osa-foot",
    titre: "OSA Foot 7",
    pole: "dev",
    type: "Site vitrine & community management",
    resume:
      "Site vitrine d'un club de foot à 7, accompagné d'une gestion des réseaux sociaux du club.",
    description: [
      "OSA Foot 7 est le site vitrine d'un club de football à 7. J'ai conçu et intégré le site, puis assuré la gestion de la communauté du club sur les réseaux sociaux.",
      "Le site présente le club, ses actualités et facilite le contact avec les nouveaux joueurs.",
    ],
    tags: ["Site vitrine", "Community management", "Intégration"],
    lien: "https://clamensalbertsilas.mmiweb.iut-tlse3.fr/osa",
    lienLabel: "Voir le site",
  },
  {
    slug: "france-associations",
    titre: "France Associations",
    pole: "dev",
    type: "Maquettage UI de plateforme",
    resume:
      "Conception des maquettes UI d'une plateforme dédiée aux associations, du wireframe à l'interface finale.",
    description: [
      "Pour France Associations, j'ai travaillé le maquettage UI d'une plateforme web destinée au monde associatif : arborescence, wireframes et interfaces finales.",
      "L'enjeu était de rendre une plateforme riche en fonctionnalités simple et lisible pour ses utilisateurs.",
    ],
    tags: ["UI/UX", "Maquettage", "Web app"],
    lien: "https://dst4778a.mmiweb.iut-tlse3.fr/Association/public/index.php",
    lienLabel: "Voir le projet",
  },
  {
    slug: "digital-agency",
    titre: "Digital Agency",
    pole: "dev",
    type: "Intégration front-end SCSS",
    resume:
      "Intégration front-end d'un site d'agence à partir d'une maquette, structurée en SCSS.",
    description: [
      "Digital Agency est un exercice d'intégration front-end : traduire une maquette en site web responsive, avec une architecture CSS propre en SCSS.",
      "Focus sur la qualité du code, la maintenabilité des styles et la fidélité à la maquette.",
    ],
    tags: ["SCSS", "Intégration", "Responsive"],
    lien: "https://clamensalbertsilas.mmiweb.iut-tlse3.fr/site-scss/",
    lienLabel: "Voir le site",
  },
  {
    slug: "blog-hardware",
    titre: "Blog Hardware",
    pole: "dev",
    type: "Intégration WordPress & Gutenberg",
    resume:
      "Blog thématique hardware intégré sous WordPress avec l'éditeur Gutenberg.",
    description: [
      "Blog Hardware est un site de contenu autour du matériel informatique, réalisé sous WordPress avec l'éditeur Gutenberg.",
      "Le projet met en pratique la création de blocs, la mise en page de contenus et la gestion d'un site éditorial.",
    ],
    tags: ["WordPress", "Gutenberg", "CMS"],
    lien: "https://clamensalbertsilas.mmiweb.iut-tlse3.fr/gutenberg/",
    lienLabel: "Voir le site",
  },
  {
    slug: "microphil",
    titre: "Microphil",
    pole: "dev",
    type: "Site informatique",
    resume:
      "Site web autour de l'informatique et du matériel, intégré et mis en ligne.",
    description: [
      "Microphil est un site web sur la thématique de l'informatique. J'ai pris en charge son intégration et sa mise en ligne.",
      "Un projet orienté présentation de produits et de services informatiques.",
    ],
    tags: ["Web", "Intégration", "Informatique"],
    lien: "https://clamensalbertsilas.mmiweb.iut-tlse3.fr/microphil/",
    lienLabel: "Voir le site",
  },
  {
    slug: "portfolio-wordpress",
    titre: "Portfolio WordPress",
    pole: "dev",
    type: "Portfolio sous WordPress",
    resume:
      "Portfolio réalisé avec WordPress, pour explorer la création de site via CMS.",
    description: [
      "Ce portfolio a été réalisé sous WordPress, en complément de mes portfolios codés à la main. Il m'a permis d'approfondir la personnalisation de thèmes et la gestion de contenu via un CMS.",
    ],
    tags: ["WordPress", "CMS", "Portfolio"],
    lien: "https://clamensalbertsilas.mmiweb.iut-tlse3.fr/Book/",
    lienLabel: "Voir le site",
  },

  // ── Branding & design ─────────────────────────────────────
  {
    slug: "food-tarn",
    titre: "FoodTarn",
    pole: "branding",
    type: "Identité visuelle & stratégie",
    resume:
      "Création de l'identité visuelle et de la stratégie de marque d'un projet food local dans le Tarn.",
    description: [
      "FoodTarn est un projet de marque food ancré dans le Tarn. J'ai conçu son identité visuelle — logo, univers graphique, déclinaisons — et travaillé sa stratégie de communication.",
      "Le tout accompagné d'un site de présentation de l'agence et de son offre.",
    ],
    tags: ["Branding", "Identité visuelle", "Stratégie"],
    lien: "https://clamensalbertsilas.mmiweb.iut-tlse3.fr/foodtarn/notre%20agence/notre%20agence.html#top",
    lienLabel: "Voir le projet",
  },
  {
    slug: "sporteventure",
    titre: "SportEventure",
    pole: "branding",
    type: "Création de marque & communiqué",
    resume:
      "Création d'une marque autour de l'événementiel sportif, avec communiqué de presse.",
    description: [
      "SportEventure est un projet de création de marque dédié à l'événementiel sportif. J'ai défini son identité et rédigé un communiqué de presse pour son lancement.",
    ],
    tags: ["Branding", "Rédaction", "Communiqué"],
    lien: null,
    lienLabel: null,
  },
  {
    slug: "cartes-collection",
    titre: "Cartes Collection",
    pole: "branding",
    type: "Photomontage & impression",
    resume:
      "Conception de cartes de collection : photomontage, mise en page et préparation à l'impression.",
    description: [
      "Projet de cartes à collectionner mêlant photomontage et PAO. J'ai réalisé les visuels, la mise en page et préparé les fichiers pour l'impression.",
    ],
    tags: ["Photomontage", "PAO", "Print"],
    lien: null,
    lienLabel: null,
  },
  {
    slug: "elections-frejeville",
    titre: "Élections Fréjeville",
    pole: "branding",
    type: "Communication politique & print",
    resume:
      "Supports de communication politique pour une campagne d'élections à Fréjeville.",
    description: [
      "Pour les élections de Fréjeville, j'ai conçu des supports de communication print : affiches, tracts et documents de campagne.",
      "Un travail de communication ciblé, à destination des habitants de la commune.",
    ],
    tags: ["Print", "Communication", "PAO"],
    lien: null,
    lienLabel: null,
  },
  {
    slug: "agence-pub",
    titre: "Agence PUB",
    pole: "branding",
    type: "PAO & production industrielle",
    resume:
      "Travail de PAO et de production pour de la publicité à échelle industrielle.",
    description: [
      "Projet de PAO orienté production industrielle : conception de supports publicitaires pensés pour la fabrication en série.",
      "Une approche design qui tient compte des contraintes techniques de production.",
    ],
    tags: ["PAO", "Production", "Publicité"],
    lien: null,
    lienLabel: null,
  },

  // ── Audiovisuel & contenu ─────────────────────────────────
  {
    slug: "drone",
    titre: "Prises de vues drone",
    pole: "audiovisuel",
    type: "Aérien & color grading",
    resume:
      "Prises de vues aériennes au drone, suivies d'un travail d'étalonnage (color grading).",
    description: [
      "Réalisation de prises de vues aériennes au drone, puis post-production : montage et color grading pour donner du cachet aux images.",
    ],
    tags: ["Drone", "Vidéo", "Color grading"],
    lien: null,
    lienLabel: null,
  },
  {
    slug: "photo",
    titre: "Photographie",
    pole: "audiovisuel",
    type: "Shooting & photo urbaine",
    resume:
      "Shootings photo et série de photographies urbaines.",
    description: [
      "Séries photographiques mêlant shootings et photographie urbaine. Un travail sur le cadrage, la lumière et l'ambiance.",
    ],
    tags: ["Photographie", "Shooting", "Retouche"],
    lien: null,
    lienLabel: null,
  },
  {
    slug: "le-live-bfm",
    titre: "Le Live BFM",
    pole: "audiovisuel",
    type: "Court-métrage, VFX & chroma key",
    resume:
      "Court-métrage avec effets visuels et incrustation sur fond vert (chroma key).",
    description: [
      "Le Live BFM est un court-métrage intégrant des effets visuels et de l'incrustation sur fond vert (chroma key).",
      "Le projet couvre le tournage, le montage et la post-production VFX.",
    ],
    tags: ["VFX", "Chroma key", "Montage"],
    lien: null,
    lienLabel: null,
  },
];

export function getProjet(slug: string): Projet | undefined {
  return projets.find((p) => p.slug === slug);
}

export function projetsParPole(pole: Pole): Projet[] {
  return projets.filter((p) => p.pole === pole);
}

// ── Expériences ─────────────────────────────────────────────
export type Experience = {
  poste: string;
  structure: string;
  type: string;
  texte: string;
};

export const experiences: Experience[] = [
  {
    poste: "Chargé de communication",
    structure: "V and B — Castres",
    type: "Alternance",
    texte:
      "En alternance, je gère la communication du point de vente : réseaux sociaux, visuels, contenus et animation de la marque au niveau local.",
  },
  {
    poste: "Community management & rédaction",
    structure: "Agence IF@",
    type: "Stage",
    texte:
      "Gestion de communautés et rédaction de contenus pour les clients de l'agence : lignes éditoriales, publications et community management.",
  },
  {
    poste: "Développeur & créatif freelance",
    structure: "SILART",
    type: "Freelance",
    texte:
      "En parallèle de mes études, j'accompagne des clients en freelance : proposition, devis B2B, conception et développement de sites sur mesure.",
  },
];

// ── Compétences ─────────────────────────────────────────────
export const competences: { categorie: string; items: string[] }[] = [
  {
    categorie: "Développement",
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Prisma",
      "PostgreSQL",
      "Stripe",
      "Tailwind CSS",
      "SCSS",
      "WordPress & Gutenberg",
      "Shopify",
      "Git",
      "Vercel",
    ],
  },
  {
    categorie: "Design & branding",
    items: [
      "UI/UX Design",
      "Identité visuelle",
      "Branding",
      "PAO",
      "Copywriting",
    ],
  },
  {
    categorie: "Audiovisuel",
    items: [
      "Montage vidéo",
      "Color grading",
      "VFX & chroma key",
      "Photographie",
      "Prises de vues drone",
    ],
  },
];
