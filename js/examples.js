(function (H) {
  'use strict';

  /** Fictional “other station” for templates (do not use on air without verifying). */
  const OTHER = 'G4BBB';

  /**
   * @param {Record<string, unknown>} els
   */
  function displayMy(els) {
    const g = els.globalCallsign && els.globalCallsign.value && String(els.globalCallsign.value).trim();
    const m = els.myCallsign && els.myCallsign.value && String(els.myCallsign.value).trim();
    const raw = g || m || '';
    const c = H.utils.normaliseCallsign(raw);
    return c || 'M0AAA';
  }

  /**
   * @param {string} my
   * @param {string} other
   */
  function phraseNavCardsHTML(my, other) {
    return (
      '<div class="mini-card">' +
      '<h4>Net entry</h4>' +
      '<p><strong>' +
      my +
      ', no traffic</strong><br /><strong>' +
      my +
      ', with traffic</strong><br /><strong>' +
      my +
      ', late entry, no traffic</strong></p>' +
      '</div>' +
      '<div class="mini-card">' +
      '<h4>When called</h4>' +
      '<p><strong>' +
      my +
      ' returning…</strong><br />Use when net control calls you in.</p>' +
      '</div>' +
      '<div class="mini-card">' +
      '<h4>Hand back</h4>' +
      '<p><strong>Back to net, ' +
      my +
      '</strong><br /><strong>Over to ' +
      other +
      ', ' +
      my +
      '</strong></p>' +
      '</div>' +
      '<div class="mini-card">' +
      '<h4>QSO open</h4>' +
      '<p><strong>' +
      other +
      ' this is ' +
      my +
      ', go ahead.</strong></p>' +
      '</div>' +
      '<div class="mini-card">' +
      '<h4>CQ</h4>' +
      '<p><strong>CQ CQ, this is ' +
      my +
      ' calling CQ and listening.</strong></p>' +
      '</div>' +
      '<div class="mini-card">' +
      '<h4>Leaving</h4>' +
      '<p><strong>' +
      my +
      ' going clear, 73, ' +
      my +
      '</strong><br /><strong>' +
      my +
      ' going QRT for now</strong></p>' +
      '</div>'
    );
  }

  /**
   * @param {Record<string, unknown>} els
   */
  function refreshOverview(els) {
    const my = displayMy(els);
    const other = OTHER;

    const cards = H.utils.$('ovPhraseExamples');
    if (cards) {
      cards.innerHTML = phraseNavCardsHTML(my, other);
    }

    const netTpl = H.utils.$('ovExNetTemplate');
    if (netTpl) {
      netTpl.textContent =
        my +
        ' returning,\nname is Alex,\nQTH Anytown, Scotland,\nnothing further to report.\nBack to net,\n' +
        my;
    }

    const pass = H.utils.$('ovExPassScript');
    if (pass) {
      pass.textContent = 'Over to ' + other + ', ' + my + '\n\n' + other + ' go ahead, ' + my;
    }

    const hint = H.utils.$('heroCallsignDisplay');
    if (hint) {
      hint.textContent = my;
    }

    if (els.phoneticInput && !String(els.phoneticInput.value || '').trim()) {
      els.phoneticInput.placeholder = my;
    }
  }

  /**
   * @param {Record<string, unknown>} els
   */
  function syncGlobalToFlow(els) {
    if (!els.globalCallsign || !els.myCallsign) return;
    const g = String(els.globalCallsign.value || '').trim();
    const m = String(els.myCallsign.value || '').trim();
    if (g !== m) {
      els.myCallsign.value = els.globalCallsign.value;
    }
  }

  /**
   * @param {Record<string, unknown>} els
   */
  function syncFlowToGlobal(els) {
    if (!els.globalCallsign || !els.myCallsign) return;
    const g = String(els.globalCallsign.value || '').trim();
    const m = String(els.myCallsign.value || '').trim();
    if (g !== m) {
      els.globalCallsign.value = els.myCallsign.value;
    }
  }

  H.examples = {
    OTHER,
    displayMy,
    refreshOverview,
    syncGlobalToFlow,
    syncFlowToGlobal,
  };
})(window.HamApp = window.HamApp || {});
