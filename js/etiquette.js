(function (H) {
  'use strict';

  /** Wire checklist checkboxes to state and persist */
  function wireChecklist(els, st, persist) {
    const map = [
      ['chkListen30', 'listen30'],
      ['chkAskInUse', 'askInUse'],
      ['chkCourtesyBeep', 'courtesyBeep'],
      ['chkReady', 'ready'],
    ];
    map.forEach(([id, key]) => {
      const el = H.utils.$(id);
      if (!el) return;
      el.checked = !!st.checklist[key];
      el.addEventListener('change', () => {
        st.checklist[key] = el.checked;
        persist();
      });
    });
  }

  H.etiquette = { wireChecklist };
})(window.HamApp = window.HamApp || {});
