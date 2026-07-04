import { SearchProvider } from './SearchProvider';
import { SearchFilters, Company } from '../types';
import { useSettingsStore } from '../stores/settingsStore';

export class OpenStreetMapProvider implements SearchProvider {
  private getSettings() {
    return useSettingsStore.getState().settings;
  }

  async searchCompanies(filters: SearchFilters): Promise<Company[]> {
    const { country, city, industry } = filters;
    return this.searchByCategory(industry || '', country, city);
  }

  async searchByCategory(category: string, country: string, city?: string): Promise<Company[]> {
    const { nominatimUrl, overpassUrl, timeoutMs } = this.getSettings();
    const query = `${city ? city + ', ' : ''}${country}`;

    const geocodeUrl = new URL(`${nominatimUrl}/search`);
    geocodeUrl.searchParams.append('q', query);
    geocodeUrl.searchParams.append('format', 'json');
    geocodeUrl.searchParams.append('limit', '1');

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const geoRes = await fetch(geocodeUrl.toString(), {
        headers: { 'User-Agent': 'ColdCallFinder/1.0' },
        signal: abortController.signal,
      });
      clearTimeout(timeout);

      const geoData = await geoRes.json();
      if (!geoData || geoData.length === 0) {
        throw new Error('Location not found');
      }

      const { lat, lon } = geoData[0];
      return this.searchNearby(parseFloat(lat), parseFloat(lon), 50, category);
    } catch (e: any) {
      clearTimeout(timeout);
      if (e.name === 'AbortError') throw new Error('Timeout during search');
      throw e;
    }
  }

  async searchNearby(lat: number, lon: number, radiusKm: number, category?: string): Promise<Company[]> {
    const { overpassUrl, timeoutMs, maxResults } = this.getSettings();
    const radiusMeters = radiusKm * 1000;

    const tags = ['amenity', 'shop', 'tourism', 'office'];
    const nodes = tags.map(tag => `node[${tag}](around:${radiusMeters},${lat},${lon});`).join('');
    const ways = tags.map(tag => `way[${tag}](around:${radiusMeters},${lat},${lon});`).join('');
    const rels = tags.map(tag => `relation[${tag}](around:${radiusMeters},${lat},${lon});`).join('');

    const overpassQuery = `
      [out:json][timeout:${Math.floor(timeoutMs / 1000)}];
      (${nodes}${ways}${rels});
      out center ${maxResults};
    `;

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const res = await fetch(overpassUrl, {
        method: 'POST',
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: abortController.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (!data || !data.elements) return [];

      return data.elements
        .map((el: any): Company => {
          const t = el.tags || {};
          const pLat = el.lat || el.center?.lat || lat;
          const pLon = el.lon || el.center?.lon || lon;

          return {
            id: `osm-${el.id}`,
            name: t.name || 'Unknown',
            address: [t['addr:street'], t['addr:housenumber'], t['addr:postcode'], t['addr:city']]
              .filter(Boolean)
              .join(' '),
            phone: t['contact:phone'] || t.phone,
            website: t['contact:website'] || t.website,
            email: t['contact:email'] || t.email,
            category: t.amenity || t.shop || t.office || t.tourism,
            lat: pLat,
            lon: pLon,
            openingHours: t.opening_hours,
            mapsLink: `https://www.openstreetmap.org/?mlat=${pLat}&mlon=${pLon}`,
            provider: 'osm',
          };
        })
        .filter((c: Company) => c.name !== 'Unknown');
    } catch (e: any) {
      clearTimeout(timeout);
      if (e.name === 'AbortError') throw new Error('Timeout during search');
      throw e;
    }
  }

  async searchByCity(city: string, country: string, category?: string): Promise<Company[]> {
    return this.searchByCategory(category || '', country, city);
  }
}
