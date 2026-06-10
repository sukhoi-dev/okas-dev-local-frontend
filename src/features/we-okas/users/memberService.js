import weOkasClient from '../../../api/weOkasClient';

// All responses from /we-okas/* use the envelope { id, status, message, body }.
// These helpers unwrap the `body` for success cases.

const BASE = '/we-okas/members';

const memberService = {
  /** Returns array of member objects (or []) */
  list: (params = {}) =>
    weOkasClient.get(BASE, { params }).then((r) => r.data.body ?? []),

  /** Returns a single member object */
  detail: (id) =>
    weOkasClient.get(`${BASE}/${id}`).then((r) => r.data.body),

  /** Returns full envelope { status, message, body } — body = created member */
  create: (data) =>
    weOkasClient.post(BASE, data).then((r) => r.data),

  /** Returns full envelope — body = updated member */
  update: (id, data) =>
    weOkasClient.put(`${BASE}/${id}`, data).then((r) => r.data),

  /** Returns full envelope — body = patched member */
  patch: (id, data) =>
    weOkasClient.patch(`${BASE}/${id}`, data).then((r) => r.data),

  /** Returns full envelope — body = null */
  remove: (id) =>
    weOkasClient.delete(`${BASE}/${id}`).then((r) => r.data),
};

export default memberService;
