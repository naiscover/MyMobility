/**
 * MyMobility — Accessibility JavaScript
 * Features: text size, high contrast, dyslexia mode, reduced motion,
 * colour blind simulation, EN/FR translation, mobile nav, keyboard nav.
 */

(function () {
  'use strict';

  /* ── LIVE ANNOUNCER ── */
  const announcer = document.getElementById('a11y-announcer');
  function announce(msg) {
    if (!announcer) return;
    announcer.textContent = '';
    requestAnimationFrame(() => { announcer.textContent = msg; });
  }

  /* ══════════════════════════════════════════
     TEXT SIZE
  ══════════════════════════════════════════ */
  const TEXT_SIZES  = [0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5];
  const TEXT_LABELS = ['75%','87.5%','100% (default)','112.5%','125%','137.5%','150%'];
  let currentSizeIndex = 2;

  function applyTextSize(index) {
    document.documentElement.style.fontSize = TEXT_SIZES[index] + 'rem';
    localStorage.setItem('mm-text-size', index);
    announce('Text size: ' + TEXT_LABELS[index]);
  }

  document.getElementById('btn-text-decrease').addEventListener('click', function () {
    if (currentSizeIndex > 0) { currentSizeIndex--; applyTextSize(currentSizeIndex); }
    else announce('Text size is already at minimum');
  });
  document.getElementById('btn-text-reset').addEventListener('click', function () {
    currentSizeIndex = 2; applyTextSize(currentSizeIndex);
  });
  document.getElementById('btn-text-increase').addEventListener('click', function () {
    if (currentSizeIndex < TEXT_SIZES.length - 1) { currentSizeIndex++; applyTextSize(currentSizeIndex); }
    else announce('Text size is already at maximum');
  });

  /* ══════════════════════════════════════════
     HIGH CONTRAST
  ══════════════════════════════════════════ */
  let highContrast = false;
  document.getElementById('btn-high-contrast').addEventListener('click', function () {
    highContrast = !highContrast;
    document.documentElement.setAttribute('data-high-contrast', highContrast);
    this.setAttribute('aria-pressed', highContrast);
    localStorage.setItem('mm-high-contrast', highContrast);
    announce(highContrast ? 'High contrast enabled' : 'High contrast disabled');
  });

  /* ══════════════════════════════════════════
     DYSLEXIA FONT
  ══════════════════════════════════════════ */
  let dyslexiaMode = false;
  document.getElementById('btn-dyslexia').addEventListener('click', function () {
    dyslexiaMode = !dyslexiaMode;
    document.documentElement.setAttribute('data-dyslexia', dyslexiaMode);
    this.setAttribute('aria-pressed', dyslexiaMode);
    localStorage.setItem('mm-dyslexia', dyslexiaMode);
    announce(dyslexiaMode ? 'Dyslexia-friendly font enabled' : 'Standard font restored');
  });

  /* ══════════════════════════════════════════
     REDUCE MOTION
  ══════════════════════════════════════════ */
  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.documentElement.setAttribute('data-reduce-motion', true);
    document.getElementById('btn-reduce-motion').setAttribute('aria-pressed', true);
  }
  document.getElementById('btn-reduce-motion').addEventListener('click', function () {
    reduceMotion = !reduceMotion;
    document.documentElement.setAttribute('data-reduce-motion', reduceMotion);
    this.setAttribute('aria-pressed', reduceMotion);
    localStorage.setItem('mm-reduce-motion', reduceMotion);
    announce(reduceMotion ? 'Animations reduced' : 'Animations restored');
  });

  /* ══════════════════════════════════════════
     COLOUR BLIND MODE
     Uses SVG filter approach — no colour info lost, just shifted
     Deuteranopia  = green-blind (most common, ~6% of men)
     Protanopia    = red-blind   (~2% of men)
     Tritanopia    = blue-blind  (~0.01%, rarer)
  ══════════════════════════════════════════ */
  const CB_FILTERS = {
    none: '',
    deuteranopia: `
      <filter id="cb-filter">
        <feColorMatrix type="matrix" values="
          0.367  0.861 -0.228  0  0
          0.280  0.673  0.047  0  0
         -0.012  0.043  0.969  0  0
          0      0      0      1  0"/>
      </filter>`,
    protanopia: `
      <filter id="cb-filter">
        <feColorMatrix type="matrix" values="
          0.152  1.053 -0.205  0  0
          0.115  0.786  0.099  0  0
         -0.004 -0.048  1.052  0  0
          0      0      0      1  0"/>
      </filter>`,
    tritanopia: `
      <filter id="cb-filter">
        <feColorMatrix type="matrix" values="
          1.256 -0.077 -0.179  0  0
         -0.078  0.931  0.148  0  0
          0.005  0.691  0.304  0  0
          0      0      0      1  0"/>
      </filter>`
  };

  // Inject a hidden SVG defs block into the page for filters
  const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgDefs.setAttribute('aria-hidden', 'true');
  svgDefs.setAttribute('focusable', 'false');
  svgDefs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
  svgDefs.innerHTML = '<defs id="cb-defs"></defs>';
  document.body.insertBefore(svgDefs, document.body.firstChild);

  function applyColorBlind(mode) {
    const defs = document.getElementById('cb-defs');
    defs.innerHTML = CB_FILTERS[mode] || '';
    document.documentElement.setAttribute('data-colorblind', mode);
    localStorage.setItem('mm-colorblind', mode);
    const labels = {
      none:         'Colour filter off',
      deuteranopia: 'Deuteranopia filter on (green-blind simulation)',
      protanopia:   'Protanopia filter on (red-blind simulation)',
      tritanopia:   'Tritanopia filter on (blue-blind simulation)'
    };
    announce(labels[mode]);
  }

  const cbSelect = document.getElementById('select-colorblind');
  cbSelect.addEventListener('change', function () {
    applyColorBlind(this.value);
  });

  /* ══════════════════════════════════════════
     FRENCH TRANSLATION
     All strings stored here — no external API needed, works offline
  ══════════════════════════════════════════ */
  const TRANSLATIONS = {
    en: {
      // Meta / html
      'lang':                       'en',
      'doc-title':                  'MyMobility — Wheelchair Accessibility Guide',
      // Skip links
      'skip-main':                  'Skip to main content',
      'skip-nav':                   'Skip to navigation',
      // Toolbar
      'toolbar-label':              'Accessibility',
      'btn-text-decrease-label':    'Decrease text size',
      'btn-text-reset-label':       'Reset text size to default',
      'btn-text-increase-label':    'Increase text size',
      'btn-high-contrast-label':    'Toggle high contrast mode',
      'btn-dyslexia-label':         'Toggle dyslexia-friendly font',
      'btn-reduce-motion-label':    'Toggle reduced motion',
      'btn-lang-label':             'Switch language to French',
      'btn-lang-display':           'FR',
      // Nav
      'nav-about':                  'About',
      'nav-types':                  'Types',
      'nav-features':               'Features',
      'nav-accessibility':          'Accessibility',
      'nav-resources':              'Resources',
      // Hero
      'hero-eyebrow':               'Mobility. Independence. Dignity.',
      'hero-title-line1':           'Every wheel tells',
      'hero-title-em':              'a story of freedom.',
      'hero-body':                  'A comprehensive, fully accessible guide to wheelchairs — from choosing the right chair to understanding the design choices that make the world more navigable for everyone.',
      'hero-btn-primary':           'Explore Types',
      'hero-btn-secondary':         'WCAG Standards',
      // Stats
      'stats-sr-heading':           'Key statistics about wheelchair use',
      'stat-1-label':               'people worldwide use wheelchairs',
      'stat-2-label':               'wheelchair users in the US alone',
      'stat-3-label':               'of those who need one can access one',
      // About
      'about-tag':                  'About Wheelchairs',
      'about-heading':              'More than a mobility device',
      'about-p1':                   'A wheelchair is often the key to independence, employment, social connection, and dignity. For millions of people worldwide, it is not a limitation — it is liberation.',
      'about-p2':                   'Modern wheelchairs are engineered marvels, balancing biomechanics, materials science, and ergonomics. Whether manual or electric, folding or rigid, each design reflects the needs and lifestyle of its user.',
      'about-p3':                   'This guide covers the major types of wheelchairs, their defining features, and the design principles that make them — and the websites that explain them — truly accessible to all.',
      // Types section
      'types-tag':                  'Wheelchair Types',
      'types-heading':              'Finding the right fit',
      'types-intro':                'Wheelchairs are not one-size-fits-all. The right chair depends on lifestyle, physical condition, environment, and personal preference. Here are the major categories.',
      // Manual card
      'manual-title':               'Manual Wheelchair',
      'manual-body':                'Propelled by the user\'s own arms or pushed by a companion. Lightweight models are ideal for active, independent users. Available in rigid and folding frames.',
      'manual-f1':                  'No battery required',
      'manual-f2':                  'Lighter and more portable',
      'manual-f3':                  'Good upper-body workout',
      'manual-f4':                  'Lower cost',
      // Power card
      'power-title':                'Power / Electric',
      'power-body':                 'Battery-powered with a joystick or alternative controller. Essential for users with limited upper-body strength or endurance. Offers independence over longer distances.',
      'power-f1':                   'Joystick or head/sip-puff control',
      'power-f2':                   'Reclining and tilt-in-space options',
      'power-f3':                   'Range up to 25 km per charge',
      'power-f4':                   'Smart connectivity options',
      // Sports card
      'sport-title':                'Sports / Active',
      'sport-body':                 'Engineered for specific sports — basketball, tennis, racing, rugby. Ultra-lightweight titanium or aluminium frames with angled wheels for stability and agility.',
      'sport-f1':                   'Sport-specific geometry',
      'sport-f2':                   'Anti-tip rear wheels',
      'sport-f3':                   'Cambered wheels for stability',
      'sport-f4':                   'Rigid, aerodynamic frame',
      // Tilt card
      'tilt-title':                 'Tilt-in-Space',
      'tilt-body':                  'Allows the entire seating system to tilt backwards without changing hip angle. Critical for pressure relief, postural support, and users with complex needs.',
      'tilt-f1':                    'Pressure injury prevention',
      'tilt-f2':                    'Maintains hip and spine alignment',
      'tilt-f3':                    'Manual or powered tilt',
      'tilt-f4':                    'Often paired with headrest',
      // Transport card
      'transport-title':            'Transport Chair',
      'transport-body':             'Compact, lightweight chair designed to be pushed by a caregiver. Smaller rear wheels mean the user cannot self-propel. Ideal for short outings and travel.',
      'transport-f1':               'Extremely lightweight (6–9 kg)',
      'transport-f2':               'Folds flat for transport',
      'transport-f3':               'Attendant-operated',
      'transport-f4':               'Affordable option',
      // Standing card
      'standing-title':             'Standing Wheelchair',
      'standing-body':              'Mechanically or electrically raises the user to a standing position. Offers significant health benefits including improved circulation, bone density, and psychological well-being.',
      'standing-f1':                'Powered or manual standing',
      'standing-f2':                'Improves circulation',
      'standing-f3':                'Eye-level social interaction',
      'standing-f4':                'Reduces pressure sores',
      // Features section
      'features-tag':               'Key Considerations',
      'features-heading':           'What to look for',
      'features-intro':             'Choosing a wheelchair involves careful evaluation across several dimensions. Here are the most important factors to assess with a healthcare professional.',
      'feat-1-title':               'Seat Width & Depth',
      'feat-1-body':                'The seat should be 2–3 cm wider than the user\'s widest point (hips or thighs). Too wide causes poor posture; too narrow causes pressure sores. Depth should allow a 2–3 finger gap behind the knee.',
      'feat-2-title':               'Frame Material',
      'feat-2-body':                'Steel frames are affordable and durable but heavy. Aluminium is lighter and rust-resistant. Titanium offers maximum strength-to-weight ratio. Carbon fibre is the lightest and most expensive option.',
      'feat-3-title':               'Wheel Configuration',
      'feat-3-body':                'Cambered wheels (angled outward) improve lateral stability. Larger rear wheels aid self-propulsion. Anti-tip wheels prevent backward tipping. Pneumatic tyres absorb terrain shock better than solid.',
      'feat-4-title':               'Cushioning & Pressure Relief',
      'feat-4-body':                'Pressure injury is a serious risk for wheelchair users. High-quality cushions (foam, gel, air, or hybrid) are essential. Tilt-in-space and recline features also aid pressure management for long-term users.',
      'feat-5-title':               'Postural Support',
      'feat-5-body':                'Lateral trunk supports, headrests, and footrests must be adjustable and correctly positioned. Poor posture leads to secondary complications including scoliosis, breathing difficulties, and pain.',
      'feat-6-title':               'Portability & Transport',
      'feat-6-body':                'If the user travels frequently, folding frames and removable components matter. Power chair weight (70–150 kg) affects vehicle loading. Quick-release wheels and footrests ease transfers and transport.',
      // Accessibility section
      'a11y-tag':                   'WCAG 2.1 AAA',
      'a11y-heading':               'Accessibility by design',
      'a11y-intro':                 'This website is built to WCAG 2.1 Level AAA standards — the highest level of web accessibility. Here is how each principle is applied.',
      'a11y-perceivable':           'Perceivable',
      'a11y-operable':              'Operable',
      'a11y-understandable':        'Understandable',
      'a11y-robust':                'Robust',
      'keyboard-title':             'Keyboard Navigation Reference',
      'kb-col-key':                 'Key',
      'kb-col-action':              'Action',
      'kb-r1':                      'Move to next interactive element',
      'kb-r2':                      'Move to previous interactive element',
      'kb-r3':                      'Activate buttons and links',
      'kb-r4':                      'Close open menus or dialogs',
      'kb-r5':                      'Navigate within lists and menus',
      'kb-r6':                      'Jump to first / last item',
      // Resources section
      'resources-tag':              'Further Reading',
      'resources-heading':          'Resources & support',
      'resources-intro':            'Whether you\'re a new user, a caregiver, or a designer looking to improve accessibility, these organisations and tools can help.',
      'res-1-title':                'World Health Organization',
      'res-1-body':                 'WHO publishes global guidelines on wheelchair provision and mobility services for low-resource settings.',
      'res-1-link':                 'Visit WHO',
      'res-2-title':                'W3C WCAG 2.1 Guidelines',
      'res-2-body':                 'The official Web Content Accessibility Guidelines covering all criteria from A to AAA compliance levels.',
      'res-2-link':                 'Read WCAG',
      'res-3-title':                'United Spinal Association',
      'res-3-body':                 'Advocacy and support for people living with spinal cord injury or disease, including wheelchair funding guidance.',
      'res-3-link':                 'Visit Site',
      'res-4-title':                'WebAIM Contrast Checker',
      'res-4-body':                 'Free online tool for checking colour contrast ratios against WCAG AA and AAA standards for any colour pair.',
      'res-4-link':                 'Check Contrast',
      // Footer
      'footer-tagline':             'Built with accessibility first.',
      'footer-compliance':          'WCAG 2.1 Level AAA compliant. Accessible to screen readers, keyboard users, and low-vision users.',
      'footer-copy':                '© 2025 MyMobility. Created for accessibility awareness.',
    },

    fr: {
      'lang':                       'fr',
      'doc-title':                  'MyMobility — Guide d\'accessibilité aux fauteuils roulants',
      'skip-main':                  'Aller au contenu principal',
      'skip-nav':                   'Aller à la navigation',
      'toolbar-label':              'Accessibilité',
      'btn-text-decrease-label':    'Réduire la taille du texte',
      'btn-text-reset-label':       'Réinitialiser la taille du texte',
      'btn-text-increase-label':    'Augmenter la taille du texte',
      'btn-high-contrast-label':    'Activer le mode contraste élevé',
      'btn-dyslexia-label':         'Activer la police dyslexie',
      'btn-reduce-motion-label':    'Réduire les animations',
      'btn-lang-label':             'Passer en anglais',
      'btn-lang-display':           'EN',
      'nav-about':                  'À propos',
      'nav-types':                  'Types',
      'nav-features':               'Caractéristiques',
      'nav-accessibility':          'Accessibilité',
      'nav-resources':              'Ressources',
      'hero-eyebrow':               'Mobilité. Indépendance. Dignité.',
      'hero-title-line1':           'Chaque roue raconte',
      'hero-title-em':              'une histoire de liberté.',
      'hero-body':                  'Un guide complet et entièrement accessible sur les fauteuils roulants — du choix du bon fauteuil à la compréhension des choix de conception qui rendent le monde plus accessible à tous.',
      'hero-btn-primary':           'Explorer les types',
      'hero-btn-secondary':         'Normes WCAG',
      'stats-sr-heading':           'Statistiques clés sur l\'utilisation des fauteuils roulants',
      'stat-1-label':               'personnes utilisent un fauteuil roulant dans le monde',
      'stat-2-label':               'utilisateurs de fauteuils roulants aux États-Unis',
      'stat-3-label':               'de ceux qui en ont besoin peuvent y accéder',
      'about-tag':                  'À propos des fauteuils roulants',
      'about-heading':              'Plus qu\'un simple dispositif de mobilité',
      'about-p1':                   'Un fauteuil roulant est souvent la clé de l\'indépendance, de l\'emploi, du lien social et de la dignité. Pour des millions de personnes dans le monde, ce n\'est pas une limitation — c\'est une libération.',
      'about-p2':                   'Les fauteuils roulants modernes sont des merveilles d\'ingénierie, alliant biomécanique, science des matériaux et ergonomie. Qu\'il soit manuel ou électrique, pliant ou rigide, chaque conception reflète les besoins et le mode de vie de son utilisateur.',
      'about-p3':                   'Ce guide couvre les principaux types de fauteuils roulants, leurs caractéristiques définissantes et les principes de conception qui les rendent — ainsi que les sites Web qui les expliquent — vraiment accessibles à tous.',
      'types-tag':                  'Types de fauteuils roulants',
      'types-heading':              'Trouver le bon fauteuil',
      'types-intro':                'Les fauteuils roulants ne sont pas universels. Le bon fauteuil dépend du mode de vie, de l\'état physique, de l\'environnement et des préférences personnelles. Voici les principales catégories.',
      'manual-title':               'Fauteuil roulant manuel',
      'manual-body':                'Propulsé par les bras de l\'utilisateur ou poussé par un accompagnateur. Les modèles légers sont idéaux pour les utilisateurs actifs et indépendants. Disponible en cadre rigide ou pliant.',
      'manual-f1':                  'Aucune batterie requise',
      'manual-f2':                  'Plus léger et plus portable',
      'manual-f3':                  'Bon exercice pour le haut du corps',
      'manual-f4':                  'Coût inférieur',
      'power-title':                'Fauteuil électrique',
      'power-body':                 'Alimenté par batterie avec une manette ou un contrôleur alternatif. Essentiel pour les utilisateurs ayant une force ou une endurance limitée du haut du corps. Offre l\'indépendance sur de longues distances.',
      'power-f1':                   'Contrôle par joystick, tête ou souffle',
      'power-f2':                   'Options d\'inclinaison et de bascule',
      'power-f3':                   'Autonomie jusqu\'à 25 km par charge',
      'power-f4':                   'Options de connectivité intelligente',
      'sport-title':                'Fauteuil de sport',
      'sport-body':                 'Conçu pour des sports spécifiques — basketball, tennis, course, rugby. Cadres ultra-légers en titane ou en aluminium avec des roues inclinées pour la stabilité et l\'agilité.',
      'sport-f1':                   'Géométrie spécifique au sport',
      'sport-f2':                   'Roues arrière anti-bascule',
      'sport-f3':                   'Roues cambrées pour la stabilité',
      'sport-f4':                   'Cadre rigide et aérodynamique',
      'tilt-title':                 'Fauteuil à bascule',
      'tilt-body':                  'Permet à l\'ensemble du système d\'assise de s\'incliner vers l\'arrière sans modifier l\'angle des hanches. Essentiel pour le soulagement de la pression et les utilisateurs ayant des besoins complexes.',
      'tilt-f1':                    'Prévention des escarres',
      'tilt-f2':                    'Maintien de l\'alignement hanches-colonne',
      'tilt-f3':                    'Bascule manuelle ou motorisée',
      'tilt-f4':                    'Souvent associé à un appui-tête',
      'transport-title':            'Fauteuil de transport',
      'transport-body':             'Fauteuil compact et léger conçu pour être poussé par un aidant. Les roues arrière plus petites empêchent l\'autopropulsion. Idéal pour les sorties courtes et les voyages.',
      'transport-f1':               'Extrêmement léger (6–9 kg)',
      'transport-f2':               'Se plie à plat pour le transport',
      'transport-f3':               'Opéré par un accompagnateur',
      'transport-f4':               'Option abordable',
      'standing-title':             'Fauteuil verticalisateur',
      'standing-body':              'Élève mécaniquement ou électriquement l\'utilisateur en position debout. Offre des avantages significatifs pour la santé, notamment une meilleure circulation, une densité osseuse accrue et un bien-être psychologique amélioré.',
      'standing-f1':                'Verticalisation motorisée ou manuelle',
      'standing-f2':                'Améliore la circulation',
      'standing-f3':                'Interaction sociale à hauteur des yeux',
      'standing-f4':                'Réduit les escarres',
      'features-tag':               'Points essentiels',
      'features-heading':           'Quoi rechercher',
      'features-intro':             'Choisir un fauteuil roulant implique une évaluation minutieuse selon plusieurs dimensions. Voici les facteurs les plus importants à évaluer avec un professionnel de la santé.',
      'feat-1-title':               'Largeur et profondeur de l\'assise',
      'feat-1-body':                'L\'assise doit être 2 à 3 cm plus large que le point le plus large de l\'utilisateur (hanches ou cuisses). Trop large entraîne une mauvaise posture ; trop étroit cause des escarres. La profondeur doit permettre un espace de 2 à 3 doigts derrière le genou.',
      'feat-2-title':               'Matériau du cadre',
      'feat-2-body':                'Les cadres en acier sont abordables et durables mais lourds. L\'aluminium est plus léger et résistant à la rouille. Le titane offre le meilleur rapport résistance/poids. La fibre de carbone est la plus légère et la plus coûteuse.',
      'feat-3-title':               'Configuration des roues',
      'feat-3-body':                'Les roues cambrées (inclinées vers l\'extérieur) améliorent la stabilité latérale. Les grandes roues arrière facilitent l\'autopropulsion. Les roues anti-bascule empêchent le renversement vers l\'arrière. Les pneus pneumatiques absorbent mieux les chocs du terrain.',
      'feat-4-title':               'Coussin et soulagement de la pression',
      'feat-4-body':                'Les escarres représentent un risque sérieux pour les utilisateurs de fauteuils roulants. Des coussins de haute qualité (mousse, gel, air ou hybride) sont essentiels. Les fonctions d\'inclinaison aident également à gérer la pression.',
      'feat-5-title':               'Soutien postural',
      'feat-5-body':                'Les supports latéraux du tronc, les appuis-tête et les repose-pieds doivent être réglables et correctement positionnés. Une mauvaise posture entraîne des complications secondaires, notamment la scoliose et des douleurs.',
      'feat-6-title':               'Portabilité et transport',
      'feat-6-body':                'Si l\'utilisateur voyage fréquemment, les cadres pliants et les composants amovibles sont importants. Le poids d\'un fauteuil motorisé (70–150 kg) affecte le chargement dans le véhicule. Les roues à dégagement rapide facilitent les transferts.',
      'a11y-tag':                   'WCAG 2.1 AAA',
      'a11y-heading':               'L\'accessibilité par conception',
      'a11y-intro':                 'Ce site Web est construit selon les normes WCAG 2.1 Niveau AAA — le niveau le plus élevé d\'accessibilité Web. Voici comment chaque principe est appliqué.',
      'a11y-perceivable':           'Perceptible',
      'a11y-operable':              'Utilisable',
      'a11y-understandable':        'Compréhensible',
      'a11y-robust':                'Robuste',
      'keyboard-title':             'Référence de navigation au clavier',
      'kb-col-key':                 'Touche',
      'kb-col-action':              'Action',
      'kb-r1':                      'Passer à l\'élément interactif suivant',
      'kb-r2':                      'Revenir à l\'élément interactif précédent',
      'kb-r3':                      'Activer les boutons et les liens',
      'kb-r4':                      'Fermer les menus ou boîtes de dialogue ouverts',
      'kb-r5':                      'Naviguer dans les listes et les menus',
      'kb-r6':                      'Aller au premier / dernier élément',
      'resources-tag':              'Pour aller plus loin',
      'resources-heading':          'Ressources et soutien',
      'resources-intro':            'Que vous soyez un nouvel utilisateur, un aidant ou un concepteur souhaitant améliorer l\'accessibilité, ces organisations et outils peuvent vous aider.',
      'res-1-title':                'Organisation mondiale de la santé',
      'res-1-body':                 'L\'OMS publie des directives mondiales sur la fourniture de fauteuils roulants et les services de mobilité dans les contextes à faibles ressources.',
      'res-1-link':                 'Visiter l\'OMS',
      'res-2-title':                'Directives W3C WCAG 2.1',
      'res-2-body':                 'Les directives officielles sur l\'accessibilité du contenu Web couvrant tous les critères des niveaux A à AAA.',
      'res-2-link':                 'Lire WCAG',
      'res-3-title':                'United Spinal Association',
      'res-3-body':                 'Défense des droits et soutien aux personnes vivant avec une lésion ou une maladie de la moelle épinière, y compris des conseils sur le financement des fauteuils roulants.',
      'res-3-link':                 'Visiter le site',
      'res-4-title':                'Vérificateur de contraste WebAIM',
      'res-4-body':                 'Outil en ligne gratuit pour vérifier les ratios de contraste des couleurs selon les normes WCAG AA et AAA pour toute paire de couleurs.',
      'res-4-link':                 'Vérifier le contraste',
      'footer-tagline':             'Conçu avec l\'accessibilité en priorité.',
      'footer-compliance':          'Conforme WCAG 2.1 Niveau AAA. Accessible aux lecteurs d\'écran, aux utilisateurs du clavier et aux personnes malvoyantes.',
      'footer-copy':                '© 2025 MyMobility. Créé pour la sensibilisation à l\'accessibilité.',
    }
  };

  // Map of translation key -> DOM element (selector or direct reference)
  function buildTranslationMap() {
    return [
      // Skip links
      { key: 'skip-main',           el: document.querySelector('.skip-link:first-of-type'), prop: 'textContent' },
      { key: 'skip-nav',            el: document.querySelector('.skip-link:last-of-type'),  prop: 'textContent' },
      // Toolbar label
      { key: 'toolbar-label',       el: document.querySelector('.toolbar-label'),            prop: 'textContent' },
      // Toolbar button aria-labels
      { key: 'btn-text-decrease-label', el: document.getElementById('btn-text-decrease'), prop: 'ariaLabel' },
      { key: 'btn-text-reset-label',    el: document.getElementById('btn-text-reset'),    prop: 'ariaLabel' },
      { key: 'btn-text-increase-label', el: document.getElementById('btn-text-increase'), prop: 'ariaLabel' },
      { key: 'btn-high-contrast-label', el: document.getElementById('btn-high-contrast'), prop: 'ariaLabel' },
      { key: 'btn-dyslexia-label',      el: document.getElementById('btn-dyslexia'),      prop: 'ariaLabel' },
      { key: 'btn-reduce-motion-label', el: document.getElementById('btn-reduce-motion'), prop: 'ariaLabel' },
      { key: 'btn-lang-label',          el: document.getElementById('btn-lang'),           prop: 'ariaLabel' },
      { key: 'btn-lang-display',        el: document.getElementById('lang-label'),         prop: 'textContent' },
      // Nav links
      { key: 'nav-about',           el: document.querySelector('a[href="#about"].nav-link'),         prop: 'textContent' },
      { key: 'nav-types',           el: document.querySelector('a[href="#types"].nav-link'),         prop: 'textContent' },
      { key: 'nav-features',        el: document.querySelector('a[href="#features"].nav-link'),      prop: 'textContent' },
      { key: 'nav-accessibility',   el: document.querySelector('a[href="#accessibility"].nav-link'), prop: 'textContent' },
      { key: 'nav-resources',       el: document.querySelector('a[href="#resources"].nav-link'),     prop: 'textContent' },
      // Hero
      { key: 'hero-eyebrow',        el: document.querySelector('.hero-eyebrow'),                     prop: 'textContent' },
      { key: 'hero-title-line1',    el: document.querySelector('.hero-title-line1'),                 prop: 'textContent' },
      { key: 'hero-title-em',       el: document.querySelector('.hero-title em'),                    prop: 'textContent' },
      { key: 'hero-body',           el: document.querySelector('.hero-body'),                        prop: 'textContent' },
      { key: 'hero-btn-primary',    el: document.querySelector('.btn-primary'),                      prop: 'textContent' },
      { key: 'hero-btn-secondary',  el: document.querySelector('.btn-secondary'),                    prop: 'textContent' },
      // Stats
      { key: 'stats-sr-heading',    el: document.getElementById('stats-heading'),                    prop: 'textContent' },
      { key: 'stat-1-label',        el: document.querySelector('.stat-item:nth-child(1) .stat-label'), prop: 'textContent' },
      { key: 'stat-2-label',        el: document.querySelector('.stat-item:nth-child(3) .stat-label'), prop: 'textContent' },
      { key: 'stat-3-label',        el: document.querySelector('.stat-item:nth-child(5) .stat-label'), prop: 'textContent' },
      // About
      { key: 'about-tag',           el: document.querySelector('#about .section-tag'),               prop: 'textContent' },
      { key: 'about-heading',       el: document.getElementById('about-heading'),                    prop: 'textContent' },
      { key: 'about-p1',            el: document.querySelector('#about .split-text p:nth-child(3)'), prop: 'textContent' },
      { key: 'about-p2',            el: document.querySelector('#about .split-text p:nth-child(4)'), prop: 'textContent' },
      { key: 'about-p3',            el: document.querySelector('#about .split-text p:nth-child(5)'), prop: 'textContent' },
      // Types
      { key: 'types-tag',           el: document.querySelector('#types .section-tag'),               prop: 'textContent' },
      { key: 'types-heading',       el: document.getElementById('types-heading'),                    prop: 'textContent' },
      { key: 'types-intro',         el: document.querySelector('#types .section-intro'),             prop: 'textContent' },
      // Card titles / bodies
      { key: 'manual-title',        el: document.getElementById('type-manual-heading'),              prop: 'textContent' },
      { key: 'manual-body',         el: document.querySelector('#type-manual-heading ~ .card-body'), prop: 'textContent' },
      { key: 'power-title',         el: document.getElementById('type-power-heading'),               prop: 'textContent' },
      { key: 'power-body',          el: document.querySelector('#type-power-heading ~ .card-body'),  prop: 'textContent' },
      { key: 'sport-title',         el: document.getElementById('type-sport-heading'),               prop: 'textContent' },
      { key: 'sport-body',          el: document.querySelector('#type-sport-heading ~ .card-body'),  prop: 'textContent' },
      { key: 'tilt-title',          el: document.getElementById('type-tilt-heading'),                prop: 'textContent' },
      { key: 'tilt-body',           el: document.querySelector('#type-tilt-heading ~ .card-body'),   prop: 'textContent' },
      { key: 'transport-title',     el: document.getElementById('type-transport-heading'),           prop: 'textContent' },
      { key: 'transport-body',      el: document.querySelector('#type-transport-heading ~ .card-body'), prop: 'textContent' },
      { key: 'standing-title',      el: document.getElementById('type-standing-heading'),            prop: 'textContent' },
      { key: 'standing-body',       el: document.querySelector('#type-standing-heading ~ .card-body'), prop: 'textContent' },
      // Features
      { key: 'features-tag',        el: document.querySelector('#features .section-tag'),            prop: 'textContent' },
      { key: 'features-heading',    el: document.getElementById('features-heading'),                 prop: 'textContent' },
      { key: 'features-intro',      el: document.querySelector('#features .section-intro'),          prop: 'textContent' },
      // Accessibility
      { key: 'a11y-tag',            el: document.querySelector('#accessibility .section-tag'),       prop: 'textContent' },
      { key: 'a11y-heading',        el: document.getElementById('a11y-heading'),                     prop: 'textContent' },
      { key: 'a11y-intro',          el: document.querySelector('#accessibility .section-intro'),     prop: 'textContent' },
      { key: 'a11y-perceivable',    el: document.getElementById('a11y-perceivable'),                 prop: 'textContent' },
      { key: 'a11y-operable',       el: document.getElementById('a11y-operable'),                   prop: 'textContent' },
      { key: 'a11y-understandable', el: document.getElementById('a11y-understandable'),             prop: 'textContent' },
      { key: 'a11y-robust',         el: document.getElementById('a11y-robust'),                     prop: 'textContent' },
      { key: 'kb-col-key',          el: document.querySelector('.keyboard-table thead th:first-child'), prop: 'textContent' },
      { key: 'kb-col-action',       el: document.querySelector('.keyboard-table thead th:last-child'),  prop: 'textContent' },
      // Resources
      { key: 'resources-tag',       el: document.querySelector('#resources .section-tag'),           prop: 'textContent' },
      { key: 'resources-heading',   el: document.getElementById('resources-heading'),                prop: 'textContent' },
      { key: 'resources-intro',     el: document.querySelector('#resources .section-intro'),         prop: 'textContent' },
      { key: 'res-1-title',         el: document.querySelector('.resource-card:nth-child(1) .resource-title'), prop: 'textContent' },
      { key: 'res-2-title',         el: document.querySelector('.resource-card:nth-child(2) .resource-title'), prop: 'textContent' },
      { key: 'res-3-title',         el: document.querySelector('.resource-card:nth-child(3) .resource-title'), prop: 'textContent' },
      { key: 'res-4-title',         el: document.querySelector('.resource-card:nth-child(4) .resource-title'), prop: 'textContent' },
      // Footer
      { key: 'footer-tagline',      el: document.querySelector('.footer-tagline'),                   prop: 'textContent' },
      { key: 'footer-copy',         el: document.querySelector('.footer-bottom p'),                  prop: 'textContent' },
    ];
  }

  // Feature list items keyed by card then index
  const CARD_FEATURES = {
    manual:    ['manual-f1','manual-f2','manual-f3','manual-f4'],
    power:     ['power-f1','power-f2','power-f3','power-f4'],
    sport:     ['sport-f1','sport-f2','sport-f3','sport-f4'],
    tilt:      ['tilt-f1','tilt-f2','tilt-f3','tilt-f4'],
    transport: ['transport-f1','transport-f2','transport-f3','transport-f4'],
    standing:  ['standing-f1','standing-f2','standing-f3','standing-f4'],
  };

  const FEATURE_SECTION = {
    'feat-1-title': '#features .feature-item:nth-child(1) .feature-title',
    'feat-1-body':  '#features .feature-item:nth-child(1) .feature-content p',
    'feat-2-title': '#features .feature-item:nth-child(2) .feature-title',
    'feat-2-body':  '#features .feature-item:nth-child(2) .feature-content p',
    'feat-3-title': '#features .feature-item:nth-child(3) .feature-title',
    'feat-3-body':  '#features .feature-item:nth-child(3) .feature-content p',
    'feat-4-title': '#features .feature-item:nth-child(4) .feature-title',
    'feat-4-body':  '#features .feature-item:nth-child(4) .feature-content p',
    'feat-5-title': '#features .feature-item:nth-child(5) .feature-title',
    'feat-5-body':  '#features .feature-item:nth-child(5) .feature-content p',
    'feat-6-title': '#features .feature-item:nth-child(6) .feature-title',
    'feat-6-body':  '#features .feature-item:nth-child(6) .feature-content p',
  };

  let currentLang = 'en';

  function applyTranslation(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;
    currentLang = lang;

    // Update html lang attribute
    document.documentElement.setAttribute('lang', t['lang']);
    document.title = t['doc-title'];

    // Apply mapped elements
    const map = buildTranslationMap();
    map.forEach(function(item) {
      if (!item.el) return;
      if (item.prop === 'ariaLabel') {
        item.el.setAttribute('aria-label', t[item.key]);
      } else {
        item.el[item.prop] = t[item.key];
      }
    });

    // Card feature lists
    Object.keys(CARD_FEATURES).forEach(function(cardKey) {
      const headingId = 'type-' + cardKey + '-heading';
      const article = document.getElementById(headingId)
        ? document.getElementById(headingId).closest('article')
        : null;
      if (!article) return;
      const lis = article.querySelectorAll('.card-features li');
      CARD_FEATURES[cardKey].forEach(function(fKey, i) {
        if (lis[i]) lis[i].textContent = t[fKey];
      });
    });

    // Features section paragraphs
    Object.keys(FEATURE_SECTION).forEach(function(key) {
      const el = document.querySelector(FEATURE_SECTION[key]);
      if (el) el.textContent = t[key];
    });

    // Resource card bodies and links
    [1,2,3,4].forEach(function(n) {
      const card = document.querySelector('.resource-card:nth-child(' + n + ')');
      if (!card) return;
      const p = card.querySelector('.resource-card-body p');
      const a = card.querySelector('.resource-link');
      if (p) p.textContent = t['res-' + n + '-body'];
      if (a) {
        const arrow = a.querySelector('span[aria-hidden]');
        a.childNodes[0].textContent = t['res-' + n + '-link'] + ' ';
        if (arrow) a.appendChild(arrow);
      }
    });

    // Keyboard table rows
    const kbRows = document.querySelectorAll('.keyboard-table tbody tr');
    ['kb-r1','kb-r2','kb-r3','kb-r4','kb-r5','kb-r6'].forEach(function(key, i) {
      if (kbRows[i]) {
        const td = kbRows[i].querySelector('td:last-child');
        if (td) td.textContent = t[key];
      }
    });

    // Footer nav (same keys as main nav)
    document.querySelectorAll('.footer-nav a').forEach(function(link) {
      const href = link.getAttribute('href');
      const keyMap = {
        '#about': 'nav-about', '#types': 'nav-types',
        '#features': 'nav-features', '#accessibility': 'nav-accessibility',
        '#resources': 'nav-resources'
      };
      if (keyMap[href]) link.textContent = t[keyMap[href]];
    });

    // Footer compliance text (preserve the strong tag)
    const complianceP = document.querySelector('.footer-compliance p:first-child');
    if (complianceP) {
      complianceP.innerHTML = '<strong>WCAG 2.1 Level AAA</strong> ' +
        (lang === 'fr' ? 'conforme. Accessible aux lecteurs d\'écran, aux utilisateurs du clavier et aux personnes malvoyantes.'
                       : 'compliant. Accessible to screen readers, keyboard users, and low-vision users.');
    }

    localStorage.setItem('mm-lang', lang);
    announce(lang === 'fr' ? 'Site traduit en français' : 'Site switched to English');
  }

  let langIsFr = false;
  document.getElementById('btn-lang').addEventListener('click', function() {
    langIsFr = !langIsFr;
    this.setAttribute('aria-pressed', langIsFr);
    applyTranslation(langIsFr ? 'fr' : 'en');
  });

  /* ══════════════════════════════════════════
     RESTORE SAVED PREFERENCES
  ══════════════════════════════════════════ */
  (function restorePrefs() {
    const savedSize = localStorage.getItem('mm-text-size');
    if (savedSize !== null) { currentSizeIndex = parseInt(savedSize, 10); applyTextSize(currentSizeIndex); }

    if (localStorage.getItem('mm-high-contrast') === 'true') {
      highContrast = true;
      document.documentElement.setAttribute('data-high-contrast', true);
      document.getElementById('btn-high-contrast').setAttribute('aria-pressed', true);
    }
    if (localStorage.getItem('mm-dyslexia') === 'true') {
      dyslexiaMode = true;
      document.documentElement.setAttribute('data-dyslexia', true);
      document.getElementById('btn-dyslexia').setAttribute('aria-pressed', true);
    }
    if (localStorage.getItem('mm-reduce-motion') === 'true') {
      reduceMotion = true;
      document.documentElement.setAttribute('data-reduce-motion', true);
      document.getElementById('btn-reduce-motion').setAttribute('aria-pressed', true);
    }
    const savedCb = localStorage.getItem('mm-colorblind');
    if (savedCb && savedCb !== 'none') {
      cbSelect.value = savedCb;
      applyColorBlind(savedCb);
    }
    const savedLang = localStorage.getItem('mm-lang');
    if (savedLang === 'fr') {
      langIsFr = true;
      document.getElementById('btn-lang').setAttribute('aria-pressed', true);
      applyTranslation('fr');
    }
  })();

  /* ══════════════════════════════════════════
     MOBILE NAV
  ══════════════════════════════════════════ */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  navToggle.addEventListener('click', function() {
    const isOpen = navMenu.classList.toggle('is-open');
    this.setAttribute('aria-expanded', isOpen);
    if (isOpen) { const fl = navMenu.querySelector('.nav-link'); if (fl) fl.focus(); }
  });
  navMenu.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', false);
      navToggle.focus();
    }
  });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.main-nav') && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', false);
    }
  });

  /* ══════════════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ══════════════════════════════════════════
     ACTIVE NAV ON SCROLL
  ══════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function(link) {
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.setAttribute('aria-current', 'true');
            }
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function(s) { obs.observe(s); });
  }

  /* ══════════════════════════════════════════
     KEYBOARD TABLE NAV
  ══════════════════════════════════════════ */
  const kbTable = document.querySelector('.keyboard-table');
  if (kbTable) {
    kbTable.querySelectorAll('tbody tr').forEach(function(row) {
      row.setAttribute('tabindex', '0');
      row.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); if (this.nextElementSibling) this.nextElementSibling.focus(); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); if (this.previousElementSibling) this.previousElementSibling.focus(); }
      });
    });
  }

})();