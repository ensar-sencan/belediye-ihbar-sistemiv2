const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8001';

export function getImageUrl(filename: string): string {
  if (!filename) return '';
  
  // If already a full URL, return as is
  if (filename.startsWith('http')) return filename;
  
  // If starts with /uploads, use API base
  if (filename.startsWith('/uploads')) return `${API_BASE_URL}${filename}`;
  
  // Otherwise, assume it's just a filename
  return `${API_BASE_URL}/uploads/${filename}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}