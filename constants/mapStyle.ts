export const MAP_STYLE = {
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
} as const;

// 서울 시청 기준 (기본 위치)
export const DEFAULT_CENTER: [number, number] = [126.978, 37.5665];
export const DEFAULT_ZOOM = 12;
