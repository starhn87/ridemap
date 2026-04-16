const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export interface RouteStep {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
  maneuver: {
    type: string;
    modifier?: string;
  };
}

export interface Route {
  distance: number; // meters
  duration: number; // seconds
  geometry: [number, number][];
  steps: RouteStep[];
}

export async function fetchRoute(
  origin: [number, number],
  destination: [number, number]
): Promise<Route> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&overview=full&steps=true&language=ko&access_token=${MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes?.length) {
    throw new Error('경로를 찾을 수 없습니다.');
  }

  const route = data.routes[0];

  return {
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry.coordinates as [number, number][],
    steps: route.legs[0].steps.map((step: any) => ({
      instruction: step.maneuver.instruction,
      distance: step.distance,
      duration: step.duration,
      maneuver: {
        type: step.maneuver.type,
        modifier: step.maneuver.modifier,
      },
    })),
  };
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0) return `${hours}시간 ${minutes}분`;
  return `${minutes}분`;
}
