// Simplified outline of the African continent and Madagascar as [longitude, latitude].
// Used only to generate the dot-matrix map at build time; accuracy is visual, not cartographic.
const mainland: [number, number][] = [
  [-5.9, 35.8], [-2.0, 35.1], [1.5, 36.6], [6.0, 37.0], [10.3, 37.3], [11.1, 35.2], [10.2, 34.0], [11.1, 33.2],
  [15.2, 32.3], [19.0, 30.3], [20.1, 32.1], [23.0, 32.6], [25.0, 31.6], [29.0, 30.9], [32.3, 31.3], [32.5, 29.9],
  [34.0, 27.0], [35.6, 23.1], [37.2, 21.0], [38.5, 18.0], [39.7, 15.5], [41.7, 13.3], [43.3, 12.5], [43.4, 11.6],
  [44.5, 10.4], [47.0, 11.1], [51.2, 11.8], [51.0, 10.4], [49.5, 6.0], [48.0, 4.5], [46.0, 2.0], [43.5, -1.0],
  [41.5, -2.0], [40.0, -4.5], [39.2, -7.0], [39.5, -10.0], [40.5, -11.0], [40.6, -15.0], [37.0, -17.5], [35.3, -22.0],
  [35.5, -24.0], [32.8, -26.0], [31.0, -29.5], [28.0, -33.0], [25.6, -34.0], [20.0, -34.8], [18.4, -34.1], [17.9, -32.0],
  [16.5, -28.6], [15.2, -27.0], [14.5, -22.9], [13.2, -20.0], [11.8, -17.2], [12.3, -13.5], [13.6, -11.0], [13.2, -8.8],
  [12.2, -6.0], [11.8, -4.8], [9.0, -1.5], [9.4, 0.5], [9.6, 3.0], [9.4, 4.0], [8.5, 4.5], [6.0, 4.3], [4.5, 6.3],
  [3.4, 6.4], [1.2, 6.1], [-2.0, 4.8], [-4.0, 5.2], [-7.5, 4.4], [-9.5, 5.3], [-11.5, 6.9], [-13.2, 8.5], [-15.0, 10.8],
  [-16.7, 12.5], [-17.5, 14.7], [-16.5, 16.0], [-16.0, 18.1], [-17.0, 21.0], [-16.0, 23.7], [-14.5, 26.0], [-13.2, 27.7],
  [-9.8, 29.5], [-9.6, 30.4], [-9.8, 32.5], [-8.5, 33.3], [-6.8, 34.0],
];
const madagascar: [number, number][] = [
  [49.3, -12.0], [50.5, -15.5], [49.5, -17.5], [48.2, -21.5], [47.0, -25.0], [45.0, -25.5], [43.7, -22.5], [44.0, -19.0], [46.0, -16.0], [47.5, -14.5],
];

function inside([x, y]: [number, number], poly: [number, number][]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

export const MAP_BOUNDS = { minLon: -19, maxLon: 53, minLat: -36, maxLat: 38.5 };

export function africaDots(step = 1.55) {
  const dots: { x: number; y: number }[] = [];
  for (let lat = MAP_BOUNDS.maxLat; lat >= MAP_BOUNDS.minLat; lat -= step) {
    for (let lon = MAP_BOUNDS.minLon; lon <= MAP_BOUNDS.maxLon; lon += step) {
      if (inside([lon, lat], mainland) || inside([lon, lat], madagascar)) dots.push(project(lon, lat));
    }
  }
  return dots;
}

export function project(lon: number, lat: number) {
  return { x: (lon - MAP_BOUNDS.minLon) * 10, y: (MAP_BOUNDS.maxLat - lat) * 10 };
}

export const MAP_SIZE = {
  w: (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon) * 10,
  h: (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat) * 10,
};

/** Major hubs, shown only as geography (no claims about Forge activity in them). */
export const hubs: { name: string; lon: number; lat: number }[] = [
  { name: "Lagos", lon: 3.4, lat: 6.5 },
  { name: "Accra", lon: -0.2, lat: 5.6 },
  { name: "Dakar", lon: -17.4, lat: 14.7 },
  { name: "Casablanca", lon: -7.6, lat: 33.6 },
  { name: "Cairo", lon: 31.2, lat: 30.0 },
  { name: "Addis Ababa", lon: 38.7, lat: 9.0 },
  { name: "Nairobi", lon: 36.8, lat: -1.3 },
  { name: "Kigali", lon: 30.1, lat: -1.9 },
  { name: "Kinshasa", lon: 15.3, lat: -4.3 },
  { name: "Johannesburg", lon: 28.0, lat: -26.2 },
  { name: "Cape Town", lon: 18.4, lat: -33.9 },
  { name: "Abuja", lon: 7.5, lat: 9.1 },
];
