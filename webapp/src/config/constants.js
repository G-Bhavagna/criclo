export const COLORS = {
  primary: '#5B64E3',
  primaryDark: '#4A52C4',
  primaryLight: '#7C84F0',
  accent: '#FF7B7B',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#BDC3C7',
  border: '#E8EAED',
  error: '#D63031',
  success: '#00B894',
  warning: '#FDCB6E',
  
  // Activity type colors
  shopping: '#FF6B6B',
  dining: '#4ECDC4',
  sports: '#95E1D3',
  walking: '#F38181',
  movie: '#AA96DA',
  cafe: '#FCBAD3',
  fitness: '#A8D8EA',
  other: '#95A5A6'
};

export const ACTIVITY_TYPES = [
  { label: 'Shopping', value: 'SHOPPING', color: COLORS.shopping, icon: '🛍️' },
  { label: 'Dining', value: 'DINING', color: COLORS.dining, icon: '🍽️' },
  { label: 'Sports', value: 'SPORTS', color: COLORS.sports, icon: '⚽' },
  { label: 'Walking', value: 'WALKING', color: COLORS.walking, icon: '🚶' },
  { label: 'Events', value: 'EVENTS', color: COLORS.movie, icon: '🎬' },
  { label: 'Cafe', value: 'CAFE', color: COLORS.cafe, icon: '☕' },
  { label: 'Study', value: 'STUDY', color: COLORS.fitness, icon: '📚' },
  { label: 'Other', value: 'OTHER', color: COLORS.other, icon: '📌' }
];

export const API_BASE_URL = 'http://localhost:8082/api/v1';
export const WS_BASE_URL = 'ws://localhost:8082';

export const DEMO_CREDENTIALS = {
  email: 'demo@circlo.com',
  password: 'demo123'
};
