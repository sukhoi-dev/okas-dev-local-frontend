export const formatDate = (d) => d ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(d)) : '—';
export const formatDateTime = (d) => d ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d)) : '—';
export function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  for (const [l, n] of [['year',31536000],['month',2592000],['week',604800],['day',86400],['hour',3600],['minute',60]]) {
    const c = Math.floor(s / n); if (c >= 1) return `${c} ${l}${c > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}
