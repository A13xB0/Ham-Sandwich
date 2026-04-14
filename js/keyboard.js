(function (H) {
  'use strict';

  /** @type {{():void}[]} */
  const handlers = [];

  function register(fn) {
    handlers.push(fn);
  }

  function onKeydown(e) {
    const t = e.target;
    const tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        /* allow help */
      } else {
        return;
      }
    }
    for (let i = 0; i < handlers.length; i++) {
      handlers[i](e);
    }
  }

  function init() {
    document.addEventListener('keydown', onKeydown);
  }

  function toggleHelp() {
    const h = H.utils.$('keyboardHelp');
    if (!h) return;
    h.classList.toggle('open');
  }

  H.keyboard = { register, init, toggleHelp };
})(window.HamApp = window.HamApp || {});
