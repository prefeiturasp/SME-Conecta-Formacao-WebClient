'use strict';

function stringify(obj, _opts) {
  if (!obj || typeof obj !== 'object') return '';
  return Object.entries(obj)
    .filter(([, v]) => v != null)
    .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
    .join('&');
}

function parse(str) {
  if (!str) return {};
  return Object.fromEntries(
    str
      .split('&')
      .filter(Boolean)
      .map((p) => {
        const [k, v = ''] = p.split('=');
        return [decodeURIComponent(k), decodeURIComponent(v)];
      }),
  );
}

module.exports = { stringify, parse };
