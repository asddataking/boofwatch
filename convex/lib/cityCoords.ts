export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Detroit: { lat: 42.3314, lng: -83.0458 },
  "Hazel Park": { lat: 42.5125, lng: -83.1041 },
  "Ann Arbor": { lat: 42.2808, lng: -83.743 },
  Ferndale: { lat: 42.4606, lng: -83.1346 },
  Warren: { lat: 42.5145, lng: -83.0147 },
  "Port Huron": { lat: 42.9709, lng: -82.4249 },
  "Bay City": { lat: 43.5945, lng: -83.8889 },
};

export function coordsForCity(city: string): { lat: number; lng: number } {
  return CITY_COORDS[city] ?? { lat: 42.3314, lng: -83.0458 };
}
