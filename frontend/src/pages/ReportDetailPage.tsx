import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import {
  ArrowLeft, MapPin, Calendar, ThumbsUp, ThumbsDown,
  MessageSquare, Trash2, Send, Loader, User, AlertTriangle,
} from 'lucide-react';

type Comment = {
  id: string; user_id: string; content: string; created_at: string;
  user?: { full_name: string; email: string };
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:     { label: 'Bekliyor',    cls: 'badge-pending' },
  in_progress: { label: 'İşlemde',    cls: 'badge-in_progress' },
  resolved:    { label: 'Çözüldü',    cls: 'badge-resolved' },
  rejected:    { label: 'Reddedildi', cls: 'badge-rejected' },
};
const PRIORITY_MAP: Record<string, { label: string; cls: string }> = {
  low:    { label: 'Düşük',  cls: 'badge-low' },
  medium: { label: 'Orta',   cls: 'badge-medium' },
  high:   { label: 'Yüksek', cls: 'badge-high' },
  urgent: { label: 'Acil',   cls: 'badge-urgent' },
};
const CATEGORY_LABELS: Record<string, string> = {
  pothole: 'Çukur', lighting: 'Aydınlatma', cleaning: 'Temizlik',
  park: 'Park/Bahçe', water: 'Su/Kanalizasyon', road: 'Yol', other: 'Diğer',
};

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [report, setReport] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [myVote, setMyVote] = useState<'upvote' | 'downvote' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { loadReport(); loadComments(); }, [id]);

  const loadReport = () =>
    axiosInstance.get(`/reports/${id}`)
      .then(r => { setReport(r.data); setLoading(false); })
      .catch(() => setLoading(false));

  const loadComments = () =>
    axiosInstance.get(`/reports/${id}/comments`)
      .then(r => setComments(r.data))
      .catch(() => {});

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (voting) return;
    if (myVote === type) {
      toast('Zaten bu seçeneği seçtiniz.', { icon: 'ℹ️' });
      return;
    }
    setVoting(true);
    try {
      const r = await axiosInstance.post(`/reports/${id}/vote?vote_type=${type}`);
      setReport(r.data);
      setMyVote(type);
      toast.success(type === 'upvote' ? 'Beğendiniz!' : 'Beğenmediniz.');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Oy verilemedi.');
    } finally { setVoting(false); }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await axiosInstance.post(`/reports/${id}/comments`, { content: newComment });
      setNewComment('');
      loadComments();
      toast.success('Yorumunuz eklendi.');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Yorum eklenemedi.');
    } finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirmDelete !== commentId) {
      setConfirmDelete(commentId);
      return;
    }
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setConfirmDelete(null);
      loadComments();
      toast.success('Yorum silindi.');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Silinemedi.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  if (!report) return (
    <div className="flex items-center justify-center h-64 text-slate-400">İhbar bulunamadı.</div>
  );

  const status = STATUS_MAP[report.status] ?? { label: report.status, cls: 'badge-low' };
  const priority = PRIORITY_MAP[report.priority] ?? { label: report.priority, cls: 'badge-low' };

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('/reports')} className="btn-secondary mb-6">
        <ArrowLeft className="w-4 h-4" /> Geri
      </button>

      {/* Main Card */}
      <div className="card mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold text-slate-900 leading-snug">{report.title}</h1>
          <div className="flex gap-2 flex-shrink-0">
            <span className={`badge ${status.cls}`}>{status.label}</span>
            <span className={`badge ${priority.cls}`}>{priority.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 mb-5">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />
            {new Date(report.created_at).toLocaleDateString('tr-TR')}
          </span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {CATEGORY_LABELS[report.category] ?? report.category}
          </span>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-5">{report.description}</p>

        {report.address && (
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
            <MapPin className="w-4 h-4 text-slate-400" /> {report.address}
          </div>
        )}

        {/* Images */}
        {report.image_urls?.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-5">
            {report.image_urls.map((url: string, i: number) => (
              <img key={i} src={`/uploads${url.split('/uploads')[1] ?? url}`} alt=""
                onClick={() => window.open(url, '_blank')}
                className="w-full h-32 object-cover rounded-xl border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity" />
            ))}
          </div>
        )}

        {/* Vote */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-700 mb-3">Bu ihbar hakkında ne düşünüyorsunuz?</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleVote('upvote')}
              disabled={voting}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                myVote === 'upvote'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <ThumbsUp className="w-4 h-4" /> Beğendim ({report.upvotes})
            </button>
            <button
              onClick={() => handleVote('downvote')}
              disabled={voting}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                myVote === 'downvote'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
              }`}
            >
              <ThumbsDown className="w-4 h-4" /> Beğenmedim ({report.downvotes})
            </button>
          </div>
          {myVote && (
            <p className="text-xs text-slate-400 mt-2">
              {myVote === 'upvote' ? '✓ Beğendiniz' : '✓ Beğenmediniz'} — oyunuz kaydedildi
            </p>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-900">Yorumlar ({comments.length})</h2>
        </div>

        {/* Add Comment */}
        <div className="flex gap-3 mb-6">
          <textarea value={newComment} rows={2} placeholder="Yorumunuzu yazın..."
            onChange={(e) => setNewComment(e.target.value)}
            className="input flex-1 resize-none" />
          <button onClick={handleAddComment} disabled={submitting || !newComment.trim()}
            className="btn-primary self-end px-4">
            {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>

        {/* List */}
        {comments.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">Henüz yorum yok. İlk yorumu siz yapın!</p>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-semibold text-slate-900">
                        {c.user?.full_name || 'Kullanıcı'}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {new Date(c.created_at).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    {(user?.id === c.user_id || user?.role === 'ADMIN') && (
                      <div className="flex items-center gap-1">
                        {confirmDelete === c.id ? (
                          <>
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              className="flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <AlertTriangle className="w-3 h-3" /> Evet, sil
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs text-slate-500 px-2 py-0.5 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              İptal
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
