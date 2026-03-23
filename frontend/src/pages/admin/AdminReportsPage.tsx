import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axios';

type Report = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  address?:  string;
  upvotes: number;
  downvotes: number;
  created_at: string;
};

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setLoading(true);
    axiosInstance.get('/reports/')
      .then(res => {
        setReports(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const updateStatus = async (reportId: string, newStatus: string) => {
    setUpdating(reportId);
    try {
      await axiosInstance.patch(`/reports/${reportId}`, { status: newStatus });
      alert('Durum guncellendi! ');
      loadReports();
    } catch (err:  any) {
      console.error(err);
      alert('Hata:  ' + (err.response?.data?.detail || err.message));
    } finally {
      setUpdating(null);
    }
  };

  const updatePriority = async (reportId: string, newPriority:  string) => {
    setUpdating(reportId);
    try {
      await axiosInstance. patch(`/reports/${reportId}`, { priority: newPriority });
      alert('Oncelik guncellendi!');
      loadReports();
    } catch (err: any) {
      console.error(err);
      alert('Hata:  ' + (err.response?.data?.detail || err.message));
    } finally {
      setUpdating(null);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (! confirm('Bu ihbari silmek istediginizden emin misiniz? ')) return;
    
    setUpdating(reportId);
    try {
      await axiosInstance.delete(`/reports/${reportId}`);
      alert('Ihbar silindi!');
      loadReports();
    } catch (err: any) {
      console.error(err);
      alert('Hata: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems:  'center', height: '100vh', fontSize: '32px' }}>
        Yukleniyor...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor:  '#f3f4f6', padding: '32px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>
            🛡️ Admin - Ihbar Yonetimi ({reports.length})
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Dashboard
          </button>
        </div>

        {reports.length === 0 ?  (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '24px', color: '#6b7280' }}>Henuz ihbar yok</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reports.map((r) => (
              <div
                key={r.id}
                style={{
                  backgroundColor:  'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  padding: '24px',
                  border: '2px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                      {r.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                      {new Date(r.created_at).toLocaleString('tr-TR')}
                    </p>
                    <p style={{ color: '#4b5563', fontSize: '16px' }}>
                      {r. description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => deleteReport(r.id)}
                    disabled={updating === r.id}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: updating === r. id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      height: 'fit-content'
                    }}
                  >
                    🗑️ Sil
                  </button>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '16px',
                  borderTop: '2px solid #e5e7eb',
                  paddingTop: '16px'
                }}>
                  {/* STATUS */}
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#6b7280' }}>
                      Durum
                    </p>
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      disabled={updating === r.id}
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor:  'pointer',
                        fontWeight: '600'
                      }}
                    >
                      <option value="pending">⏳ Bekliyor</option>
                      <option value="in_progress">🔄 Islemde</option>
                      <option value="resolved">✅ Cozuldu</option>
                      <option value="rejected">❌ Reddedildi</option>
                    </select>
                  </div>

                  {/* PRIORITY */}
                  <div>
                    <p style={{ fontSize: '14px', fontWeight:  '600', marginBottom: '8px', color: '#6b7280' }}>
                      Oncelik
                    </p>
                    <select
                      value={r.priority}
                      onChange={(e) => updatePriority(r.id, e.target.value)}
                      disabled={updating === r.id}
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      <option value="low">🟢 Dusuk</option>
                      <option value="medium">🟡 Orta</option>
                      <option value="high">🟠 Yuksek</option>
                      <option value="urgent">🔴 Acil</option>
                    </select>
                  </div>

                  {/* INFO */}
                  <div>
                    <p style={{ fontSize: '14px', fontWeight:  '600', marginBottom: '8px', color: '#6b7280' }}>
                      Bilgi
                    </p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ padding: '8px 12px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: '14px' }}>
                        {r. category}
                      </span>
                      <span style={{ fontSize: '16px' }}>
                        👍 {r.upvotes}
                      </span>
                      <span style={{ fontSize: '16px' }}>
                        👎 {r.downvotes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}