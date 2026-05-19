import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const createCustomIcon = (status: string) => {
  const colors: Record<string, string> = { pending: '#f59e0b', in_progress: '#3b82f6', resolved: '#10b981', rejected: '#ef4444' };
  const color = colors[status] || '#6366f1';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; transform: rotate(45deg); color: white; font-size: 14px; font-weight: bold;">!</div></div>`,
    iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30],
  });
};

interface Report { id: string; title: string; description: string; category: string; status: string; latitude?: number; longitude?: number; address?: string; }
interface ReportsMapProps { reports: Report[]; height?: string; center?: [number, number]; zoom?: number; }

const STATUS_LABELS: Record<string, string> = { pending: 'Bekliyor', in_progress: 'İşlemde', resolved: 'Çözüldü', rejected: 'Reddedildi' };
const CATEGORY_LABELS: Record<string, string> = { pothole: 'Çukur', lighting: 'Aydınlatma', cleaning: 'Temizlik', park: 'Park/Bahçe', water: 'Su/Kanalizasyon', road: 'Yol', other: 'Diğer' };

export default function ReportsMap({ reports, height = '500px', center = [40.9889, 29.0277], zoom = 12 }: ReportsMapProps) {
  const navigate = useNavigate();
  const validReports = reports.filter(r => r.latitude && r.longitude);
  const mapCenter: [number, number] = validReports.length > 0 ? [validReports.reduce((sum, r) => sum + (r.latitude || 0), 0) / validReports.length, validReports.reduce((sum, r) => sum + (r.longitude || 0), 0) / validReports.length] : center;

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer center={mapCenter} zoom={zoom} style={{ height, width: '100%' }} scrollWheelZoom={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {validReports.map((report) => (
          <Marker key={report.id} position={[report.latitude!, report.longitude!]} icon={createCustomIcon(report.status)} eventHandlers={{ click: () => navigate(`/reports/${report.id}`) }}>
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-slate-900 mb-1">{report.title}</h3>
                <p className="text-xs text-slate-600 mb-2 line-clamp-2">{report.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{CATEGORY_LABELS[report.category] || report.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full badge-${report.status}`}>{STATUS_LABELS[report.status] || report.status}</span>
                </div>
                {report.address && <p className="text-xs text-slate-500 mb-2">📍 {report.address}</p>}
                <button onClick={() => navigate(`/reports/${report.id}`)} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Detayları Gör →</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {validReports.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-[1000]">
          <div className="text-center">
            <p className="text-slate-500 font-medium">Haritada gösterilecek ihbar yok</p>
            <p className="text-sm text-slate-400 mt-1">Konum bilgisi olan ihbarlar burada görünecek</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-3 left-3 bg-white px-3 py-2 rounded-lg shadow-md text-xs z-[1000]">
        <p className="font-semibold text-slate-700 mb-1">🗺️ İhbar Haritası</p>
        <div className="flex gap-3">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-slate-600">Bekliyor</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-slate-600">İşlemde</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-slate-600">Çözüldü</span></div>
        </div>
      </div>
    </div>
  );
}