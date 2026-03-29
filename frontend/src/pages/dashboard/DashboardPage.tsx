import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import {
  ClipboardList, Clock, Loader, CheckCircle, XCircle,
  TrendingUp, PlusCircle, ArrowRight, BarChart3,
} from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      axiosInstance.get('/admin/dashboard/stats')
        .then(r => { setStats(r.data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hoş Geldiniz, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {user?.role === 'ADMIN' ? 'Sistem durumuna genel bakış' : 'Belediye İhbar Sistemi\'ne hoş geldiniz'}
          </p>
        </div>
        <Link to="/reports/create" className="btn-primary">
          <PlusCircle className="w-4 h-4" /> Yeni İhbar
        </Link>
      </div>

      {user?.role === 'ADMIN' && stats ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card">
                <div className={`inline-flex p-2 rounded-xl ${bg} mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/reports" className="card flex items-center justify-between group hover:border-indigo-200 hover:shadow-md transition-all duration-200 border border-slate-100">
              <div>
                <p className="font-semibold text-slate-900">Tüm İhbarlar</p>
                <p className="text-sm text-slate-500 mt-0.5">Listeyi görüntüle ve filtrele</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link to="/admin/reports" className="card flex items-center justify-between group hover:border-indigo-200 hover:shadow-md transition-all duration-200 border border-slate-100">
              <div>
                <p className="font-semibold text-slate-900">İhbar Yönetimi</p>
                <p className="text-sm text-slate-500 mt-0.5">Durum ve öncelik güncelle</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'İhbar Oluştur', desc: 'Yaşadığınız sorunu bildirin', icon: PlusCircle, to: '/reports/create', color: 'bg-indigo-600' },
            { title: 'İhbarları Gör', desc: 'Tüm bildirimleri inceleyin', icon: ClipboardList, to: '/reports', color: 'bg-emerald-600' },
            { title: 'İstatistikler', desc: 'Profil ve ihbar istatistikleri', icon: BarChart3, to: '/profile', color: 'bg-violet-600' },
          ].map(({ title, desc, icon: Icon, to, color }) => (
            <Link key={to} to={to}
              className="card flex flex-col items-start gap-3 hover:shadow-md hover:border-slate-200 border border-slate-100 transition-all duration-200 group">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all mt-auto" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
