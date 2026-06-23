const API_BASE = 'http://localhost:8000/we-okas/organizations';

function _authHeaders() {
  const token = localStorage.getItem('okas_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function _request(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: _authHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || 'Request failed');
  }
  return json;
}

const siService = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
    ).toString();
    return _request('GET', qs ? `?${qs}` : '');
  },
  create: (data)     => _request('POST', '', data),
  update: (id, data) => _request('PUT', `/${id}`, data),
  delete: (id)       => _request('DELETE', `/${id}`),
};

export default siService;
