(function (H) {
  'use strict';

  const POOL = {
    net: [
      'Brief weather at your QTH.',
      'What radio and antenna are you running today?',
      'Any local events or club news?',
      'How long have you been licensed?',
      'A short positive comment about the net.',
    ],
    qso: [
      'Weekend plans or hobbies outside radio.',
      'Antenna projects or shack improvements.',
      'Propagation conditions you have noticed.',
      'A polite question about their area (landmarks, geography).',
      'How they got started in amateur radio.',
    ],
    closing: [
      'Thank them for the contact and wish them well.',
      'Offer to QSY if the frequency is busy.',
      'Mention you will be listening on this repeater/talkgroup later.',
    ],
  };

  function pick(flowType, stage, index) {
    const closing = stage === 'closing';
    const net = flowType === 'vhf_net' || flowType === 'dmr_net';
    const arr = closing ? POOL.closing : net ? POOL.net : POOL.qso;
    return arr[index % arr.length];
  }

  function show(els, st) {
    const el = H.utils.$('topicSuggestion');
    if (!el) return;
    const stage = els.conversationStage && els.conversationStage.value;
    const flowType = els.flowType && els.flowType.value;
    const t = pick(flowType, stage, st.topicIndex | 0);
    el.textContent = t;
  }

  function another(els, st, persist) {
    st.topicIndex = (st.topicIndex | 0) + 1;
    show(els, st);
    if (persist) persist();
  }

  H.topics = { pick, show, another };
})(window.HamApp = window.HamApp || {});
