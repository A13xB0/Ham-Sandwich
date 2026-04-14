(function (H) {
  'use strict';

  const STORAGE_KEY = 'ham-radio-flow-assistant-v4';

  const state = {
    flow: [],
    currentIndex: 0,
    weather: '',
    netMembers: [],
    netRosterMode: false,
    currentSpeaker: null,
    controlHolder: null,
    timerAutoStart: false,
    checklist: {
      listen30: false,
      askInUse: false,
      courtesyBeep: false,
      ready: false,
    },
    referenceTab: 'phrases',
    setupAdvanced: false,
    jargonSearch: '',
    phoneticInput: '',
    practiceIndex: 0,
    practiceFlow: null,
    topicIndex: 0,
  };

  /** Map legacy overview tab names to reference tabs */
  function migrateOverviewTab(tab) {
    const map = {
      phrases: 'phrases',
      phonetics: 'spell',
      jargon: 'jargon',
      bandplan: 'bands',
      etiquette: 'etiquette',
      log: 'phrases',
      milestones: 'phrases',
    };
    return map[tab] || 'phrases';
  }

  function getDefaultPayload() {
    return {
      flowType: 'vhf_net',
      myCallsign: '',
      otherCallsign: '',
      operatorName: '',
      qth: '',
      postcode: '',
      equipment: '',
      antenna: '',
      signalReport: '5 and 9',
      accessMethod: 'Simplex',
      repeaterName: '',
      extraNotes: '',
      trafficType: 'No traffic',
      weatherSummary: '',
      conversationStage: 'opening',
      customScript: '',
      messageBody: '',
      netMembers: [],
      netRosterMode: false,
      currentSpeaker: null,
      controlHolder: null,
      currentIndex: 0,
      weather: '',
      timerAutoStart: false,
      checklist: { listen30: false, askInUse: false, courtesyBeep: false, ready: false },
      referenceTab: 'phrases',
      setupAdvanced: false,
      jargonSearch: '',
      phoneticInput: '',
      practiceFeel: '',
      topicIndex: 0,
    };
  }

  /**
   * @param {Record<string, unknown>} els
   */
  function collectFromDom(els) {
    return {
      flowType: els.flowType && els.flowType.value,
      myCallsign: els.myCallsign && els.myCallsign.value,
      otherCallsign: els.otherCallsign && els.otherCallsign.value,
      operatorName: els.operatorName && els.operatorName.value,
      qth: els.qth && els.qth.value,
      postcode: els.postcode && els.postcode.value,
      equipment: els.equipment && els.equipment.value,
      antenna: els.antenna && els.antenna.value,
      signalReport: els.signalReport && els.signalReport.value,
      accessMethod: els.accessMethod && els.accessMethod.value,
      repeaterName: els.repeaterName && els.repeaterName.value,
      extraNotes: els.extraNotes && els.extraNotes.value,
      trafficType: els.trafficType && els.trafficType.value,
      weatherSummary: els.weatherSummary && els.weatherSummary.value,
      conversationStage: els.conversationStage && els.conversationStage.value,
      customScript: els.customScript && els.customScript.value,
      messageBody: els.messageBody && els.messageBody.value,
      netMembers: state.netMembers,
      netRosterMode: !!state.netRosterMode,
      currentSpeaker: state.currentSpeaker,
      controlHolder: state.controlHolder,
      currentIndex: state.currentIndex,
      weather: state.weather,
      timerAutoStart: !!(els.timerAutoStart && els.timerAutoStart.checked),
      checklist: { ...state.checklist },
      referenceTab: state.referenceTab,
      setupAdvanced: state.setupAdvanced,
      jargonSearch: els.jargonSearch && els.jargonSearch.value,
      phoneticInput: els.phoneticInput && els.phoneticInput.value,
      practiceFeel: els.practiceFeel && els.practiceFeel.value,
      topicIndex: state.topicIndex,
    };
  }

  /**
   * @param {Record<string, unknown>} els
   */
  function saveState(els) {
    try {
      const payload = collectFromDom(els);
      payload.flowSnapshot = state.flow;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('saveState', e);
    }
  }

  /**
   * @param {Record<string, unknown>} els
   */
  function loadState(els) {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        raw = localStorage.getItem('ham-radio-flow-assistant-v3');
      }
      if (!raw) return;
      const p = JSON.parse(raw);
      if (els.flowType && p.flowType) els.flowType.value = p.flowType;
      if (els.myCallsign) els.myCallsign.value = p.myCallsign || '';
      if (els.otherCallsign) els.otherCallsign.value = p.otherCallsign || '';
      if (els.operatorName) els.operatorName.value = p.operatorName || '';
      if (els.qth) els.qth.value = p.qth || '';
      if (els.postcode) els.postcode.value = p.postcode || '';
      if (els.equipment) els.equipment.value = p.equipment || '';
      if (els.antenna) els.antenna.value = p.antenna || '';
      if (els.signalReport) els.signalReport.value = p.signalReport || '5 and 9';
      if (els.accessMethod) els.accessMethod.value = p.accessMethod || 'Simplex';
      if (els.repeaterName) els.repeaterName.value = p.repeaterName || '';
      if (els.extraNotes) els.extraNotes.value = p.extraNotes || '';
      if (els.trafficType) els.trafficType.value = p.trafficType || 'No traffic';
      if (els.weatherSummary) els.weatherSummary.value = p.weatherSummary || '';
      if (els.conversationStage) els.conversationStage.value = p.conversationStage || 'opening';
      if (els.customScript) els.customScript.value = p.customScript || '';
      if (els.messageBody) els.messageBody.value = p.messageBody || '';
      if (els.timerAutoStart) els.timerAutoStart.checked = !!p.timerAutoStart;
      if (els.jargonSearch && p.jargonSearch != null) els.jargonSearch.value = p.jargonSearch;
      if (els.phoneticInput && p.phoneticInput != null) els.phoneticInput.value = p.phoneticInput;
      if (els.practiceFeel && p.practiceFeel != null) els.practiceFeel.value = p.practiceFeel;
      if (els.chkNetRosterMode) els.chkNetRosterMode.checked = !!p.netRosterMode;

      state.netMembers = H.utils.normalizeNetMembersArray(Array.isArray(p.netMembers) ? p.netMembers : []);
      state.netRosterMode = typeof p.netRosterMode === 'boolean' ? p.netRosterMode : false;
      state.currentSpeaker = p.currentSpeaker || null;
      state.controlHolder = p.controlHolder || null;
      state.currentIndex = Number.isInteger(p.currentIndex) ? p.currentIndex : 0;
      state.weather = p.weather || '';
      state.checklist = Object.assign(
        { listen30: false, askInUse: false, courtesyBeep: false, ready: false },
        p.checklist || {}
      );
      if (typeof p.referenceTab === 'string') {
        state.referenceTab = p.referenceTab;
      } else if (typeof p.overviewTab === 'string') {
        state.referenceTab = migrateOverviewTab(p.overviewTab);
      } else {
        state.referenceTab = 'phrases';
      }
      state.setupAdvanced = typeof p.setupAdvanced === 'boolean' ? p.setupAdvanced : false;
      state.topicIndex = typeof p.topicIndex === 'number' ? p.topicIndex : 0;
      state.flow = Array.isArray(p.flowSnapshot) ? p.flowSnapshot : [];
    } catch (e) {
      console.error('loadState', e);
    }
  }

  H.state = {
    STORAGE_KEY,
    state,
    getDefaultPayload,
    saveState,
    loadState,
  };
})(window.HamApp = window.HamApp || {});
