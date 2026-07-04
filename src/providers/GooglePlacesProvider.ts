import { SearchProvider } from './SearchProvider';
import { SearchFilters, Company } from '../types';
import { useSettingsStore } from '../stores/settingsStore';

export class GooglePlacesProvider implements SearchProvider {
  private getSettings() {
    return useSettingsStore.getState().settings;
  }

  async searchCompanies(filters: SearchFilters): Promise<Company[]> {
    const { country, city, industry } = filters;
    const query = [industry, city, country].filter(Boolean).join(' ');

    const { googleApiKey } = this.getSettings();
    if (!googleApiKey) throw new Error('Google API Key is not configured');

    const url = new URL('https://places.googleapis.com/v1/places:searchText');

    try {
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': googleApiKey,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.location,places.rating,places.userRatingCount,places.regularOpeningHours,places.businessStatus',
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: 'en',
        }),
      });

      if (!res.ok) {
        throw new Error(`Google API Error: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.places) return [];

      let places = data.places.map((p: any): Company => ({
        id: `gplaces-${p.id}`,
        name: p.displayName?.text || 'Unknown',
        address: p.formattedAddress || '',
        phone: p.nationalPhoneNumber,
        website: p.websiteUri,
        lat: p.location?.latitude,
        lon: p.location?.longitude,
        rating: p.rating,
        reviewCount: p.userRatingCount,
        mapsLink: `https://www.google.com/maps/place/?q=place_id:${p.id}`,
        provider: 'google',
        isOpen: p.businessStatus === 'OPERATIONAL',
      }));

      if (filters.minRating) {
        places = places.filter((p: Company) => (p.rating || 0) >= filters.minRating);
      }
      if (filters.minReviews) {
        places = places.filter((p: Company) => (p.reviewCount || 0) >= filters.minReviews);
      }
      return places;
    } catch (e: any) {
      throw new Error(`Google Places search failed: ${e.message}`);
    }
  }

  async searchByCategory(category: string, country: string, city?: string): Promise<Company[]> {
    return this.searchCompanies({
      country,
      city: city || '',
      industry: category,
      radius: 50,
      onlinePresence: 'all',
      minReviews: 0,
      minRating: 0,
      openNow: false,
    });
  }

  async searchNearby(lat: number, lon: number, radiusKm: number, category?: string): Promise<Company[]> {
    return [];
  }

  async searchByCity(city: string, country: string, category?: string): Promise<Company[]> {
    return this.searchByCategory(category || '', country, city);
  }
}
