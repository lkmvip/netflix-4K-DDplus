/* v2 — inject into the page MAIN world before requests start.
 * Replace the old script and reload the page; do not run both versions.
 * Matching responses keep the original script's {} replacement behavior.
 */
(() => {
  'use strict';
  const KEY = '__NetflixBlockerPatched';
  if (window[KEY]) return;
  const state = { version: 2, fetch: false, xhr: false };
  const fields = ['clcsInterstitialLolomo', 'clcsInterstitialPlaybackV2'];
  const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  function isTarget(value) {
    try {
      const url = new URL(value, window.location.href);
      return (url.protocol === 'https:' || url.protocol === 'http:') &&
        (url.hostname === 'netflix.com' || url.hostname.endsWith('.netflix.com')) &&
        url.pathname === '/graphql';
    } catch { return false; }
  }

  function matches(json) {
    return json !== null && typeof json === 'object' && !Array.isArray(json) &&
      json.data !== null && typeof json.data === 'object' &&
      fields.some(key => own(json.data, key));
  }

  // Keep independent results when a server returns a GraphQL batch.
  function transform(json) {
    if (Array.isArray(json)) {
      let changed = false;
      const value = json.map(item => {
        if (!matches(item)) return item;
        changed = true;
        return {};
      });
      return { changed, value };
    }
    return matches(json) ? { changed: true, value: {} } : { changed: false, value: json };
  }

  function parse(text) {
    return transform(JSON.parse(text.replace(/^\uFEFF/, '')));
  }

  function decorate(response, original) {
    // A constructed Response otherwise loses these read-only metadata values.
    for (const key of ['url', 'redirected', 'type']) {
      Object.defineProperty(response, key, { configurable: true, value: original[key] });
    }
    const clone = response.clone;
    Object.defineProperty(response, 'clone', {
      configurable: true,
      value: function() { return decorate(clone.call(this), original); }
    });
    return response;
  }

  if (typeof window.fetch === 'function') {
    const originalFetch = window.fetch;
    const patchedFetch = async function(input, init) {
      let target = false;
      try {
        const value = input && typeof input === 'object' && 'url' in input ? input.url : input;
        target = isTarget(value);
      } catch { /* Native fetch still validates its own arguments. */ }
      const response = await Reflect.apply(originalFetch, this, arguments);
      if (!target || !response.ok || response.status === 204 || response.status === 205) return response;
      try {
        const result = parse(await response.clone().text());
        if (!result.changed) return response;
        const headers = new Headers(response.headers);
        // The new body is uncompressed and has a different size/digest.
        for (const key of ['content-length', 'content-encoding', 'etag', 'content-md5', 'digest', 'content-digest', 'repr-digest']) headers.delete(key);
        headers.set('content-type', 'application/json; charset=utf-8');
        return decorate(new Response(JSON.stringify(result.value), {
          status: response.status, statusText: response.statusText, headers
        }), response);
      } catch { return response; }
    };
    try {
      window.fetch = patchedFetch;
      state.fetch = window.fetch === patchedFetch;
    } catch (error) { console.warn('[NetflixBlocker] fetch patch failed:', error); }
  }

  const proto = window.XMLHttpRequest && window.XMLHttpRequest.prototype;
  if (proto) {
    const textDesc = Object.getOwnPropertyDescriptor(proto, 'responseText');
    const responseDesc = Object.getOwnPropertyDescriptor(proto, 'response');
    const openDesc = Object.getOwnPropertyDescriptor(proto, 'open');
    const records = new WeakMap();
    if (textDesc && textDesc.get && textDesc.configurable &&
        responseDesc && responseDesc.get && responseDesc.configurable && openDesc && typeof openDesc.value === 'function') {
      function converted(xhr) {
        const record = records.get(xhr);
        if (!record || !record.target || xhr.readyState !== 4 || xhr.status < 200 || xhr.status >= 300) return null;
        const type = xhr.responseType;
        if (type !== '' && type !== 'text' && type !== 'json') return null;
        if (record.checked && record.type === type) return record.result;
        try {
          const result = type === 'json' ? transform(responseDesc.get.call(xhr)) : parse(textDesc.get.call(xhr));
          record.result = result.changed ? { value: result.value, text: JSON.stringify(result.value) } : null;
        } catch { record.result = null; }
        record.checked = true;
        record.type = type;
        return record.result;
      }
      try {
        // Getter interception works regardless of listener order or onload/onreadystatechange assignment.
        Object.defineProperty(proto, 'responseText', {
          ...textDesc,
          get: function() {
            const original = textDesc.get.call(this); // Preserve native InvalidStateError for non-text types.
            const result = converted(this);
            return result ? result.text : original;
          }
        });
        Object.defineProperty(proto, 'response', {
          ...responseDesc,
          get: function() {
            const original = responseDesc.get.call(this);
            const result = converted(this);
            return result ? (this.responseType === 'json' ? result.value : result.text) : original;
          }
        });
        Object.defineProperty(proto, 'open', {
          ...openDesc,
          value: function(method, url) {
            const previous = records.get(this);
            records.set(this, { target: isTarget(url), checked: false, result: null });
            try { return Reflect.apply(openDesc.value, this, arguments); }
            catch (error) {
              if (previous) records.set(this, previous); else records.delete(this);
              throw error;
            }
          }
        });
        state.xhr = true;
      } catch (error) {
        // Roll back partial installation.
        Object.defineProperty(proto, 'responseText', textDesc);
        Object.defineProperty(proto, 'response', responseDesc);
        Object.defineProperty(proto, 'open', openDesc);
        console.warn('[NetflixBlocker] XHR patch failed:', error);
      }
    } else console.warn('[NetflixBlocker] XHR getters cannot be patched in this environment');
  }
  if (state.fetch || state.xhr) window[KEY] = state;
  console.info('[NetflixBlocker] v2 installed', state);
})();
