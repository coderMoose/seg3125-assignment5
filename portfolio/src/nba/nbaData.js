// NBA player statistics — a small, hand-curated real subset.
//
// Regular-season per-game averages transcribed by hand from Basketball-Reference
// (https://www.basketball-reference.com/). Six players, six seasons, three stats.
// This mirrors the assignment's "copy-paste / take a subset of data found online"
// approach: the data is bundled statically so the dashboard has no runtime
// dependency on an external API (the NBA's official API blocks browser requests).

export const SOURCE_URL = 'https://www.basketball-reference.com/'
export const SOURCE_NAME = 'Basketball-Reference'

// Season labels are league-standard "start-end" spans and read identically in
// both languages, so they are not translated.
export const seasons = ['2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24']

// Stable ids drive the fixed categorical colour assignment (colour follows the
// player, never their rank). `name` is a proper noun and stays untranslated.
export const players = [
  { id: 'lebron', name: 'LeBron James', team: 'LAL' },
  { id: 'curry', name: 'Stephen Curry', team: 'GSW' },
  { id: 'giannis', name: 'Giannis Antetokounmpo', team: 'MIL' },
  { id: 'jokic', name: 'Nikola Jokić', team: 'DEN' },
  { id: 'luka', name: 'Luka Dončić', team: 'DAL' },
  { id: 'embiid', name: 'Joel Embiid', team: 'PHI' },
]

// The three per-game stats the user can switch between.
export const stats = ['ppg', 'rpg', 'apg']

// data[playerId][season] = { ppg, rpg, apg }
export const data = {
  lebron: {
    '2018-19': { ppg: 27.4, rpg: 8.5, apg: 8.3 },
    '2019-20': { ppg: 25.3, rpg: 7.8, apg: 10.2 },
    '2020-21': { ppg: 25.0, rpg: 7.7, apg: 7.8 },
    '2021-22': { ppg: 30.3, rpg: 8.2, apg: 6.2 },
    '2022-23': { ppg: 28.9, rpg: 8.3, apg: 6.8 },
    '2023-24': { ppg: 25.7, rpg: 7.3, apg: 8.3 },
  },
  curry: {
    '2018-19': { ppg: 27.3, rpg: 5.3, apg: 5.2 },
    '2019-20': { ppg: 20.8, rpg: 5.2, apg: 6.6 },
    '2020-21': { ppg: 32.0, rpg: 5.5, apg: 5.8 },
    '2021-22': { ppg: 25.5, rpg: 5.2, apg: 6.3 },
    '2022-23': { ppg: 29.4, rpg: 6.1, apg: 6.3 },
    '2023-24': { ppg: 26.4, rpg: 4.5, apg: 5.1 },
  },
  giannis: {
    '2018-19': { ppg: 27.7, rpg: 12.5, apg: 5.9 },
    '2019-20': { ppg: 29.5, rpg: 13.6, apg: 5.6 },
    '2020-21': { ppg: 28.1, rpg: 11.0, apg: 5.9 },
    '2021-22': { ppg: 29.9, rpg: 11.6, apg: 5.8 },
    '2022-23': { ppg: 31.1, rpg: 11.8, apg: 5.7 },
    '2023-24': { ppg: 30.4, rpg: 11.5, apg: 6.5 },
  },
  jokic: {
    '2018-19': { ppg: 20.1, rpg: 10.8, apg: 7.3 },
    '2019-20': { ppg: 19.9, rpg: 9.7, apg: 7.0 },
    '2020-21': { ppg: 26.4, rpg: 10.8, apg: 8.3 },
    '2021-22': { ppg: 27.1, rpg: 13.8, apg: 7.9 },
    '2022-23': { ppg: 24.5, rpg: 11.8, apg: 9.8 },
    '2023-24': { ppg: 26.4, rpg: 12.4, apg: 9.0 },
  },
  luka: {
    '2018-19': { ppg: 21.2, rpg: 7.8, apg: 6.0 },
    '2019-20': { ppg: 28.8, rpg: 9.4, apg: 8.8 },
    '2020-21': { ppg: 27.7, rpg: 8.0, apg: 8.6 },
    '2021-22': { ppg: 28.4, rpg: 9.1, apg: 8.7 },
    '2022-23': { ppg: 32.4, rpg: 8.6, apg: 8.0 },
    '2023-24': { ppg: 33.9, rpg: 9.2, apg: 9.8 },
  },
  embiid: {
    '2018-19': { ppg: 27.5, rpg: 13.6, apg: 3.7 },
    '2019-20': { ppg: 23.0, rpg: 11.6, apg: 3.0 },
    '2020-21': { ppg: 28.5, rpg: 10.6, apg: 2.8 },
    '2021-22': { ppg: 30.6, rpg: 11.7, apg: 4.2 },
    '2022-23': { ppg: 33.1, rpg: 10.2, apg: 4.2 },
    '2023-24': { ppg: 34.7, rpg: 11.0, apg: 5.6 },
  },
}

// Fixed categorical colour per player (dataviz palette, light-surface slots 1-6:
// blue, green, magenta, yellow, aqua, orange). Assigned by identity and never
// recoloured when the visible set changes.
export const playerColors = {
  lebron: '#2a78d6',
  curry: '#008300',
  giannis: '#e87ba4',
  jokic: '#eda100',
  luka: '#1baf7a',
  embiid: '#eb6834',
}
