import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.testLogin({ email, password });
      setAuth(response.user, response.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      
      // Backend validation error'ları handle et
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        
        if (Array.isArray(detail)) {
          // FastAPI validation errors (array of objects)
          const errors = detail.map((e: any) => e.msg || e.type || 'Unknown error').join(', ');
          setError(`Hata: ${errors}`);
        } else if (typeof detail === 'string') {
          // Custom string error
          setError(detail);
        } else {
          // Unknown format
          setError('Giriş başarısız!   Lütfen bilgilerinizi kontrol edin.');
        }
      } else {
        setError(err.message || 'Bağlantı hatası!  ');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setError(''); // Clear previous errors
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            🏛️ Belediye İhbar Sistemi
          </CardTitle>
          <CardDescription className="text-center">
            Hesabınıza giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <div className="mt-6 space-y-2">
            <p className="text-sm text-center text-gray-600">Demo Hesaplar: </p>
            <div className="grid gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('admin@test.com')}
                type="button"
              >
                👤 Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('vatandas@test.com')}
                type="button"
              >
                👤 Vatandaş
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('belediye@test.com')}
                type="button"
              >
                👤 Belediye Personeli
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}