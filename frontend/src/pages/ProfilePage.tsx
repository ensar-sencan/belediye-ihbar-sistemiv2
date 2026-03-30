import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import {
  User, Mail, Phone, Shield, ClipboardList,
  ThumbsUp, ThumbsDown, PlusCircle, Loader, ArrowRight, Edit2, Save, X,
} from 'lucide-react';

type Report = { id: string; title: string; status: string; priority: string; category: string; created_at: string };
type Stats = { total_reports: number; pending: number; in_progress: number; resolved: number; rejected: number; total_upvotes: number; total_downvotes: number };

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:     { label: 'Bekliyor',    cls: 'badge-pending' },
  in_progress: { label: 'İşlemde',    cls: 'badge-in_progress' },
  resolved:    { label: 'Çözüldü',    cls: 'badge-resolved' },
  rejected:    { label: 'Reddedildi', cls: 'badge-rejected' },
};
const CATEGORY_LABELS: Record<string, string> = {
  pothole: 'Çukur', lighting: 'Aydınlatma', cleaning: 'Temizlik',
  park: 'Park/Bahçe', water: 'Su', road: 'Yol', other: 'Diğer',
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setAuth, token } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({ full_name: '', phone: '' });

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/users/me/reports'),
      axiosInstance.get('/users/me/stats'),
    ]).then(([r, s]) => { setReports(r.data); setStats(s.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setEditData({ full_name: user?.full_name || '', phone: (user as any)?.phone || '' });
    setEditing(true);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.patch('/users/me', editData);
      setAuth(res.data, token!);
      toast.success('Profil güncellendi!');
      setEditing(false);
    } catch {
      toast.error('Güncelleme başarısız.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  const roleLabel: Record<string, string> = {
    ADMIN: 'Sistem Yöneticisi', MUNICIPALITY_ADMIN: 'Belediye Yöneticisi', CITIZEN: 'Vatandaş',
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profilim</h1>
        <p className="text-slate-500 text-sm mt-0.5">Hesap bilgileri ve ihbar istatistikleri</p>
      </div>

      {/* User Info Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <User className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">{user?.full_name || 'Kullanıcı'}</p>
              <span className="badge bg-indigo-100 text-indigo-700">{roleLabel[user?.role ?? ''] ?? user?.role}</span>
            </div>
          </div>
          {!editing ? (
            <button onClick={startEdit} className="btn-secondary text-xs">
              <Edit2 className="w-3.5 h-3.5" /> Düzenle
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveProfile} disabled={saving} className="btn-primary text-xs">
                {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Kaydet
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary text-xs">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Ad Soyad</label>
              <input className="input" value={editData.full_name}
                onChange={e => setEditData(p => ({ ...p, full_name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Telefon</label>
              <input className="input" value={editData.phone} placeholder="+90 5xx xxx xx xx"
                onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">E-posta</label>
              <input className="input bg-slate-50 text-slate-400 cursor-not-allowed" value={user?.email} disabled />
              <p className="text-xs text-slate-400 mt-1">E-posta değiştirilemez</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Mail, label: 'E-posta', value: user?.email },
              { icon: Phone, label: 'Telefon', value: (user as any)?.phone || 'Belirtilmemiş' },
              { icon: Shield, label: 'Hesap Durumu', value: 'Aktif' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900">İstatistikler</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
            {[
              { label: 'Toplam', value: stats.total_reports, cls: 'text-indigo-600 bg-indigo-50' },
              { label: 'Bekleyen', value: stats.pending, cls: 'text-amber-600 bg-amber-50' },
              { label: 'İşlemde', value: stats.in_progress, cls: 'text-blue-600 bg-blue-50' },
              { label: 'Çözüldü', value: stats.resolved, cls: 'text-emerald-600 bg-emerald-50' },
              { label: 'Reddedildi', value: stats.rejected, cls: 'text-red-600 bg-red-50' },
            ].map(({ label, value, cls }) => (
              <div key={label} className={`rounded-xl p-3 text-center ${cls}`}>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs mt-0.5 opacity-80">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
              <ThumbsUp className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-lg font-bold text-emerald-700">{stats.total_upvotes}</p>
                <p className="text-xs text-emerald-600">Toplam Beğeni</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
              <ThumbsDown className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-lg font-bold text-red-600">{stats.total_downvotes}</p>
                <p className="text-xs text-red-500">Toplam Beğenmeme</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900">İhbarlarım ({reports.length})</h2>
          </div>
          <button onClick={() => navigate('/reports/create')} className="btn-primary text-xs">
            <PlusCircle className="w-3.5 h-3.5" /> Yeni İhbar
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm mb-4">Henüz hiç ihbar oluşturmadınız</p>
            <button onClick={() => navigate('/reports/create')} className="btn-primary">
              <PlusCircle className="w-4 h-4" /> İlk İhbarı Oluştur
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map((r) => (
              <div key={r.id} onClick={() => navigate(`/reports/${r.id}`)}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 cursor-pointer transition-all group">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{r.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(r.created_at).toLocaleDateString('tr-TR')} · {CATEGORY_LABELS[r.category] ?? r.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <span className={`badge ${STATUS_MAP[r.status]?.cls ?? ''}`}>{STATUS_MAP[r.status]?.label ?? r.status}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
