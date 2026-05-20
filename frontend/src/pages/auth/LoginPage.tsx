import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../services/api';
import { Building2, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const DEMO_USERS = [
  { label: 'Admin', email: 'admin@test.com', password: 'test123', color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/30' },
  { label: 'Vatandaş', email: 'ahmet@test.com', password: 'test123', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30' },
  { label: 'Belediye', email: 'belediye@test.com', password: 'test123', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.testLogin({ email, password });
      setAuth(res.user, res.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) setError(detail.map((e: any) => e.msg).join(', '));
      else setError(detail || err.message || 'Giriş başarısız. Email veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4 hover:scale-105 transition-transform">
            <Building2 className="w-8 h-8 text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Belediye İhbar Sistemi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Şehrinizin sorunlarını bildirin</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Hesabınıza giriş yapın</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" required value={email} placeholder="ornek@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="label">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Giriş yapılıyor...</> : 'Giriş Yap'}
            </button>
          </form>

          {/* Demo */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-slate-900 text-slate-400">Hızlı Giriş</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {DEMO_USERS.map(({ label, email: demoEmail, password: demoPassword, color }) => (
                <button key={demoEmail} type="button"
                  onClick={() => quickLogin(demoEmail, demoPassword)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${color}`}>
                  {label} <span className="text-xs opacity-70">({demoEmail})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hesabınız yok mu?{' '}
              <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                Kayıt olun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
