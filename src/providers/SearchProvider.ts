import { SearchFilters, Company } from '../types';

export abstract class SearchProvider {
  abstract searchCompanies(filters: SearchFilters): Promise<Company[]>;
  abstract searchByCategory(category: string, country: string, city?: string): Promise<Company[]>;
  abstract searchNearby(lat: number, lon: number, radiusKm: number, category?: string): Promise<Company[]>;
  abstract searchByCity(city: string, country: string, category?: string): Promise<Company[]>;
}
