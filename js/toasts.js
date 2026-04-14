(function (H) {
  'use strict';

  const rootId = 'toastRoot';

  function ensureRoot() {
    let el = H.utils.$(rootId);
    if (!el) {
      el = document.createElement('div');
      el.id = rootId;
      el.className = 'toast-root';
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    return el;
  }

  /**
   * @param {string} message
   * @param {'info'|'success'|'error'} [type]
   * @param {number} [durationMs]
   */
  function showToast(message, type, durationMs) {
    const root = ensureRoot();
    const t = document.createElement('div');
    t.className = 'toast ' + (type || 'info');
    t.textContent = message;
    root.appendChild(t);
    const ms = durationMs == null ? 2800 : durationMs;
    setTimeout(() => {
      t.remove();
    }, ms);
  }

  H.toasts = { showToast };
})(window.HamApp = window.HamApp || {});
