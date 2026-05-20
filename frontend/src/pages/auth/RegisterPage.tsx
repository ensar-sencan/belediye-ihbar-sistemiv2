import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../lib/axios';
import { Building2, Mail, User, Phone, Loader2, AlertCircle, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Şifre kontrolü
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }
    
    try {
      await axiosInstance.post('/auth/register', {
        email: formData.email,
        full_name: formData.full_name,
        phone: formData.phone,
        password: formData.password,
        role: 'CITIZEN',
        is_active: true,
      });
      
      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate('/login');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((e: any) => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join(', '));
      } else {
        setError(detail || err.message || 'Kayıt başarısız.');
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string, value: string) => setFormData(p => ({ ...p, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Belediye İhbar Sistemi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Hesap oluşturun ve ihbar edin</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/login" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Yeni hesap oluştur</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Ad Soyad *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" required value={formData.full_name} placeholder="Ahmet Yılmaz"
                  onChange={(e) => set('full_name', e.target.value)}
                  className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="label">E-posta *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" required value={formData.email} placeholder="ornek@email.com"
                  onChange={(e) => set('email', e.target.value)}
                  className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="label">Telefon (Opsiyonel)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="tel" value={formData.phone} placeholder="0555 123 45 67"
                  onChange={(e) => set('phone', e.target.value)}
                  className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="label">Şifre *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={formData.password} 
                  placeholder="En az 6 karakter"
                  onChange={(e) => set('password', e.target.value)}
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
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Minimum 6 karakter</p>
            </div>

            <div>
              <label className="label">Şifre Tekrar *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  required 
                  value={formData.confirmPassword} 
                  placeholder="Şifrenizi tekrar girin"
                  onChange={(e) => set('confirmPassword', e.target.value)}
                  className="input pl-10 pr-10" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Kayıt yapılıyor...</> : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
