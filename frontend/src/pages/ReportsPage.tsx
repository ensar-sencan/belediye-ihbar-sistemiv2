import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { useDebounce } from '../hooks/useDebounce';
import { Search, Filter, PlusCircle, MapPin, ThumbsUp, ThumbsDown, Loader, X, Map as MapIcon, List, Clock, Bookmark } from 'lucide-react';
import ReportsMap from '../components/maps/ReportsMap';

type Report = {
  id: string; title: string; description: string; category: string;
  status: string; priority: string; address?: string; upvotes: number; downvotes: number;
  latitude?: number; longitude?: number;
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

const FILTER_PRESETS = [
  { name: 'Acil İhbarlar', filters: { priority: 'urgent', status: '' } },
  { name: 'Bekleyen', filters: { status: 'pending', priority: '' } },
  { name: 'Çözüldü', filters: { status: 'resolved', priority: '' } },
];

export default function ReportsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    search: searchParams.get('search') || '',
  });
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters(prev => ({ ...prev, search: debouncedSearch }));
      setPage(1);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    if (page > 1) params.set('page', String(page));
    setSearchParams(params, { replace: true });
  }, [filters, page]);

  const loadReports = () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
    params.append('skip', String((page - 1) * itemsPerPage));
    params.append('limit', String(itemsPerPage));
    const url = `/reports/?${params}`;
    axiosInstance.get(url)
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : [];
        setReports(data);
        setTotalPages(Math.ceil(data.length === itemsPerPage ? page + 1 : page));
        setLoading(false);
        
        if (filters.search && !searchHistory.includes(filters.search)) {
          const newHistory = [filters.search, ...searchHistory].slice(0, 5);
          setSearchHistory(newHistory);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
      })
      .catch(() => {
        setError('İhbarlar yüklenemedi. Sunucu başlıyor olabilir, lütfen tekrar deneyin.');
        setLoading(false);
      });
  };

  useEffect(() => { loadReports(); }, [filters, page]);

  const clearFilters = () => {
    setFilters({ category: '', status: '', priority: '', search: '' });
    setSearchInput('');
    setPage(1);
  };

  const applyPreset = (preset: typeof FILTER_PRESETS[0]) => {
    setFilters({ ...filters, ...preset.filters });
    setPage(1);
  };

  const selectFromHistory = (term: string) => {
    setSearchInput(term);
    setFilters({ ...filters, search: term });
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const hasFilters = Object.values(filters).some(Boolean);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
      <button onClick={loadReports} className="btn-primary">Tekrar Dene</button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">İhbarlar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{reports.length} ihbar listeleniyor</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => navigate('/reports/create')} className="btn-primary">
            <PlusCircle className="w-4 h-4" /> Yeni İhbar
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
        <Bookmark className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">Hızlı Filtre:</span>
        {FILTER_PRESETS.map((preset) => (
          <button key={preset.name} onClick={() => applyPreset(preset)}
            className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors whitespace-nowrap">
            {preset.name}
          </button>
        ))}
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filtrele</span>
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
            <input type="text" placeholder="Canlı arama..." value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setShowHistory(searchHistory.length > 0)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              className="input pl-9" />
            {showHistory && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 py-1">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Son Aramalar
                  </span>
                  <button onClick={clearHistory} className="text-xs text-red-500 hover:underline">Temizle</button>
                </div>
                {searchHistory.map((term, i) => (
                  <button key={i} onClick={() => selectFromHistory(term)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    {term}
                  </button>
                ))}
              </div>
            )}
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

      {viewMode === 'map' && (
        <div className="mb-6">
          <ReportsMap reports={reports} height="600px" />
        </div>
      )}

      {viewMode === 'list' && (reports.length === 0 ? (
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
              className="card hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-800 border border-slate-100 dark:border-slate-800 cursor-pointer transition-all duration-200 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {r.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{r.description}</p>
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
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
                <span className="text-xs text-slate-400 capitalize">{CATEGORY_LABELS[r.category] ?? r.category}</span>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{r.upvotes}</span>
                  <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3" />{r.downvotes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {viewMode === 'list' && reports.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Önceki
          </button>
          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = page <= 3 ? i + 1 : page - 2 + i;
              if (pageNum > totalPages) return null;
              return (
                <button key={pageNum} onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === pageNum ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button onClick={() => setPage(p => p + 1)} disabled={reports.length < itemsPerPage}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}
