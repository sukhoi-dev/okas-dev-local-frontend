import weOkasClient from '../../../api/weOkasClient';

const BASE = '/we-okas/roles';

const roleService = {
  list:     (params = {})   => weOkasClient.get(BASE, { params }).then((r) => r.data.body ?? []),
  detail:   (id)            => weOkasClient.get(`${BASE}/${id}`).then((r) => r.data.body),
  create:   (data)          => weOkasClient.post(BASE, data).then((r) => r.data),
  update:   (id, data)      => weOkasClient.put(`${BASE}/${id}`, data).then((r) => r.data),
  remove:   (id)            => weOkasClient.delete(`${BASE}/${id}`).then((r) => r.data),
  members:  (id)            => weOkasClient.get(`${BASE}/${id}/members`).then((r) => r.data.body ?? []),
  reassign: (id, data)      => weOkasClient.post(`${BASE}/${id}/reassign`, data).then((r) => r.data),
};

export default roleService;
