import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { useAuthStore } from '../store/authStore';

type Comment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?:  {
    full_name: string;
    email: string;
  };
};

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [report, setReport] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
    loadComments();
  }, [id]);

  const loadReport = async () => {
    try {
      console.log('Loading report:', id);
      const res = await axiosInstance.get(`/reports/${id}`);
      console.log('Report loaded:', res.data);
      setReport(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading report:', err);
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/reports/${id}/comments`);
      console.log('Comments loaded:', res.data);
      setComments(res.data);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleVote = async (voteType: string) => {
    try {
      console.log(`Voting:  ${voteType}`);
      const res = await axiosInstance.post(`/reports/${id}/vote?vote_type=${voteType}`);
      console.log('Vote success:', res.data);
      setReport(res.data);
      alert(`${voteType === 'upvote' ? 'Beğendiniz!' : 'Beğenmediniz!'}`);
    } catch (err: any) {
      console.error('Vote error:', err);
      alert('Hata:  ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('Yorum boş olamaz!');
      return;
    }

    try {
      await axiosInstance.post(`/reports/${id}/comments`, {
        content: newComment
      });
      setNewComment('');
      loadComments();
      alert('Yorum eklendi!');
    } catch (err:  any) {
      console.error('Error adding comment:', err);
      alert('Hata: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (! confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      loadComments();
      alert('Yorum silindi!');
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      alert('Hata: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '32px',
        fontWeight: 'bold'
      }}>
        Yükleniyor...
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems:  'center', 
        height: '100vh',
        fontSize: '24px',
        color: '#ef4444'
      }}>
        İhbar bulunamadı
      </div>
    );
  }

  const canDelete = user?.role === 'ADMIN' || report.user_id === user?.id;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '32px' 
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* HEADER */}
        <button
          onClick={() => navigate('/reports')}
          style={{
            marginBottom: '24px',
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ← Geri
        </button>

        {/* MAIN CARD */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          {/* TITLE */}
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight:  'bold', 
            marginBottom: '16px',
            color: '#1f2937'
          }}>
            {report.title}
          </h1>

          {/* BADGES */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '8px 16px',
              backgroundColor: 
                report.status === 'pending' ? '#fef3c7' :  
                report.status === 'in_progress' ? '#dbeafe' : 
                report.status === 'resolved' ? '#d1fae5' : '#fee2e2',
              color: 
                report.status === 'pending' ? '#92400e' : 
                report.status === 'in_progress' ? '#1e40af' :
                report.status === 'resolved' ? '#065f46' : '#991b1b',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 600,
            }}>
              {report.status === 'pending' && '⏳ Bekliyor'}
              {report.status === 'in_progress' && '🔄 İşlemde'}
              {report.status === 'resolved' && '✅ Çözüldü'}
              {report.status === 'rejected' && '❌ Reddedildi'}
            </span>

            <span style={{
              padding: '8px 16px',
              backgroundColor: 
                report.priority === 'urgent' ? '#fee2e2' : 
                report.priority === 'high' ? '#fed7aa' :
                report.priority === 'medium' ? '#fef3c7' :  '#d1fae5',
              color: 
                report.priority === 'urgent' ? '#991b1b' :
                report.priority === 'high' ? '#9a3412' :
                report.priority === 'medium' ? '#92400e' : '#065f46',
              borderRadius:  '999px',
              fontSize:  '14px',
              fontWeight: 600,
            }}>
              {report.priority === 'urgent' && '🔴 Acil'}
              {report.priority === 'high' && '🟠 Yüksek'}
              {report.priority === 'medium' && '🟡 Orta'}
              {report.priority === 'low' && '🟢 Düşük'}
            </span>

            <span style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight:  600,
            }}>
              {report.category}
            </span>

            <span style={{
              padding: '8px 16px',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              borderRadius:  '999px',
              fontSize:  '14px',
              fontWeight: 600,
            }}>
              {new Date(report.created_at).toLocaleDateString('tr-TR')}
            </span>
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              fontSize:  '20px', 
              fontWeight: '600',
              marginBottom: '10px',
              color: '#374151'
            }}>
              Açıklama
            </h2>
            <p style={{ 
              fontSize: '16px', 
              lineHeight: '1.6',
              color: '#4b5563'
            }}>
              {report.description}
            </p>
          </div>

          {/* LOCATION */}
          {report.address && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight:  '600',
                marginBottom:  '10px',
                color:  '#374151'
              }}>
                Konum
              </h2>
              <p style={{ 
                fontSize: '16px',
                color: '#4b5563'
              }}>
                📍 {report.address}
              </p>
            </div>
          )}

          {/* IMAGES */}
          {report.image_urls && report.image_urls.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600',
                marginBottom: '10px',
                color: '#374151'
              }}>
                📸 Fotoğraflar
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns:  'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '12px' 
              }}>
                {report.image_urls.map((url:  string, i: number) => (
                  <img
                    key={i}
                    src={`http://localhost:8001${url}`}
                    alt={`Report image ${i + 1}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border:  '2px solid #e5e7eb',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.open(`http://localhost:8001${url}`, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VOTING */}
          <div style={{ 
            borderTop: '2px solid #e5e7eb',
            paddingTop: '20px',
            marginBottom: '20px'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              marginBottom: '10px',
              color: '#374151'
            }}>
              Bu ihbar hakkında ne düşünüyorsunuz? 
            </h2>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={() => handleVote('upvote')}
                style={{
                  padding: '12px 24px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  border: '2px solid #86efac',
                  borderRadius:  '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                👍 Beğendim ({report.upvotes})
              </button>

              <button
                onClick={() => handleVote('downvote')}
                style={{
                  padding: '12px 24px',
                  fontSize: '18px',
                  fontWeight:  '600',
                  backgroundColor:  '#fee2e2',
                  color: '#991b1b',
                  border: '2px solid #fca5a5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                👎 Beğenmedim ({report.downvotes})
              </button>
            </div>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight:  '600',
            marginBottom:  '24px',
            color: '#1f2937'
          }}>
            💬 Yorumlar ({comments.length})
          </h2>

          {/* ADD COMMENT FORM */}
          <div style={{ marginBottom: '32px' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yorumunuzu yazın..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '12px',
                resize: 'vertical'
              }}
            />
            <button
              onClick={handleAddComment}
              style={{
                padding:  '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius:  '8px',
                cursor:  'pointer'
              }}
            >
              💬 Yorum Yap
            </button>
          </div>

          {/* COMMENTS LIST */}
          {comments.length === 0 ?  (
            <p style={{ 
              textAlign: 'center', 
              color: '#6b7280',
              fontSize: '16px',
              padding: '32px'
            }}>
              Henüz yorum yapılmamış.  İlk yorumu siz yapın!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection:  'column', gap: '16px' }}>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <p style={{ 
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '4px'
                      }}>
                        👤 {comment.user?.full_name || 'Kullanıcı'}
                      </p>
                      <p style={{ 
                        fontSize: '12px',
                        color: '#9ca3af'
                      }}>
                        {new Date(comment.created_at).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    
                    {/* DELETE BUTTON (only for comment owner or admin) */}
                    {(user?.id === comment.user_id || user?.role === 'ADMIN') && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: '#fee2e2',
                          color: '#991b1b',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        🗑️ Sil
                      </button>
                    )}
                  </div>
                  <p style={{ 
                    fontSize: '16px',
                    color: '#4b5563',
                    lineHeight: '1.5'
                  }}>
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}