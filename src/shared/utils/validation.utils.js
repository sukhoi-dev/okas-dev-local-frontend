export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isRequired = (v) => v !== null && v !== undefined && String(v).trim() !== '';
export const minLength = (min) => (v) => String(v).length >= min;
export const maxLength = (max) => (v) => String(v).length <= max;
export const isPhone = (v) => /^[+]?[\d\s\-()]{7,15}$/.test(v);

export function validate(value, rules) {
  for (const { test, message } of rules) {
    if (!test(value)) return message;
  }
  return null;
}
