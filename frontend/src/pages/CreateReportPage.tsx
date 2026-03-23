import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';

export default function CreateReportPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pothole',
    priority: 'medium',
    address: '',
    latitude: 40.9889,
    longitude: 29.0277,
    is_anonymous: false
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e:  React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1) Create report
      console.log('Creating report...');
      const reportRes = await axiosInstance.post('/reports/', formData);
      console.log('Report created:', reportRes.data);
      
      const reportId = reportRes.data. id;

      // 2) Upload images if any
      if (images.length > 0) {
        console.log('Uploading images.. .');
        const formDataImages = new FormData();
        images.forEach(image => {
          formDataImages. append('files', image);
        });

        await axiosInstance.post(`/reports/${reportId}/upload-images`, formDataImages, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Images uploaded! ');
      }

      alert('İhbar başarıyla oluşturuldu! ');
      navigate('/reports');
    } catch (err:  any) {
      console.error('Error:', err);
      alert('Hata:  ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor:  '#f3f4f6', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '30px' }}>
          ➕ Yeni İhbar Oluştur
        </h1>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {/* TITLE */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '16px', fontWeight:  '600', marginBottom: '8px' }}>
              Başlık *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e. target.value })}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize:  '16px', fontWeight: '600', marginBottom: '8px' }}>
              Açıklama *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ... formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* CATEGORY + PRIORITY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap:  '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                Kategori *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding:  '12px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              >
                <option value="pothole">🕳️ Çukur</option>
                <option value="lighting">💡 Aydınlatma</option>
                <option value="cleaning">🧹 Temizlik</option>
                <option value="park">🌳 Park/Bahçe</option>
                <option value="water">💧 Su/Kanalizasyon</option>
                <option value="road">🛣️ Yol</option>
                <option value="other">📦 Diğer</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                Öncelik
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              >
                <option value="low">🟢 Düşük</option>
                <option value="medium">🟡 Orta</option>
                <option value="high">🟠 Yüksek</option>
                <option value="urgent">🔴 Acil</option>
              </select>
            </div>
          </div>

          {/* ADDRESS */}
          <div style={{ marginBottom:  '24px' }}>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              Adres
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* IMAGES */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              📸 Fotoğraflar (En fazla 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              max={5}
              onChange={handleImageSelect}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            
            {/* IMAGE PREVIEWS */}
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                {previews. map((preview, i) => (
                  <img
                    key={i}
                    src={preview}
                    alt={`Preview ${i + 1}`}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ANONYMOUS */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData. is_anonymous}
                onChange={(e) => setFormData({ ... formData, is_anonymous: e.target.checked })}
                style={{ width: '20px', height: '20px', marginRight:  '12px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '16px' }}>Anonim olarak gönder</span>
            </label>
          </div>

          {/* BUTTONS */}
          <div style={{ display: 'flex', gap:  '16px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                fontSize: '18px',
                fontWeight: '600',
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius:  '8px',
                cursor:  loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ?  'Oluşturuluyor...' : '✅ İhbar Oluştur'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/reports')}
              style={{
                padding: '14px 24px',
                fontSize: '18px',
                fontWeight: '600',
                backgroundColor: 'white',
                color: '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}