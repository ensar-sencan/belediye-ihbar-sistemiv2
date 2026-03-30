import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { Users, User, Shield, Building2, Loader, Search } from 'lucide-react';

type UserItem = {
  id: string; email: string; full_name: string; role: string;
  is_active: boolean; phone?: string; created_at?: string;
};

const ROLE_LABELS: Record<string, { label: string; cls: string }> = {
  ADMIN:             { label: 'Süper Admin',        cls: 'bg-purple-100 text-purple-700' },
  MUNICIPALITY_ADMIN: { label: 'Belediye Yöneticisi', cls: 'bg-blue-100 text-blue-700' },
  CITIZEN:           { label: 'Vatandaş',            cls: 'bg-slate-100 text-slate-600' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axiosInstance.get('/admin/users/')
      .then(r => { setUsers(Array.isArray(r.data) ? r.data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    municipal: users.filter(u => u.role === 'MUNICIPALITY_ADMIN').length,
    citizens: users.filter(u => u.role === 'CITIZEN').length,
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Kullanıcılar</h1>
        <p className="text-slate-500 text-sm mt-0.5">Sistemdeki tüm kullanıcılar</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Toplam', value: stats.total, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Süper Admin', value: stats.admins, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Bel. Yöneticisi', value: stats.municipal, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Vatandaş', value: stats.citizens, icon: User, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className={`inline-flex p-2 rounded-xl ${bg} mb-3`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="İsim veya e-posta ile ara..." value={search}
            onChange={e => setSearch(e.target.value)} className="input pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Kullanıcı', 'E-posta', 'Telefon', 'Rol', 'Durum'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(u => {
                const role = ROLE_LABELS[u.role] ?? { label: u.role, cls: 'bg-slate-100 text-slate-600' };
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="font-medium text-slate-900">{u.full_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3 text-slate-500">{u.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${role.cls}`}>{role.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                        {u.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">Kullanıcı bulunamadı</div>
          )}
        </div>
      </div>
    </div>
  );
}
