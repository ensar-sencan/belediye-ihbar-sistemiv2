import { Link } from 'react-router-dom';
import { Settings, ClipboardList, Users, BarChart3, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  const items = [
    { icon: ClipboardList, title: 'İhbar Yönetimi', desc: 'Tüm ihbarları görüntüle, durum ve öncelik güncelle', to: '/admin/reports', color: 'bg-indigo-600' },
    { icon: BarChart3, title: 'Dashboard', desc: 'Sistem istatistikleri ve özet bilgiler', to: '/dashboard', color: 'bg-emerald-600' },
    { icon: Users, title: 'Kullanıcılar', desc: 'Tüm kullanıcıları görüntüle ve yönet', to: '/admin/users', color: 'bg-violet-600' },
    { icon: Settings, title: 'Ayarlar', desc: 'Sistem ayarları (yakında)', to: '#', color: 'bg-slate-600' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Paneli</h1>
          <p className="text-slate-500 text-sm mt-0.5">Sistem yönetimi ve araçlar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(({ icon: Icon, title, desc, to, color }) => (
          <Link key={title} to={to}
            className="card flex items-center gap-4 hover:shadow-md hover:border-slate-200 border border-slate-100 transition-all duration-200 group">
            <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{title}</p>
              <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
