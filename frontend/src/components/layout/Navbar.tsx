import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, ClipboardList, PlusCircle,
  ShieldCheck, Settings, LogOut, User, ChevronDown, Building2, Moon, Sun,
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const active = (path: string) => location.pathname === path;
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleLabel: Record<string, string> = {
    ADMIN: 'Sistem Yöneticisi',
    MUNICIPALITY_ADMIN: 'Belediye Yöneticisi',
    CITIZEN: 'Vatandaş',
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white hidden sm:block">Belediye İhbar</span>
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {[
            { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/reports', label: 'İhbarlar', icon: ClipboardList },
            { path: '/reports/create', label: 'Yeni İhbar', icon: PlusCircle },
          ].map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}
              className={`nav-link whitespace-nowrap `{active(path) ? 'nav-link-active' : 'nav-link-inactive'}`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
          {isAdmin && [
            { path: '/admin', label: 'Admin', icon: ShieldCheck },
            { path: '/admin/reports', label: 'Yönetim', icon: Settings },
          ].map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}
              className={`nav-link whitespace-nowrap `{active(path) ? 'nav-link-active' : 'nav-link-inactive'}`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{user?.full_name?.split(' ')[0]}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{roleLabel[user?.role ?? ''] ?? 'Kullanıcı'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 `{open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-20">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.full_name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user?.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <User className="w-4 h-4 text-slate-400" /> Profilim
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="w-4 h-4" /> Çıkış Yap
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
