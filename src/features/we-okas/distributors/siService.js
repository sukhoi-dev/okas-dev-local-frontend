const BASE = '/api';

async function request(url, token, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    window.location.href = '/auth/login';
    return Promise.reject(new Error('Unauthorized'));
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || data.message || `Request failed (${res.status})`);
  }

  // 204 No Content — no body
  if (res.status === 204) return null;
  return res.json();
}

// 1. List SIs
export async function getSIs(token, distributorId, params = {}) {
  const query = new URLSearchParams();
  if (params.search)  query.set('search', params.search);
  if (params.status)  query.set('status', params.status);
  if (params.page)    query.set('page',   String(params.page));
  if (params.limit)   query.set('limit',  String(params.limit));
  if (params.name?.length)    params.name.forEach(n    => query.append('name',    n));
  if (params.company?.length) params.company.forEach(c => query.append('company', c));

  return request(
    `${BASE}/distributors/${distributorId}/system-integrators?${query}`,
    token
  );
}

// 2. Get SI detail
export async function getSIDetail(token, distributorId, siId) {
  return request(
    `${BASE}/distributors/${distributorId}/system-integrators/${siId}`,
    token
  );
}

// 3. Add new SI
export async function addSI(token, distributorId, data) {
  return request(
    `${BASE}/distributors/${distributorId}/system-integrators`,
    token,
    { method: 'POST', body: JSON.stringify(data) }
  );
}

// 4. Edit SI
export async function editSI(token, distributorId, siId, data) {
  return request(
    `${BASE}/distributors/${distributorId}/system-integrators/${siId}`,
    token,
    { method: 'PUT', body: JSON.stringify(data) }
  );
}

// 5. Toggle status
export async function toggleSIStatus(token, distributorId, siId, status) {
  return request(
    `${BASE}/distributors/${distributorId}/system-integrators/${siId}/status`,
    token,
    { method: 'PATCH', body: JSON.stringify({ status }) }
  );
}

// 6. Archive SI
export async function archiveSI(token, distributorId, siId) {
  return request(
    `${BASE}/distributors/${distributorId}/system-integrators/${siId}/archive`,
    token,
    { method: 'PATCH' }
  );
}

// 7. Download SI details (triggers browser file download)
export async function downloadSI(token, distributorId, siId, format = 'pdf') {
  const res = await fetch(
    `${BASE}/distributors/${distributorId}/system-integrators/${siId}/download?format=${format}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Download failed');
  }

  const blob     = await res.blob();
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement('a');
  a.href         = url;
  a.download     = `si_${siId}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 8. Delete SI
export async function deleteSI(token, distributorId, siId) {
  return request(
    `${BASE}/distributors/${distributorId}/system-integrators/${siId}`,
    token,
    { method: 'DELETE' }
  );
}
