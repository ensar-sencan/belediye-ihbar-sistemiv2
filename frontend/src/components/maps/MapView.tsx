import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  height?: string;
}

export default function MapView({ latitude, longitude, title, address, height = '300px' }: MapViewProps) {
  const position: [number, number] = [latitude, longitude];

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer center={position} zoom={15} style={{ height, width: '100%' }} scrollWheelZoom={false} dragging={true} zoomControl={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          {(title || address) && (
            <Popup>
              {title && <div className="font-semibold text-slate-900">{title}</div>}
              {address && <div className="text-sm text-slate-600 mt-1">{address}</div>}
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}