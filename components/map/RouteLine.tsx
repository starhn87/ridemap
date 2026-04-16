import Mapbox from '@rnmapbox/maps';
import type { Route } from '@/lib/api/directions';

export default function RouteLine({ route }: { route: Route }) {
  const routeGeoJSON: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.geometry,
        },
      },
    ],
  };

  return (
    <Mapbox.ShapeSource id="route-source" shape={routeGeoJSON}>
      <Mapbox.LineLayer
        id="route-line-bg"
        style={{
          lineColor: '#F97316',
          lineWidth: 8,
          lineOpacity: 0.3,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      <Mapbox.LineLayer
        id="route-line"
        style={{
          lineColor: '#F97316',
          lineWidth: 4,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </Mapbox.ShapeSource>
  );
}
