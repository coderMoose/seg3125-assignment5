// Internationalization for the NBA Analytics dashboard.
//
// A plain string dictionary (en / fr) plus locale-aware number helpers. i18next
// is intentionally not used: the assignment states a resource file is not
// mandatory given the scope, and a small typed dictionary keeps the two languages
// visible side by side. French translations were produced with Google Translate
// and lightly hand-checked, per the assignment's guidance.

export const LANGUAGES = [
  // Each language is shown in its own name, per the localization guidelines.
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
]

export const translations = {
  en: {
    // Page chrome
    back: '← Back to portfolio',
    kicker: 'Interactive dashboard',
    title: 'NBA Player Analytics',
    intro:
      'Explore how six of the NBA’s biggest stars performed across six seasons. ' +
      'Use the controls on each chart to change the stat, players, and season.',
    languageLabel: 'Language',

    // Stat names (full) and their short axis abbreviations
    statLong: {
      ppg: 'Points per game',
      rpg: 'Rebounds per game',
      apg: 'Assists per game',
    },
    statShort: { ppg: 'PPG', rpg: 'RPG', apg: 'APG' },

    // Line chart card
    lineTitle: 'Stat trend by season',
    lineContext:
      'Each line follows one player’s per-game average over time. Add or remove players to compare.',
    statPickerLabel: 'Statistic',
    playersLabel: 'Players',
    seasonAxis: 'Season',

    // Bar chart card
    barTitle: 'Player comparison for a season',
    barContext:
      'Compare every player on a single stat for the season you choose. Bars are sorted highest to lowest.',
    seasonPickerLabel: 'Season',

    // Shared
    playerAxis: 'Player',
    source: 'Data',
    sourceNote: 'Real regular-season per-game averages, hand-transcribed from',
    selectAtLeastOne: 'Select at least one player to show the chart.',
  },

  fr: {
    back: '← Retour au portfolio',
    kicker: 'Tableau de bord interactif',
    title: 'Statistiques des joueurs de la NBA',
    intro:
      'Découvrez les performances de six des plus grandes vedettes de la NBA sur six saisons. ' +
      'Utilisez les commandes de chaque graphique pour changer la statistique, les joueurs et la saison.',
    languageLabel: 'Langue',

    statLong: {
      ppg: 'Points par match',
      rpg: 'Rebonds par match',
      apg: 'Passes décisives par match',
    },
    statShort: { ppg: 'PPM', rpg: 'RPM', apg: 'PDM' },

    lineTitle: 'Évolution par saison',
    lineContext:
      'Chaque courbe suit la moyenne par match d’un joueur au fil du temps. Ajoutez ou retirez des joueurs pour comparer.',
    statPickerLabel: 'Statistique',
    playersLabel: 'Joueurs',
    seasonAxis: 'Saison',

    barTitle: 'Comparaison des joueurs pour une saison',
    barContext:
      'Comparez tous les joueurs sur une seule statistique pour la saison choisie. Les barres sont triées de la plus élevée à la plus basse.',
    seasonPickerLabel: 'Saison',

    playerAxis: 'Joueur',
    source: 'Données',
    sourceNote: 'Moyennes réelles par match en saison régulière, transcrites à la main depuis',
    selectAtLeastOne: 'Sélectionnez au moins un joueur pour afficher le graphique.',
  },
}

// Map the UI language to a full BCP-47 locale so numbers localize correctly:
// English (Canada) uses a decimal point, French (Canada) a decimal comma.
const LOCALES = { en: 'en-CA', fr: 'fr-CA' }

// Format a per-game average, e.g. 27.4 -> "27.4" (en) / "27,4" (fr).
export function formatStat(value, lang) {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat(LOCALES[lang] ?? 'en-CA', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}

// Small helper so components can read strings with a single `t` function.
export function makeT(lang) {
  const dict = translations[lang] ?? translations.en
  return (key) => key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), dict)
}
