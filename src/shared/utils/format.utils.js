export const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
export const truncate   = (s, n = 50) => s?.length > n ? s.slice(0, n) + '…' : s;
export const formatNumber = (n) => n != null ? new Intl.NumberFormat('en-IN').format(n) : '—';
export const roleLabel = (r) => ({ admin: 'Admin', distributor: 'Distributor', si: 'System Integrator', pm: 'Project Manager', user: 'User' }[r] || r);
