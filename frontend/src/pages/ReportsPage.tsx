import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { Search, Filter, PlusCircle, MapPin, ThumbsUp, ThumbsDown, Loader, X } from 'lucide-react';

type Report = {
  id: string; title: string; description: string; category: string;
  status: string; priority: string; address?: string; upvotes: number; downvotes: number;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor', in_progress: 'İşlemde', resolved: 'Çözüldü', rejected: 'Reddedildi',
};
const PRIORITY_LABELS: Record<string, string> = {
  low: 'Düşük', medium: 'Orta', high: 'Yüksek', urgent: 'Acil',
};
const CATEGORY_LABELS: Record<string, string> = {
  pothole: 'Çukur', lighting: 'Aydınlatma', cleaning: 'Temizlik',
  park: 'Park/Bahçe', water: 'Su/Kanalizasyon', road: 'Yol', other: 'Diğer',
};

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ category: '', status: '', priority: '', search: '' });

  const loadReports = () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
    const url = params.toString() ? `/reports/?${params}` : '/reports/';
    axiosInstance.get(url)
      .then(r => { setReports(Array.isArray(r.data) ? r.data : []); setLoading(false); })
      .catch(() => { setError('İhbarlar yüklenemedi. Sunucu başlıyor olabilir, lütfen tekrar deneyin.'); setLoading(false); });
  };

  useEffect(() => { loadReports(); }, [filters]);

  const clearFilters = () => { setFilters({ category: '', status: '', priority: '', search: '' }); setSearchInput(''); };
  const hasFilters = Object.values(filters).some(Boolean);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-red-500 text-center">{error}</p>
      <button onClick={loadReports} className="btn-primary">Tekrar Dene</button>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">İhbarlar</h1>
          <p className="text-slate-500 text-sm mt-0.5">{reports.length} ihbar listeleniyor</p>
        </div>
        <button onClick={() => navigate('/reports/create')} className="btn-primary">
          <PlusCircle className="w-4 h-4" /> Yeni İhbar
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Filtrele</span>
          {hasFilters && (
            <button onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors">
              <X className="w-3 h-3" /> Temizle
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Ara..." value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setFilters({ ...filters, search: searchInput })}
              className="input pl-9" />
          </div>
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="input">
            <option value="">Tüm Kategoriler</option>
            {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="input">
            <option value="">Tüm Durumlar</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="input">
            <option value="">Tüm Öncelikler</option>
            {Object.entries(PRIORITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      {reports.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-slate-400 text-lg">Hiç ihbar bulunamadı</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-3 text-sm text-indigo-600 hover:underline">
              Filtreleri temizle
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => (
            <div key={r.id} onClick={() => navigate(`/reports/${r.id}`)}
              className="card hover:shadow-md hover:border-indigo-100 border border-slate-100 cursor-pointer transition-all duration-200 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                    {r.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{r.description}</p>
                  {r.address && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                      <MapPin className="w-3 h-3" /> {r.address}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`badge badge-${r.status}`}>{STATUS_LABELS[r.status] ?? r.status}</span>
                  <span className={`badge badge-${r.priority}`}>{PRIORITY_LABELS[r.priority] ?? r.priority}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                <span className="text-xs text-slate-400 capitalize">{CATEGORY_LABELS[r.category] ?? r.category}</span>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{r.upvotes}</span>
                  <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3" />{r.downvotes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
