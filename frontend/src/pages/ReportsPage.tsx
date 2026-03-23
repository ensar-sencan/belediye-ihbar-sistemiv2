import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';

type Report = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  address?:  string;
  upvotes:  number;
  downvotes:  number;
};

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // FILTER STATE
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    search: ''
  });

  // TEMP SEARCH (Enter'a basana kadar bekler)
  const [searchInput, setSearchInput] = useState('');

  const loadReports = () => {
    setLoading(true);
    
    // Build query params
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = queryString ? `/reports/?${queryString}` : '/reports/';
    
    console.log('Loading reports with filters:', url);
    
    axiosInstance.get(url)
      .then(res => {
        setReports(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('İhbarlar yüklenemedi.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReports();
  }, [filters]); // filters değişince yükle

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      priority: '',
      search: ''
    });
    setSearchInput(''); // Search input'u da temizle
  };

  // ENTER'A BASILINCA ARAMA YAP
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilters({ ...filters, search: searchInput });
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        fontSize: '32px',
        fontWeight: 'bold'
      }}>
        Yükleniyor... 
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display:  'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#fee2e2',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#b91c1c'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '32px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>
            📋 İhbarlar ({reports.length})
          </h1>
          <button
            onClick={() => navigate('/reports/create')}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            + Yeni İhbar
          </button>
        </div>

        {/* FILTERS */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>🔍 Filtrele</h2>
            <button
              onClick={clearFilters}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: '#f3f4f6',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              ✖️ Temizle
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* SEARCH - ENTER İLE ARAMA */}
            <input
              type="text"
              placeholder="🔎 Ara... "
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              style={{
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />

            {/* CATEGORY - ANINDA FİLTRELE */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              style={{
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <option value="">Tüm Kategoriler</option>
              <option value="pothole">🕳️ Çukur</option>
              <option value="lighting">💡 Aydınlatma</option>
              <option value="cleaning">🧹 Temizlik</option>
              <option value="park">🌳 Park/Bahçe</option>
              <option value="water">💧 Su/Kanalizasyon</option>
              <option value="road">🛣️ Yol</option>
              <option value="other">📦 Diğer</option>
            </select>

            {/* STATUS - ANINDA FİLTRELE */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={{
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <option value="">Tüm Durumlar</option>
              <option value="pending">⏳ Bekliyor</option>
              <option value="in_progress">🔄 İşlemde</option>
              <option value="resolved">✅ Çözüldü</option>
              <option value="rejected">❌ Reddedildi</option>
            </select>

            {/* PRIORITY - ANINDA FİLTRELE */}
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              style={{
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <option value="">Tüm Öncelikler</option>
              <option value="low">🟢 Düşük</option>
              <option value="medium">🟡 Orta</option>
              <option value="high">🟠 Yüksek</option>
              <option value="urgent">🔴 Acil</option>
            </select>
          </div>
        </div>

        {/* REPORTS */}
        {reports.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '48px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '24px', color: '#6b7280', marginBottom: '16px' }}>
              Hiç ihbar bulunamadı
            </p>
            {(filters.category || filters.status || filters.priority || filters.search) && (
              <button
                onClick={clearFilters}
                style={{
                  color: '#2563eb',
                  fontSize: '18px',
                  background: 'none',
                  border: 'none',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Filtreleri temizle
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reports.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  console.log('TIKLANDI!  Report ID:', r.id);
                  navigate(`/reports/${r.id}`);
                }}
                style={{
                  backgroundColor: 'white',
                  borderRadius:  '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '24px',
                  border: '2px solid #3b82f6',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                    {r.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      padding: '8px 16px',
                      backgroundColor: 
                        r.status === 'pending' ? '#fef3c7' :  
                        r.status === 'in_progress' ? '#dbeafe' : 
                        r.status === 'resolved' ? '#d1fae5' :  '#fee2e2',
                      color: 
                        r.status === 'pending' ? '#92400e' : 
                        r.status === 'in_progress' ? '#1e40af' :
                        r.status === 'resolved' ?  '#065f46' : '#991b1b',
                      borderRadius: '999px',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}>
                      {r.status === 'pending' && '⏳ Bekliyor'}
                      {r.status === 'in_progress' && '🔄 İşlemde'}
                      {r.status === 'resolved' && '✅ Çözüldü'}
                      {r.status === 'rejected' && '❌ Reddedildi'}
                    </span>
                    <span style={{
                      padding: '8px 16px',
                      backgroundColor: 
                        r.priority === 'urgent' ? '#fee2e2' : 
                        r.priority === 'high' ? '#fed7aa' :
                        r.priority === 'medium' ?  '#fef3c7' :  '#d1fae5',
                      color: 
                        r.priority === 'urgent' ? '#991b1b' :
                        r.priority === 'high' ? '#9a3412' :
                        r.priority === 'medium' ? '#92400e' : '#065f46',
                      borderRadius: '999px',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}>
                      {r.priority === 'urgent' && '🔴 Acil'}
                      {r.priority === 'high' && '🟠 Yüksek'}
                      {r.priority === 'medium' && '🟡 Orta'}
                      {r.priority === 'low' && '🟢 Düşük'}
                    </span>
                  </div>
                </div>
                <p style={{ color: '#4b5563', marginBottom: '12px', fontSize: '16px' }}>
                  {r.description}
                </p>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom:  '12px' }}>
                  📍 {r.address || 'Adres yok'}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent:  'space-between',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '12px',
                  fontSize: '14px',
                  color: '#9ca3af'
                }}>
                  <span>👍 {r.upvotes} | 👎 {r.downvotes}</span>
                  <span>{r.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}