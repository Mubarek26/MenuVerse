import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface DeliveryLocationMapProps {
  location: { lat: number; lng: number } | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
  userLocation: { lat: number; lng: number } | null;
}

interface LocationMarkerProps {
  setLocation: (loc: { lat: number; lng: number }) => void;
  location: { lat: number; lng: number } | null;
}

function LocationMarker({ setLocation, location }: LocationMarkerProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return location ? <Marker position={location} /> : null;
}

const DeliveryLocationMap: React.FC<DeliveryLocationMapProps> = ({ location, setLocation, userLocation }) => {
  const mapRef = useRef<LeafletMap | null>(null);

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 relative">
      <MapContainer
        center={
          location
            ? [location.lat, location.lng]
            : userLocation
            ? [userLocation.lat, userLocation.lng]
            : [9.0054, 38.7636]
        }
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(mapInstance: LeafletMap) => { mapRef.current = mapInstance; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker setLocation={setLocation} location={location} userLocation={userLocation} />
      </MapContainer>
      {userLocation && (
        <button
          className="absolute top-2 right-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1 text-sm font-semibold shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-all z-10"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setView(userLocation, 13);
              setLocation(userLocation);
            }
          }}
        >
          Recenter to My Location
        </button>
      )}
      {location && (
        <p className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-300 shadow">
          Selected: Lat {location.lat.toFixed(5)}, Lng {location.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
};

export default DeliveryLocationMap;
