import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../lib/axios';
import { Building2, Mail, User, Phone, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axiosInstance.post('/auth/register', {
        ...formData,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Belediye İhbar Sistemi</h1>
          <p className="text-slate-500 mt-1 text-sm">Hesap oluşturun ve ihbar edin</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/login" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-lg font-semibold text-slate-900">Yeni hesap oluştur</h2>
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

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Kayıt yapılıyor...</> : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Giriş yapın
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-700">
              <strong>Not:</strong> Şu anda şifre sistemi aktif değil. Kayıt olduktan sonra test hesaplarından biriyle giriş yapabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}