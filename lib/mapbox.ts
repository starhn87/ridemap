import Mapbox from '@rnmapbox/maps';

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!;

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

export default Mapbox;
