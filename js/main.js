(function (H) {
  'use strict';

  function gatherEls() {
    const $ = H.utils.$;
    return {
      globalCallsign: $('globalCallsign'),
      flowType: $('flowType'),
      myCallsign: $('myCallsign'),
      otherCallsign: $('otherCallsign'),
      operatorName: $('operatorName'),
      qth: $('qth'),
      postcode: $('postcode'),
      equipment: $('equipment'),
      antenna: $('antenna'),
      signalReport: $('signalReport'),
      accessMethod: $('accessMethod'),
      repeaterName: $('repeaterName'),
      extraNotes: $('extraNotes'),
      trafficType: $('trafficType'),
      weatherSummary: $('weatherSummary'),
      conversationStage: $('conversationStage'),
      buildFlowBtn: $('buildFlowBtn'),
      fetchWeatherBtn: $('fetchWeatherBtn'),
      advanceBtn: $('advanceBtn'),
      backBtn: $('backBtn'),
      resetFlowBtn: $('resetFlowBtn'),
      currentScript: $('currentScript'),
      customScript: $('customScript'),
      messageBody: $('messageBody'),
      returnSnippet: $('returnSnippet'),
      copyScriptBtn: $('copyScriptBtn'),
      netMemberInput: $('netMemberInput'),
      netMemberNameInput: $('netMemberNameInput'),
      chkNetRosterMode: $('chkNetRosterMode'),
      addNetMemberBtn: $('addNetMemberBtn'),
      setMeControlBtn: $('setMeControlBtn'),
      rotateSpeakerBtn: $('rotateSpeakerBtn'),
      clearNetMembersBtn: $('clearNetMembersBtn'),
      membersList: $('membersList'),
      currentSpeakerDisplay: $('currentSpeakerDisplay'),
      controlHolderDisplay: $('controlHolderDisplay'),
      nextSpeakerDisplay: $('nextSpeakerDisplay'),
      returnCueDisplay: $('returnCueDisplay'),
      timerAutoStart: $('timerAutoStart'),
      jargonSearch: $('jargonSearch'),
      jargonDecodeInput: $('jargonDecodeInput'),
      phoneticInput: $('phoneticInput'),
      practiceFeel: $('practiceFeel'),
      flowDetails: $('flowDetails'),
    };
  }

  function wireReferenceTabs() {
    document.querySelectorAll('.ref-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab) H.ui.setReferenceTab(tab);
      });
    });
  }

  function wireJargon(els) {
    const results = H.utils.$('jargonResults');
    const decodeOut = H.utils.$('jargonDecodeOut');
    function renderSearch() {
      if (!results || !els.jargonSearch) return;
      const q = els.jargonSearch.value.trim();
      results.innerHTML = '';
      if (!q) {
        results.innerHTML = '<div class="muted">Type a term to search the glossary.</div>';
        return;
      }
      const hits = H.jargon.search(q);
      if (!hits.length) {
        results.innerHTML = '<div class="muted">No matches.</div>';
        return;
      }
      hits.slice(0, 20).forEach((h) => {
        const d = document.createElement('div');
        d.className = 'jargon-hit';
        d.innerHTML = '<strong>' + h.term + '</strong> — ' + h.meaning;
        results.appendChild(d);
      });
    }
    if (els.jargonSearch) {
      els.jargonSearch.addEventListener('input', renderSearch);
      renderSearch();
    }
    const decodeBtn = H.utils.$('jargonDecodeBtn');
    if (decodeBtn && els.jargonDecodeInput && decodeOut) {
      decodeBtn.addEventListener('click', () => {
        decodeOut.textContent = H.jargon.decodePhrase(els.jargonDecodeInput.value);
      });
    }
  }

  function wirePhonetics(els) {
    const out = H.utils.$('phoneticOutput');
    function renderSpell() {
      if (!out || !els.phoneticInput) return;
      out.textContent = H.phonetics.spellCallsign(els.phoneticInput.value);
    }
    if (els.phoneticInput) {
      els.phoneticInput.addEventListener('input', renderSpell);
      renderSpell();
    }
  }

  function wireRepeaters(els, persist) {
    const mount = H.utils.$('repeatersMount');
    if (!mount) return;
    mount.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.classList && t.classList.contains('use-repeater')) {
        const call = t.getAttribute('data-call') || '';
        const mode = t.getAttribute('data-mode') || 'Repeater';
        els.repeaterName.value = call + ' (example)';
        if (mode === 'DMR') els.accessMethod.value = 'DMR Repeater';
        else els.accessMethod.value = 'Repeater';
        H.toasts.showToast('Filled example repeater (verify before transmitting)', 'info', 4000);
        persist();
        H.ui.updateView();
      }
    });
  }

  function wirePractice(els, persist) {
    const start = H.utils.$('btnPracticeStart');
    const next = H.utils.$('btnPracticeNext');
    const reset = H.utils.$('btnPracticeReset');
    if (start) {
      start.addEventListener('click', () => {
        H.practice.start(els, H.state.state);
        persist();
      });
    }
    if (next) {
      next.addEventListener('click', () => {
        H.practice.next(els);
      });
    }
    if (reset) {
      reset.addEventListener('click', () => {
        H.practice.reset();
      });
    }
  }

  function wirePanic(els, persist) {
    function open() {
      H.panic.openModal(els, H.state.state);
    }
    const fab = H.utils.$('fabPanic');
    const close = H.utils.$('panicCloseBtn');
    const backdrop = H.utils.$('panicModal');
    const stuck = H.utils.$('btnStuck');
    const stickyStuck = H.utils.$('stickyStuck');
    if (fab) fab.addEventListener('click', open);
    if (stuck) stuck.addEventListener('click', open);
    if (stickyStuck) stickyStuck.addEventListener('click', open);
    if (close) close.addEventListener('click', () => H.panic.closeModal());
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) H.panic.closeModal();
      });
    }
  }

  function wireNetModal(els, persist) {
    const modal = H.utils.$('netManageModal');
    const openBtn = H.utils.$('btnNetManage');
    const closeBtn = H.utils.$('btnNetManageClose');
    if (openBtn) openBtn.addEventListener('click', () => H.ui.openNetManage());
    if (closeBtn) closeBtn.addEventListener('click', () => H.ui.closeNetManage());
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) H.ui.closeNetManage();
      });
    }
  }

  function wireTimer(persist) {
    const bStart = H.utils.$('btnTimerStart');
    const bStop = H.utils.$('btnTimerStop');
    const bReset = H.utils.$('btnTimerReset');
    const bLap = H.utils.$('btnTimerLap');
    const bToggle = H.utils.$('btnTimerToggle');
    if (bStart) bStart.addEventListener('click', () => H.timer.start());
    if (bStop) bStop.addEventListener('click', () => H.timer.stop());
    if (bReset) bReset.addEventListener('click', () => H.timer.reset());
    if (bLap) bLap.addEventListener('click', () => H.timer.lap());
    if (bToggle) bToggle.addEventListener('click', () => H.timer.toggle());
  }

  function wireKeyboard(els, persist) {
    H.keyboard.register(function (e) {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        H.keyboard.toggleHelp();
      }
      const st = H.state.state;
      const inField =
        e.target &&
        (e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.tagName === 'SELECT' ||
          e.target.isContentEditable);
      if (!inField && (e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        H.ui.copyCurrentScript();
      }
      if (!inField && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        H.timer.toggle();
      }
      if (!inField && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        H.panic.openModal(els, H.state.state);
      }
      if (!inField && e.key === 'ArrowRight') {
        if (!st.flow.length) return;
        e.preventDefault();
        if (st.currentIndex < st.flow.length - 1) st.currentIndex += 1;
        if (els.customScript) els.customScript.value = '';
        H.ui.updateView();
        persist();
      }
      if (!inField && e.key === 'ArrowLeft') {
        if (!st.flow.length) return;
        e.preventDefault();
        if (st.currentIndex > 0) st.currentIndex -= 1;
        if (els.customScript) els.customScript.value = '';
        H.ui.updateView();
        persist();
      }
      if (e.key === 'Escape') {
        st.flow = [];
        st.currentIndex = 0;
        if (els.customScript) els.customScript.value = '';
        if (els.messageBody) els.messageBody.value = '';
        H.ui.updateView();
        persist();
        H.panic.closeModal();
        H.ui.closeNetManage();
        const kh = H.utils.$('keyboardHelp');
        if (kh) kh.classList.remove('open');
      }
    });
  }

  function boot() {
    const els = gatherEls();
    const persist = H.utils.debounce(function () {
      H.state.saveState(els);
    }, 400);

    H.ui.init({ els, persist });
    H.clock.startClocks();
    H.timer.tickDisplay();

    H.state.loadState(els);
    if (els.globalCallsign && els.myCallsign) {
      els.globalCallsign.value = els.myCallsign.value || '';
    }
    const adv = H.utils.$('detailsSetupAdvanced');
    if (adv) adv.open = !!H.state.state.setupAdvanced;

    H.examples.refreshOverview(els);
    H.etiquette.wireChecklist(els, H.state.state, persist);
    H.rst.wire(els);
    H.ui.setReferenceTab(H.state.state.referenceTab || 'phrases');

    H.phonetics.renderGrid(H.utils.$('phoneticGrid'));
    H.bandplan.render(H.utils.$('bandplanMount'));
    H.repeaters.render(H.utils.$('repeatersMount'));

    wireReferenceTabs();
    wireJargon(els);
    wirePhonetics(els);
    wireRepeaters(els, persist);
    wirePractice(els, persist);
    wirePanic(els, persist);
    wireNetModal(els, persist);
    wireTimer(persist);
    wireKeyboard(els, persist);

    const khClose = H.utils.$('keyboardHelpClose');
    if (khClose) khClose.addEventListener('click', () => H.keyboard.toggleHelp());
    const btnKbd = H.utils.$('btnKeyboardHelp');
    const btnFooterKbd = H.utils.$('btnFooterShortcuts');
    if (btnKbd) btnKbd.addEventListener('click', () => H.keyboard.toggleHelp());
    if (btnFooterKbd) btnFooterKbd.addEventListener('click', () => H.keyboard.toggleHelp());

    const btnTopic = H.utils.$('btnTopicAnother');
    if (btnTopic) {
      btnTopic.addEventListener('click', () => {
        H.topics.another(els, H.state.state, persist);
      });
    }

    const btnGrid = H.utils.$('btnUpdateGrid');
    if (btnGrid) {
      btnGrid.addEventListener('click', () => {
        H.clock.updateGridFromPostcode(els);
      });
    }

    const btnLarge = H.utils.$('btnLargeScript');
    if (btnLarge) {
      btnLarge.addEventListener('click', () => {
        document.body.classList.toggle('large-script');
        H.toasts.showToast(document.body.classList.contains('large-script') ? 'Larger script' : 'Normal script size', 'info', 2000);
      });
    }

    if (adv) {
      adv.addEventListener('toggle', () => {
        H.state.state.setupAdvanced = adv.open;
        persist();
      });
    }

    els.buildFlowBtn.addEventListener('click', () => H.ui.rebuild());
    els.fetchWeatherBtn.addEventListener('click', () => {
      H.weather.fetchWeatherFromPostcode(els, H.state.state, () => {
        H.ui.updateView();
        persist();
      });
    });
    els.advanceBtn.addEventListener('click', () => {
      const st = H.state.state;
      if (st.currentIndex < st.flow.length - 1) st.currentIndex += 1;
      if (els.customScript) els.customScript.value = '';
      H.ui.updateView();
      persist();
    });
    els.backBtn.addEventListener('click', () => {
      const st = H.state.state;
      if (st.currentIndex > 0) st.currentIndex -= 1;
      if (els.customScript) els.customScript.value = '';
      H.ui.updateView();
      persist();
    });
    els.resetFlowBtn.addEventListener('click', () => {
      const st = H.state.state;
      st.flow = [];
      st.currentIndex = 0;
      if (els.customScript) els.customScript.value = '';
      if (els.messageBody) els.messageBody.value = '';
      H.ui.updateView();
      persist();
    });
    if (els.customScript) {
      els.customScript.addEventListener('input', () => {
        H.ui.updateView();
        persist();
      });
    }
    if (els.messageBody) {
      els.messageBody.addEventListener('input', () => {
        H.ui.updateView();
        persist();
      });
    }
    els.copyScriptBtn.addEventListener('click', () => H.ui.copyCurrentScript());

    const stickyBack = H.utils.$('stickyBack');
    const stickyCopy = H.utils.$('stickyCopy');
    const stickyNext = H.utils.$('stickyNext');
    if (stickyBack) stickyBack.addEventListener('click', () => els.backBtn.click());
    if (stickyCopy) stickyCopy.addEventListener('click', () => H.ui.copyCurrentScript());
    if (stickyNext) stickyNext.addEventListener('click', () => els.advanceBtn.click());

    function addNetFromInputs() {
      const name = els.netMemberNameInput ? els.netMemberNameInput.value : '';
      H.ui.addNetMember(els.netMemberInput.value, name);
      els.netMemberInput.value = '';
      if (els.netMemberNameInput) els.netMemberNameInput.value = '';
    }
    els.addNetMemberBtn.addEventListener('click', () => {
      addNetFromInputs();
    });
    els.netMemberInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addNetFromInputs();
      }
    });
    if (els.netMemberNameInput) {
      els.netMemberNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          addNetFromInputs();
        }
      });
    }
    if (els.chkNetRosterMode) {
      els.chkNetRosterMode.addEventListener('change', () => {
        H.state.state.netRosterMode = !!els.chkNetRosterMode.checked;
        H.ui.updateView();
        persist();
      });
    }
    els.setMeControlBtn.addEventListener('click', () => {
      const st = H.state.state;
      const me = H.utils.normaliseCallsign(els.myCallsign.value);
      if (!me) return;
      const myName = H.utils.clean(els.operatorName && els.operatorName.value, '');
      if (!st.netMembers.some((m) => H.utils.netMemberCall(m) === me)) {
        st.netMembers.unshift({ call: me, name: myName });
      } else if (myName) {
        const row = st.netMembers.find((m) => H.utils.netMemberCall(m) === me);
        if (row && !H.utils.netMemberName(row)) row.name = myName;
      }
      st.controlHolder = me;
      if (!st.currentSpeaker) st.currentSpeaker = me;
      H.ui.updateView();
      persist();
    });
    els.rotateSpeakerBtn.addEventListener('click', () => H.ui.rotateSpeaker());
    els.clearNetMembersBtn.addEventListener('click', () => {
      const st = H.state.state;
      st.netMembers = [];
      st.currentSpeaker = null;
      st.controlHolder = null;
      H.ui.updateView();
      persist();
    });

    const debounced = H.utils.debounce(() => {
      H.examples.syncFlowToGlobal(els);
      H.examples.refreshOverview(els);
      H.ui.updateView();
      persist();
    }, 200);

    const debouncedGlobal = H.utils.debounce(() => {
      H.examples.syncGlobalToFlow(els);
      H.examples.refreshOverview(els);
      H.ui.updateView();
      persist();
    }, 200);

    if (els.globalCallsign) {
      els.globalCallsign.addEventListener('input', debouncedGlobal);
      els.globalCallsign.addEventListener('change', debouncedGlobal);
    }

    [
      els.flowType,
      els.myCallsign,
      els.otherCallsign,
      els.operatorName,
      els.qth,
      els.postcode,
      els.equipment,
      els.antenna,
      els.signalReport,
      els.accessMethod,
      els.repeaterName,
      els.extraNotes,
      els.trafficType,
      els.weatherSummary,
      els.conversationStage,
      els.timerAutoStart,
    ].forEach((element) => {
      if (!element) return;
      element.addEventListener('change', debounced);
      element.addEventListener('input', debounced);
    });

    if (els.practiceFeel) {
      els.practiceFeel.addEventListener('input', debounced);
    }

    els.postcode.addEventListener('change', () => {
      H.clock.updateGridFromPostcode(els);
    });

    H.keyboard.init();
    H.ui.updateView();
    H.clock.updateGridFromPostcode(els);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.HamApp = window.HamApp || {});
