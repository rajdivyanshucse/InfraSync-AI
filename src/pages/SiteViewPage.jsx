import React from 'react';
import { ModulePlaceholder } from './ModulePlaceholder';
import { MapPin } from 'lucide-react';

export const SiteViewPage = () => {
  return (
    <ModulePlaceholder
      title="Site View & Geospatial Map"
      tagline="Interactive GIS corridor map, chainage markers, and site telemetry overlay."
      phaseTarget="Phase 4"
      icon={MapPin}
      scopeItems={[
        'Interactive Mapbox / OpenStreetMap corridor layer',
        'Chainage (CH:XX+XXX) pinpoints & live GPS asset tracking',
        'BIM / CAD 2D/3D overlay alignment on terrain',
        'Sensor & IoT weather station site conditions telemetry',
      ]}
    />
  );
};
