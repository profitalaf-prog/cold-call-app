import { SearchProvider } from './SearchProvider';
import { OpenStreetMapProvider } from './OpenStreetMapProvider';
import { GooglePlacesProvider } from './GooglePlacesProvider';
import { AppSettings, SearchFilters, Company } from '../types';

class AutoProvider implements SearchProvider {
  private osm = new OpenStreetMapProvider();
  private google = new GooglePlacesProvider();

  async searchCompanies(filters: SearchFilters): Promise<Company[]> {
    try {
      let results = await this.osm.searchCompanies(filters);
      if (results.length < 10) {
        try {
          const googleRes = await this.google.searchCompanies(filters);
          const existingIds = new Set(results.map(r => `${r.name}-${r.address}`));
          for (const gr of googleRes) {
            if (!existingIds.has(`${gr.name}-${gr.address}`)) {
              results.push(gr);
            }
          }
        } catch (e) {
          // ignore google errors in auto mode
        }
      }
      return results;
    } catch (e) {
      return this.google.searchCompanies(filters);
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
    return this.osm.searchNearby(lat, lon, radiusKm, category);
  }

  async searchByCity(city: string, country: string, category?: string): Promise<Company[]> {
    return this.osm.searchByCity(city, country, category);
  }
}

export function getProvider(settings: AppSettings): SearchProvider {
  if (settings.provider === 'google') {
    return new GooglePlacesProvider();
  }
  if (settings.provider === 'osm') {
    return new OpenStreetMapProvider();
  }
  return new AutoProvider();
}
