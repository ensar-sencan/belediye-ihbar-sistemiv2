import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { useAuthStore } from '../store/authStore';

type Report = {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
};

type Stats = {
  total_reports:  number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
  total_upvotes: number;
  total_downvotes:  number;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Load user's reports
      const reportsRes = await axiosInstance.get('/users/me/reports');
      setReports(reportsRes.data);

      // Load stats
      const statsRes = await axiosInstance.get('/users/me/stats');
      setStats(statsRes.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '32px' }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor:  '#f3f4f6', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HEADER */}
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '32px' }}>
          👤 Profilim
        </h1>

        {/* USER INFO */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
            Kullanıcı Bilgileri
          </h2>
          <div style={{ display:  'grid', gridTemplateColumns: '1fr 1fr', gap:  '16px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Ad Soyad</p>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>{user?. full_name || 'Belirtilmemiş'}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Email</p>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>{user?.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Telefon</p>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>{user?.phone || 'Belirtilmemiş'}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Rol</p>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>
                {user?.role === 'ADMIN' ? '👑 Admin' : 
                 user?.role === 'MUNICIPALITY_STAFF' ? '🏛️ Belediye Personeli' : '👤 Vatandaş'}
              </p>
            </div>
          </div>
        </div>

        {/* STATISTICS */}
        {stats && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
              📊 İstatistikler
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f3f4f6', borderRadius:  '8px' }}>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{stats.total_reports}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Toplam İhbar</p>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fef3c7', borderRadius:  '8px' }}>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#92400e' }}>{stats.pending}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>⏳ Bekliyor</p>
              </div>
              <div style={{ textAlign: 'center', padding:  '16px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af' }}>{stats.in_progress}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>🔄 İşlemde</p>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#d1fae5', borderRadius:  '8px' }}>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#065f46' }}>{stats.resolved}</p>
                <p style={{ fontSize: '14px', color:  '#6b7280' }}>✅ Çözüldü</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor:  '#dcfce7', borderRadius: '8px' }}>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534' }}>👍 {stats.total_upvotes}</p>
                <p style={{ fontSize: '14px', color:  '#6b7280' }}>Toplam Beğeni</p>
              </div>
              <div style={{ flex: 1, textAlign:  'center', padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#991b1b' }}>👎 {stats.total_downvotes}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Toplam Beğenmeme</p>
              </div>
            </div>
          </div>
        )}

        {/* MY REPORTS */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
            📋 İhbarlarım ({reports.length})
          </h2>

          {reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <p style={{ fontSize: '18px', color:  '#6b7280', marginBottom: '16px' }}>
                Henüz hiç ihbar oluşturmadınız
              </p>
              <button
                onClick={() => navigate('/reports/create')}
                style={{
                  padding: '12px 24px',
                  fontSize:  '16px',
                  backgroundColor: '#2563eb',
                  color:  'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                + İlk İhbarınızı Oluşturun
              </button>
            </div>
          ) : (
            <div style={{ display:  'flex', flexDirection: 'column', gap: '12px' }}>
              {reports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/reports/${r.id}`)}
                  style={{
                    padding: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor:  'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style. borderColor = '#3b82f6';
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                        {r.title}
                      </h3>
                      <p style={{ fontSize:  '14px', color: '#6b7280' }}>
                        {new Date(r.created_at).toLocaleDateString('tr-TR')} • {r.category}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        backgroundColor: 
                          r.status === 'pending' ? '#fef3c7' :  
                          r.status === 'in_progress' ? '#dbeafe' : 
                          r.status === 'resolved' ? '#d1fae5' : '#fee2e2',
                        color: 
                          r.status === 'pending' ? '#92400e' : 
                          r.status === 'in_progress' ? '#1e40af' :
                          r.status === 'resolved' ? '#065f46' : '#991b1b',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {r.status === 'pending' && '⏳ Bekliyor'}
                        {r.status === 'in_progress' && '🔄 İşlemde'}
                        {r.status === 'resolved' && '✅ Çözüldü'}
                        {r.status === 'rejected' && '❌ Reddedildi'}
                      </span>
                      <span style={{
                        padding: '6px 12px',
                        backgroundColor: 
                          r.priority === 'urgent' ? '#fee2e2' : 
                          r.priority === 'high' ? '#fed7aa' :
                          r.priority === 'medium' ?  '#fef3c7' :  '#d1fae5',
                        color: 
                          r.priority === 'urgent' ? '#991b1b' :
                          r.priority === 'high' ? '#9a3412' :
                          r.priority === 'medium' ? '#92400e' : '#065f46',
                        borderRadius: '999px',
                        fontSize:  '12px',
                        fontWeight: 600
                      }}>
                        {r.priority === 'urgent' && '🔴'}
                        {r.priority === 'high' && '🟠'}
                        {r. priority === 'medium' && '🟡'}
                        {r.priority === 'low' && '🟢'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}