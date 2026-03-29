import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import { Trash2, Loader, ArrowLeft, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';

type Report = {
  id: string; title: string; description: string; category: string;
  status: string; priority: string; address?: string; upvotes: number; downvotes: number; created_at: string;
};

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Bekliyor' },
  { value: 'in_progress', label: 'İşlemde' },
  { value: 'resolved',    label: 'Çözüldü' },
  { value: 'rejected',    label: 'Reddedildi' },
];
const PRIORITY_OPTIONS = [
  { value: 'low',    label: 'Düşük' },
  { value: 'medium', label: 'Orta' },
  { value: 'high',   label: 'Yüksek' },
  { value: 'urgent', label: 'Acil' },
];
const CATEGORY_LABELS: Record<string, string> = {
  pothole: 'Çukur', lighting: 'Aydınlatma', cleaning: 'Temizlik',
  park: 'Park/Bahçe', water: 'Su', road: 'Yol', other: 'Diğer',
};
const STATUS_CLS: Record<string, string> = {
  pending: 'badge-pending', in_progress: 'badge-in_progress',
  resolved: 'badge-resolved', rejected: 'badge-rejected',
};

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { loadReports(); }, []);

  const loadReports = () => {
    setLoading(true);
    axiosInstance.get('/reports/')
      .then(r => { setReports(Array.isArray(r.data) ? r.data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const patch = async (id: string, data: object) => {
    setUpdating(id);
    try {
      await axiosInstance.patch(`/reports/${id}`, data);
      loadReports();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Güncelleme başarısız.');
    } finally { setUpdating(null); }
  };

  const deleteReport = async (id: string) => {
    if (!confirm('Bu ihbarı silmek istediğinizden emin misiniz?')) return;
    setUpdating(id);
    try {
      await axiosInstance.delete(`/reports/${id}`);
      loadReports();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Silinemedi.');
    } finally { setUpdating(null); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">İhbar Yönetimi</h1>
            <p className="text-slate-500 text-sm mt-0.5">{reports.length} ihbar</p>
          </div>
        </div>
        <button onClick={loadReports} className="btn-secondary">
          <RefreshCw className="w-4 h-4" /> Yenile
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">Henüz ihbar yok.</div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className={`card border border-slate-100 transition-opacity ${updating === r.id ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-slate-900">{r.title}</h3>
                    <span className={`badge ${STATUS_CLS[r.status] ?? 'badge-low'}`}>
                      {STATUS_OPTIONS.find(o => o.value === r.status)?.label ?? r.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(r.created_at).toLocaleString('tr-TR')} · {CATEGORY_LABELS[r.category] ?? r.category}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{r.description}</p>
                </div>
                <button onClick={() => deleteReport(r.id)} disabled={updating === r.id}
                  className="btn-danger flex-shrink-0">
                  <Trash2 className="w-4 h-4" /> Sil
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div>
                  <label className="label text-xs">Durum</label>
                  <select value={r.status} disabled={updating === r.id}
                    onChange={(e) => patch(r.id, { status: e.target.value })} className="input text-sm">
                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Öncelik</label>
                  <select value={r.priority} disabled={updating === r.id}
                    onChange={(e) => patch(r.id, { priority: e.target.value })} className="input text-sm">
                    {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="flex items-end gap-3 pb-0.5">
                  <div className="flex items-center gap-1 text-sm text-emerald-600">
                    <ThumbsUp className="w-4 h-4" /> {r.upvotes}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <ThumbsDown className="w-4 h-4" /> {r.downvotes}
                  </div>
                  {updating === r.id && <Loader className="w-4 h-4 text-indigo-600 animate-spin ml-auto" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
