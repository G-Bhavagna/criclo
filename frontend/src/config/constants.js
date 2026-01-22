// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8080/api' 
  : 'https://api.circlo.app/api';

export const WS_BASE_URL = __DEV__
  ? 'ws://localhost:8080/ws'
  : 'wss://api.circlo.app/ws';

// Map Configuration
export const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const DEFAULT_RADIUS_KM = 2;

// Activity Types
export const ACTIVITY_TYPES = [
  { id: 'shopping', label: 'Shopping', icon: 'shopping-cart', color: '#FF6B6B' },
  { id: 'dining', label: 'Dining', icon: 'restaurant', color: '#4ECDC4' },
  { id: 'sports', label: 'Sports', icon: 'dumbbell', color: '#95E1D3' },
  { id: 'walking', label: 'Walking', icon: 'walk', color: '#F38181' },
  { id: 'movie', label: 'Movies', icon: 'film', color: '#AA96DA' },
  { id: 'cafe', label: 'Café', icon: 'coffee', color: '#FCBAD3' },
  { id: 'fitness', label: 'Fitness', icon: 'heartbeat', color: '#A8D8EA' },
  { id: 'other', label: 'Other', icon: 'ellipsis-h', color: '#95A5A6' },
];

// Colors
export const COLORS = {
  primary: '#5B64E3',
  primaryDark: '#4751C4',
  accent: '#FF7B7B',
  accentLight: '#FFA59E',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#2D3436',
  textLight: '#636E72',
  border: '#DFE6E9',
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#D63031',
  disabled: '#B2BEC3',
};

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'TEXT',
  LOCATION: 'LOCATION',
  SYSTEM: 'SYSTEM',
};

// Status Types
export const REQUEST_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
};

export const JOIN_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};
