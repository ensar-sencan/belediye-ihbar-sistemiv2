import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navStyle = (path: string) => ({
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius:  '8px',
    cursor:  'pointer',
    backgroundColor: isActive(path) ? '#2563eb' : 'transparent',
    color: isActive(path) ? 'white' : '#374151',
    transition: 'all 0.2s'
  });

  return (
    <nav style={{
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '16px 32px',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* LOGO */}
        <div 
          onClick={() => navigate('/dashboard')}
          style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            cursor: 'pointer',
            color: '#2563eb'
          }}
        >
          🏛️ Belediye İhbar Sistemi
        </div>

        {/* MENU */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={navStyle('/dashboard')}
            onMouseEnter={(e) => {
              if (! isActive('/dashboard')) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/dashboard')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate('/reports')}
            style={navStyle('/reports')}
            onMouseEnter={(e) => {
              if (!isActive('/reports')) {
                e. currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/reports')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            📋 İhbarlar
          </button>

          <button
            onClick={() => navigate('/reports/create')}
            style={navStyle('/reports/create')}
            onMouseEnter={(e) => {
              if (!isActive('/reports/create')) {
                e.currentTarget.style. backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/reports/create')) {
                e.currentTarget.style. backgroundColor = 'transparent';
              }
            }}
          >
            ➕ Yeni İhbar
          </button>

          {user?. role === 'ADMIN' && (
            <>
              <button
                onClick={() => navigate('/admin')}
                style={navStyle('/admin')}
                onMouseEnter={(e) => {
                  if (!isActive('/admin')) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/admin')) {
                    e. currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                🛡️ Admin Panel
              </button>

              <button
                onClick={() => navigate('/admin/reports')}
                style={navStyle('/admin/reports')}
                onMouseEnter={(e) => {
                  if (!isActive('/admin/reports')) {
                    e.currentTarget.style. backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/admin/reports')) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                🔧 İhbar Yönetimi
              </button>
            </>
          )}

          {/* USER INFO - PROFILE LINK */}
          <div 
            onClick={() => navigate('/profile')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              marginLeft: '16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            👤 {user?.full_name || user?.email}
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              border:  'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fecaca';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
            }}
          >
            🚪 Çıkış
          </button>
        </div>
      </div>
    </nav>
  );
}