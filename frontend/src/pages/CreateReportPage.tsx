import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import { Upload, X, Loader2, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  { value: 'pothole', label: 'Çukur' },
  { value: 'lighting', label: 'Aydınlatma' },
  { value: 'cleaning', label: 'Temizlik' },
  { value: 'park', label: 'Park / Bahçe' },
  { value: 'water', label: 'Su / Kanalizasyon' },
  { value: 'road', label: 'Yol' },
  { value: 'other', label: 'Diğer' },
];
const PRIORITIES = [
  { value: 'low', label: 'Düşük', color: 'text-emerald-600' },
  { value: 'medium', label: 'Orta', color: 'text-amber-600' },
  { value: 'high', label: 'Yüksek', color: 'text-orange-600' },
  { value: 'urgent', label: 'Acil', color: 'text-red-600' },
];

export default function CreateReportPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [municipalities, setMunicipalities] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'pothole', priority: 'medium',
    address: '', latitude: 40.9889, longitude: 29.0277, is_anonymous: false,
    municipality_id: '',
  });

  useEffect(() => {
    axiosInstance.get('/municipalities/').then(r => setMunicipalities(r.data || [])).catch(() => {});
  }, []);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, municipality_id: formData.municipality_id || undefined };
      const res = await axiosInstance.post('/reports/', payload);
      if (images.length > 0) {
        const fd = new FormData();
        images.forEach(img => fd.append('files', img));
        await axiosInstance.post(`/reports/${res.data.id}/upload-images`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      toast.success('İhbar başarıyla oluşturuldu!');
      navigate('/reports');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((e: any) => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join('\n')
        : (typeof detail === 'string' ? detail : err.message);
      toast.error('Hata: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string, value: any) => setFormData(p => ({ ...p, [field]: value }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/reports')} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Yeni İhbar Oluştur</h1>
          <p className="text-slate-500 text-sm mt-0.5">Yaşadığınız sorunu detaylıca açıklayın</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {/* Title */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Temel Bilgiler</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Başlık *</label>
              <input type="text" required value={formData.title} placeholder="Kısa ve açıklayıcı bir başlık girin"
                onChange={(e) => set('title', e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Açıklama *</label>
              <textarea required rows={4} value={formData.description} placeholder="Sorunu detaylıca açıklayın..."
                onChange={(e) => set('description', e.target.value)}
                className="input resize-none" />
            </div>
          </div>
        </div>

        {/* Category & Priority */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Kategori ve Öncelik</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kategori *</label>
              <select value={formData.category} onChange={(e) => set('category', e.target.value)} className="input">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Öncelik</label>
              <select value={formData.priority} onChange={(e) => set('priority', e.target.value)} className="input">
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Address + Municipality */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Konum</h2>
          <div className="space-y-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={formData.address} placeholder="Sokak, mahalle, ilçe..."
                onChange={(e) => set('address', e.target.value)} className="input pl-9" />
            </div>
            {municipalities.length > 0 && (
              <div>
                <label className="label">Belediye</label>
                <select value={formData.municipality_id} onChange={(e) => set('municipality_id', e.target.value)} className="input">
                  <option value="">Otomatik seç</option>
                  {municipalities.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Fotoğraflar (en fazla 5)</h2>
          <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <Upload className="w-8 h-8 text-slate-300" />
            <span className="text-sm text-slate-500">Fotoğraf seçmek için tıklayın</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt="" className="w-full h-20 object-cover rounded-lg border border-slate-200" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Anonymous */}
        <div className="card">
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => set('is_anonymous', !formData.is_anonymous)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.is_anonymous ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
              {formData.is_anonymous && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Anonim olarak gönder</p>
              <p className="text-xs text-slate-400">Adınız ihbarda görünmez</p>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Oluşturuluyor...</> : 'İhbarı Oluştur'}
          </button>
          <button type="button" onClick={() => navigate('/reports')} className="btn-secondary px-6">
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
