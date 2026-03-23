import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      axiosInstance.get('/admin/dashboard/stats')
        .then(res => {
          setStats(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        fontSize: '32px'
      }}>
        Yukleniyor...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>  {/* ← backgroundColor SİLİNDİ */}
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '32px' }}>
        Hos Geldiniz, {user?.role === 'ADMIN' ? 'Sistem Yoneticisi' : 'Kullanici'}!  👋
      </h1>

      {user?.role === 'ADMIN' && stats ?  (
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '24px' }}>
            Sistem İstatistikleri
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #3b82f6'
            }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Toplam İhbar</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>{stats.total_reports}</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #10b981'
            }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Bekleyen</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#059669' }}>
                {stats.status_distribution?. pending || 0}
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #f59e0b'
            }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom:  '8px' }}>İşlemde</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color:  '#d97706' }}>
                {stats.status_distribution?.in_progress || 0}
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #22c55e'
            }}>
              <p style={{ fontSize:  '14px', color: '#6b7280', marginBottom: '8px' }}>Çözüldü</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#16a34a' }}>
                {stats.status_distribution?.resolved || 0}
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow:  '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize:  '20px', fontWeight: '600', marginBottom: '16px' }}>Son İhbarlar</h3>
            <p style={{ color: '#6b7280' }}>
              Son 7 günde bildirilen:  {stats.recent_reports_7days} ihbar
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Henüz ihbar yok</h3>
            <p style={{ color: '#6b7280' }}>
              İlk ihbarı oluşturmak için "Yeni İhbar" butonuna tıklayın. 
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '24px', color: '#4b5563', marginBottom: '16px' }}>
            Belediye İhbar Sistemine Hoş Geldiniz! 
          </p>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            Yeni ihbar oluşturmak için menüden "Yeni İhbar" seçeneğini kullanabilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}