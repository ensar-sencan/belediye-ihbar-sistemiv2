import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import {
  ClipboardList, Clock, Loader, CheckCircle, XCircle,
  TrendingUp, PlusCircle, ArrowRight, BarChart3, ThumbsUp,
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor', in_progress: 'İşlemde', resolved: 'Çözüldü', rejected: 'Reddedildi',
};
const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-pending', in_progress: 'badge-in_progress', resolved: 'badge-resolved', rejected: 'badge-rejected',
};
const CATEGORY_LABELS: Record<string, string> = {
  pothole: 'Çukur', lighting: 'Aydınlatma', cleaning: 'Temizlik',
  park: 'Park/Bahçe', water: 'Su/Kanalizasyon', road: 'Yol', other: 'Diğer',
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [userReports, setUserReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      axiosInstance.get('/admin/dashboard/stats')
        .then(r => { setStats(r.data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      Promise.all([
        axiosInstance.get('/users/me/stats'),
        axiosInstance.get('/users/me/reports'),
      ]).then(([statsRes, reportsRes]) => {
        setUserStats(statsRes.data);
        setUserReports(Array.isArray(reportsRes.data) ? reportsRes.data.slice(0, 5) : []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader className="w-8 h-8 text-indigo-600 animate-spin" /></div>;
  }

  // ── ADMIN VIEW ──
  if (user?.role === 'ADMIN') {
    const statCards = [
      { label: 'Toplam İhbar', value: stats?.total_reports ?? 0, icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Bekleyen', value: stats?.status_distribution?.pending ?? 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'İşlemde', value: stats?.status_distribution?.in_progress ?? 0, icon: Loader, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Çözüldü', value: stats?.status_distribution?.resolved ?? 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Reddedildi', value: stats?.status_distribution?.rejected ?? 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
      { label: 'Son 7 Gün', value: stats?.recent_reports_7days ?? 0, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
    ];
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hoş Geldiniz, {user?.full_name?.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 mt-1 text-sm">Sistem durumuna genel bakış</p>
          </div>
          <Link to="/reports/create" className="btn-primary"><PlusCircle className="w-4 h-4" /> Yeni İhbar</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card">
              <div className={`inline-flex p-2 rounded-xl ${bg} mb-3`}><Icon className={`w-5 h-5 ${color}`} /></div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/reports', label: 'Tüm İhbarlar', desc: 'Listeyi görüntüle ve filtrele' },
            { to: '/admin/reports', label: 'İhbar Yönetimi', desc: 'Durum ve öncelik güncelle' },
            { to: '/admin/users', label: 'Kullanıcılar', desc: 'Tüm kullanıcıları görüntüle' },
          ].map(({ to, label, desc }) => (
            <Link key={to} to={to} className="card flex items-center justify-between group hover:border-indigo-200 hover:shadow-md transition-all border border-slate-100">
              <div><p className="font-semibold text-slate-900">{label}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ── CITIZEN VIEW ──
  const myStatCards = [
    { label: 'Toplam İhbar', value: userStats?.total_reports ?? 0, icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Bekleyen', value: userStats?.pending ?? 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'İşlemde', value: userStats?.in_progress ?? 0, icon: Loader, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Çözüldü', value: userStats?.resolved ?? 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Reddedildi', value: userStats?.rejected ?? 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Toplam Oy', value: (userStats?.total_upvotes ?? 0), icon: ThumbsUp, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hoş Geldiniz, {user?.full_name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 mt-1 text-sm">İhbar sistemi genel durumu</p>
        </div>
        <button onClick={() => navigate('/reports/create')} className="btn-primary">
          <PlusCircle className="w-4 h-4" /> Yeni İhbar
        </button>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {myStatCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className={`inline-flex p-2 rounded-xl ${bg} mb-3`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Hızlı aksiyonlar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { title: 'İhbar Oluştur', desc: 'Yaşadığınız sorunu bildirin', icon: PlusCircle, to: '/reports/create', color: 'bg-indigo-600' },
          { title: 'İhbarları Gör', desc: 'Tüm bildirimleri inceleyin', icon: ClipboardList, to: '/reports', color: 'bg-emerald-600' },
          { title: 'Profilim', desc: 'Bilgilerinizi görüntüleyin', icon: BarChart3, to: '/profile', color: 'bg-violet-600' },
        ].map(({ title, desc, icon: Icon, to, color }) => (
          <Link key={to} to={to} className="card flex flex-col items-start gap-3 hover:shadow-md hover:border-slate-200 border border-slate-100 transition-all group">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
            <div><p className="font-semibold text-slate-900">{title}</p><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all mt-auto" />
          </Link>
        ))}
      </div>

      {/* Son İhbarlarım */}
      {userReports.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Son İhbarlarım</h2>
            <Link to="/profile" className="text-sm text-indigo-600 hover:underline">Tümünü gör</Link>
          </div>
          <div className="flex flex-col gap-3">
            {userReports.map((r: any) => (
              <div key={r.id} onClick={() => navigate(`/reports/${r.id}`)}
                className="card cursor-pointer hover:shadow-md hover:border-indigo-100 border border-slate-100 transition-all group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate group-hover:text-indigo-700">{r.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{CATEGORY_LABELS[r.category] ?? r.category}</p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[r.status] ?? ''} flex-shrink-0`}>{STATUS_LABELS[r.status] ?? r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userReports.length === 0 && (userStats?.total_reports === 0) && (
        <div className="card text-center py-12 border border-dashed border-slate-200">
          <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Henüz ihbar oluşturmadınız</p>
          <p className="text-sm text-slate-400 mb-4">İlk ihbarınızı oluşturun</p>
          <Link to="/reports/create" className="btn-primary inline-flex"><PlusCircle className="w-4 h-4" /> İhbar Oluştur</Link>
        </div>
      )}
    </div>
  );
}
