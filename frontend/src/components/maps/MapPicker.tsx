import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
}

function LocationMarker({ position, onPositionChange }: { position: [number, number]; onPositionChange: (lat: number, lng: number) => void; }) {
  useMapEvents({ click(e) { onPositionChange(e.latlng.lat, e.latlng.lng); } });
  return <Marker position={position} />;
}

export default function MapPicker({ latitude, longitude, onLocationChange, height = '400px' }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);

  useEffect(() => { setPosition([latitude, longitude]); }, [latitude, longitude]);

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationChange(lat, lng);
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer center={position} zoom={13} style={{ height, width: '100%' }} scrollWheelZoom={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker position={position} onPositionChange={handlePositionChange} />
      </MapContainer>
      <div className="absolute top-3 left-3 bg-white px-3 py-2 rounded-lg shadow-md text-xs text-slate-600 z-[1000]">
        <p className="font-semibold mb-1">📍 Konum Seçin</p>
        <p>Harita üzerine tıklayarak konum belirleyin</p>
      </div>
    </div>
  );
}