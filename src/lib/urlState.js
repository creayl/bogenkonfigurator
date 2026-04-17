// Base64 (URL-safe) encoding of the configurator state for shareable links.

function toUrlSafe(b64) {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromUrlSafe(s) {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return s.replace(/-/g, '+').replace(/_/g, '/') + pad;
}

export function encodeState(state) {
  try {
    const json = JSON.stringify(state);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return toUrlSafe(b64);
  } catch {
    return '';
  }
}

export function decodeState(encoded) {
  try {
    const b64 = fromUrlSafe(encoded);
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function buildShareableUrl(state) {
  const url = new URL(window.location.href);
  url.searchParams.set('c', encodeState(state));
  return url.toString();
}
