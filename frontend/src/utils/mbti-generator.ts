export const generateRandomMBTI = () => [
  ['E', 'I'],
  ['S', 'N'],
  ['T', 'F'],
  ['J', 'P'],
].map(v => v[Math.floor(Math.random() * 2)]).join('');
