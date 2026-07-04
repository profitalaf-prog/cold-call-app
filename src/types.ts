export type CallStatus =
  | 'not_called'
  | 'callback'
  | 'success'
  | 'not_interested'
  | 'invalid_number';

export interface Company {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  email?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  lat?: number;
  lon?: number;
  openingHours?: string;
  mapsLink?: string;
  provider?: 'osm' | 'google';
  isOpen?: boolean;
}

export interface Lead extends Company {
  callStatus: CallStatus;
  notes: string;
  tags: string[];
  isFavorite: boolean;
  savedAt: string;
  statusChangedAt?: string;
  color?: string;
}

export interface SearchFilters {
  industry: string;
  country: string;
  city: string;
  radius: number;
  onlinePresence: 'all' | 'none' | 'social_only' | 'booking_only' | 'own_website';
  minReviews: number;
  minRating: number;
  openNow: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  savedAt: string;
}

export interface AppSettings {
  googleApiKey: string;
  overpassUrl: string;
  nominatimUrl: string;
  timeoutMs: number;
  maxResults: number;
  provider: 'auto' | 'osm' | 'google';
  darkMode: boolean;
}
