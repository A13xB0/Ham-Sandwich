(function (H) {
  'use strict';

  const U = H.utils;

  function isNetFlow(type) {
    return type === 'vhf_net' || type === 'dmr_net';
  }

  function equipmentSummary(context) {
    const via = context.repeater ? context.access + ' via ' + context.repeater : context.access;
    return context.equipment + ' into ' + context.antenna + (via ? ', ' + via : '');
  }

  function weatherLine(context) {
    return context.weather ? 'Weather here is ' + context.weather + '.' : '';
  }

  function getNextSpeakerAfter(members, callsign) {
    const calls = members.map((m) => U.netMemberCall(m)).filter(Boolean);
    if (!calls.length) return 'M0AAA';
    if (!callsign) return calls[0];
    const index = calls.indexOf(callsign);
    if (index === -1) return calls[0];
    return calls[(index + 1) % calls.length];
  }

  /**
   * @param {Record<string, unknown>} els
   * @param {{ call: string, name: string }[]} members
   * @param {string|null} currentSpeaker
   * @param {string|null} controlHolder
   */
  function derivedOtherCallsign(els, members, currentSpeaker, controlHolder) {
    const entered = U.clean(els.otherCallsign && els.otherCallsign.value, '');
    if (entered) return entered;
    if (isNetFlow(els.flowType && els.flowType.value)) {
      const my = U.clean(els.myCallsign && els.myCallsign.value, 'MYCALL');
      return getNextSpeakerAfter(members, currentSpeaker || controlHolder || my);
    }
    return 'OTHERCALL';
  }

  /**
   * @param {Record<string, unknown>} els
   * @param {object} st
   */
  function createContext(els, st) {
    const my = U.clean(els.myCallsign && els.myCallsign.value, 'MYCALL');
    const other = derivedOtherCallsign(els, st.netMembers, st.currentSpeaker, st.controlHolder);
    const name = U.clean(els.operatorName && els.operatorName.value, 'your name');
    const qth = U.clean(els.qth && els.qth.value, 'your location');
    const postcode = U.clean(els.postcode && els.postcode.value, '');
    const equipment = U.clean(els.equipment && els.equipment.value, 'radio');
    const antenna = U.clean(els.antenna && els.antenna.value, 'antenna');
    const report = U.clean(els.signalReport && els.signalReport.value, '5 and 9');
    const access = U.clean(els.accessMethod && els.accessMethod.value, 'Simplex');
    const repeater = U.clean(els.repeaterName && els.repeaterName.value, '');
    const extra = U.clean(els.extraNotes && els.extraNotes.value, '');
    const traffic = U.clean(els.trafficType && els.trafficType.value, 'No traffic');
    const weather = U.clean(els.weatherSummary && els.weatherSummary.value, st.weather || '');
    const stage = U.clean(els.conversationStage && els.conversationStage.value, 'opening');

    return {
      my,
      other,
      name,
      qth,
      postcode,
      equipment,
      antenna,
      report,
      access,
      repeater,
      extra,
      traffic,
      weather,
      flowType: els.flowType && els.flowType.value,
      stage,
    };
  }

  function nextStation(context, members, currentSpeaker) {
    if (context.other && context.other !== 'OTHERCALL') return context.other;
    return getNextSpeakerAfter(members, currentSpeaker || context.my);
  }

  function getReturnSnippet(context, members, currentSpeaker) {
    const next = nextStation(context, members, currentSpeaker);
    if (isNetFlow(context.flowType)) {
      if (context.stage === 'mid') return 'Back to net, ' + context.my;
      if (context.stage === 'closing') return context.my + ' going clear, 73, ' + context.my;
      return context.my + ' returning';
    }
    if (context.stage === 'mid') return 'Back to you, ' + context.my;
    if (context.stage === 'closing') return '73, ' + context.my + ' clear.';
    return next + ' this is ' + context.my + ', go ahead.';
  }

  /**
   * @param {Record<string, unknown>} els
   */
  function wrappedMessage(els, context, members, currentSpeaker) {
    const body = U.clean(els.messageBody && els.messageBody.value, '');
    const next = nextStation(context, members, currentSpeaker);
    if (!body) return getReturnSnippet(context, members, currentSpeaker);

    if (isNetFlow(context.flowType)) {
      return U.joinLines([
        context.my + ' returning,',
        body,
        'Over to ' + next + ', ' + context.my,
      ]);
    }

    return U.joinLines([
      context.other + ' ' + (context.stage === 'mid' ? 'all copied,' : 'this is ' + context.my + ','),
      body,
      'Back to you, ' + context.my,
    ]);
  }

  /**
   * @param {ReturnType<typeof createContext>} context
   * @param {typeof H.state.state} st
   */
  function buildFlow(context, st) {
    const eq = equipmentSummary(context);
    const wx = weatherLine(context);
    const notes = context.extra ? context.extra + '.' : '';
    const next = nextStation(context, st.netMembers, st.currentSpeaker);

    if (context.flowType === 'vhf_net') {
      return [
        {
          title: 'Check in',
          who: 'You',
          control: st.controlHolder || 'Net control',
          next,
          speaking: context.my,
          script: U.joinLines([context.my + ', ' + context.traffic.toLowerCase()]),
        },
        {
          title: 'Called by net control',
          who: 'You',
          control: context.my,
          next,
          speaking: context.my,
          script: U.joinLines([
            context.my + ' returning,',
            'name is ' + context.name + ',',
            'QTH ' + context.qth + ',',
            wx,
            'running ' + eq + '.',
            context.traffic === 'No traffic' ? 'nothing further to report.' : 'with traffic.',
            notes,
            'Over to ' + next + ', ' + context.my,
          ]),
        },
        {
          title: 'Mid-net return',
          who: 'You',
          control: context.my,
          next,
          speaking: context.my,
          script: U.joinLines([
            context.my + ' returning,',
            '[your message here]',
            'Back to net, ' + context.my,
          ]),
        },
        {
          title: 'Leaving the net',
          who: 'You',
          control: st.controlHolder || 'Net control',
          next: '—',
          speaking: context.my,
          script: U.joinLines([
            context.my + ' going clear,',
            'thanks for the net,',
            '73,',
            context.my,
          ]),
        },
      ];
    }

    if (context.flowType === 'dmr_net') {
      const rep = (context.repeater || '').toLowerCase();
      const viaHotspot = context.access === 'Hotspot' || rep.indexOf('hotspot') >= 0;
      return [
        {
          title: 'Check in',
          who: 'You',
          control: st.controlHolder || 'Net control',
          next,
          speaking: context.my,
          script: U.joinLines([context.my + ', ' + context.traffic.toLowerCase()]),
        },
        {
          title: 'Short DMR over',
          who: 'You',
          control: context.my,
          next,
          speaking: context.my,
          script: U.joinLines([
            context.my + ' returning,',
            context.name + ' in ' + context.qth + ',',
            context.repeater ? 'coming via ' + context.repeater + ',' : '',
            viaHotspot ? 'running via hotspot,' : '',
            context.equipment ? 'using ' + context.equipment + ',' : '',
            wx,
            'nothing further,',
            'Over to ' + next + ', ' + context.my,
          ]),
        },
        {
          title: 'Mid-net return',
          who: 'You',
          control: context.my,
          next,
          speaking: context.my,
          script: U.joinLines([
            context.my + ' returning,',
            '[your message here]',
            'Back to net, ' + context.my,
          ]),
        },
        {
          title: 'Leave',
          who: 'You',
          control: st.controlHolder || 'Net control',
          next: '—',
          speaking: context.my,
          script: U.joinLines([context.my + ' going clear, 73, ' + context.my]),
        },
      ];
    }

    if (context.flowType === 'repeater_qso') {
      return [
        {
          title: 'Open contact',
          who: 'You',
          control: context.my,
          next: context.other,
          speaking: context.my,
          script: U.joinLines([context.other + ' this is ' + context.my + ', go ahead.']),
        },
        {
          title: 'First over',
          who: 'You',
          control: context.my,
          next: context.other,
          speaking: context.my,
          script: U.joinLines([
            context.other + ' thanks for coming back,',
            "you're " + context.report + ' into ' + context.qth + ',',
            'name is ' + context.name + ',',
            'running ' + eq + '.',
            wx,
            notes,
            'Back to you, ' + context.my,
          ]),
        },
        {
          title: 'Mid-QSO return',
          who: 'You',
          control: context.my,
          next: context.other,
          speaking: context.my,
          script: U.joinLines([
            context.other + ' all copied,',
            '[your message here]',
            'Back to you, ' + context.my,
          ]),
        },
        {
          title: 'Close',
          who: 'You',
          control: context.my,
          next: '—',
          speaking: context.my,
          script: U.joinLines([
            "Right, I'll let you go.",
            'Thanks for the contact.',
            '73,',
            context.my + ' clear.',
          ]),
        },
      ];
    }

    if (context.flowType === 'simplex_qso') {
      return [
        {
          title: 'Call station',
          who: 'You',
          control: context.my,
          next: context.other,
          speaking: context.my,
          script: U.joinLines([context.other + ' this is ' + context.my + ', go ahead.']),
        },
        {
          title: 'Exchange basics',
          who: 'You',
          control: context.my,
          next: context.other,
          speaking: context.my,
          script: U.joinLines([
            context.other + ' thanks for the call,',
            'QTH is ' + context.qth + ',',
            'name is ' + context.name + ',',
            'running ' + eq + '.',
            wx,
            'Back to you, ' + context.my,
          ]),
        },
        {
          title: 'Mid-QSO return',
          who: 'You',
          control: context.my,
          next: context.other,
          speaking: context.my,
          script: U.joinLines([
            context.other + ' all copied,',
            '[your message here]',
            'Back to you, ' + context.my,
          ]),
        },
        {
          title: 'Close',
          who: 'You',
          control: context.my,
          next: '—',
          speaking: context.my,
          script: U.joinLines(['Thanks for the contact,', '73,', context.my + ' clear.']),
        },
      ];
    }

    if (context.flowType === 'dmr_qso') {
      return [
        {
          title: 'Open on talkgroup',
          who: 'You',
          control: context.my,
          next: context.other,
          speaking: context.my,
          script: U.joinLines([
            context.my +
              ' monitoring ' +
              (context.repeater || 'the talkgroup') +
              ', anyone available for a short QSO?',
          ]),
        },
        {
          title: 'First exchange',
          who: 'You',
          control: context.my,
          next: context.other,
          speaking: context.my,
          script: U.joinLines([
            context.other + ' thanks for the call,',
            "you're " + context.report + ' into ' + context.qth + ',',
            'name here is ' + context.name + ',',
            'using ' +
              context.equipment +
              (context.access === 'Hotspot'
                ? ' via hotspot'
                : context.repeater
                  ? ' via ' + context.repeater
                  : '') +
              '.',
            wx,
            'Back to you, ' + context.my,
          ]),
        },
        {
          title: 'Mid-QSO return',
          who: 'You',
          control: context.my,
          next: context.other,
          speaking: context.my,
          script: U.joinLines([
            context.other + ' all copied,',
            '[your message here]',
            'Back to you for final, ' + context.my,
          ]),
        },
        {
          title: 'Final',
          who: 'You',
          control: context.my,
          next: '—',
          speaking: context.my,
          script: U.joinLines(['Thanks for the contact, 73, ' + context.my + ' clear.']),
        },
      ];
    }

    return [
      {
        title: 'CQ call',
        who: 'You',
        control: context.my,
        next: 'Any station',
        speaking: context.my,
        script: U.joinLines(['CQ CQ, this is ' + context.my + ' calling CQ and listening.']),
      },
      {
        title: 'Reply to response',
        who: 'You',
        control: context.my,
        next: context.other,
        speaking: context.my,
        script: U.joinLines([
          context.other + ' this is ' + context.my + ', thanks for coming back.',
          'QTH ' + context.qth + ',',
          'name is ' + context.name + '.',
          wx,
          'Back to you, ' + context.my,
        ]),
      },
      {
        title: 'Mid-QSO return',
        who: 'You',
        control: context.my,
        next: context.other,
        speaking: context.my,
        script: U.joinLines([
          context.other + ' all copied,',
          '[your message here]',
          'Back to you, ' + context.my,
        ]),
      },
      {
        title: 'Close',
        who: 'You',
        control: context.my,
        next: '—',
        speaking: context.my,
        script: U.joinLines(['Thanks for the contact,', '73,', context.my + ' clear.']),
      },
    ];
  }

  H.flows = {
    isNetFlow,
    equipmentSummary,
    weatherLine,
    getNextSpeakerAfter,
    derivedOtherCallsign,
    createContext,
    nextStation,
    getReturnSnippet,
    wrappedMessage,
    buildFlow,
  };
})(window.HamApp = window.HamApp || {});
