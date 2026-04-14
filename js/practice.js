(function (H) {
  'use strict';

  /** @type {{lines:{who:string,text:string}[], i:number}|null} */
  let session = null;

  function buildLines(flowType, ctx) {
    const my = ctx.my || 'MYCALL';
    const other = ctx.other === 'OTHERCALL' ? 'G4BBB' : ctx.other;
    const nc = 'Net control';

    if (flowType === 'vhf_net' || flowType === 'dmr_net') {
      return [
        { who: 'them', text: nc + ': This is ' + nc + ', the net is open for check-ins. Anyone with traffic or a short report?' },
        { who: 'you', text: my + ', no traffic.' },
        { who: 'them', text: nc + ': ' + my + ', go ahead with your details.' },
        {
          who: 'you',
          text:
            my +
            ' returning, name is ' +
            (ctx.name || 'Alex') +
            ', QTH ' +
            (ctx.qth || 'Anytown') +
            ', nothing further. Back to net, ' +
            my,
        },
      ];
    }
    if (flowType === 'repeater_qso' || flowType === 'simplex_qso') {
      return [
        { who: 'them', text: other + ' listening on this frequency.' },
        { who: 'you', text: other + ' this is ' + my + ', go ahead.' },
        { who: 'them', text: other + ' thanks for the call, you are 5 and 9 here. Back to you.' },
        {
          who: 'you',
          text:
            other +
            ' thanks for the report, QTH is ' +
            (ctx.qth || 'Anytown') +
            ', name is ' +
            (ctx.name || 'Alex') +
            '. Back to you, ' +
            my,
        },
      ];
    }
    if (flowType === 'dmr_qso') {
      return [
        { who: 'them', text: other + ' on the talkgroup, good evening.' },
        { who: 'you', text: other + ' this is ' + my + ', thanks for the call.' },
        { who: 'them', text: other + ' copied all, quick signal report here is 5 and 9.' },
        { who: 'you', text: 'Same here, 5 and 9. Back to you, ' + my + '.' },
      ];
    }
    return [
      { who: 'them', text: 'CQ caller: station calling CQ, I can hear you.' },
      { who: 'you', text: other + ' this is ' + my + ', thanks for coming back.' },
      { who: 'them', text: other + ' you are readable here, go ahead with your QTH.' },
      { who: 'you', text: 'QTH is ' + (ctx.qth || 'Anytown') + ', back to you, ' + my + '.' },
    ];
  }

  function start(els, st) {
    const ctx = H.flows.createContext(els, st);
    const flowType = els.flowType && els.flowType.value;
    session = { lines: buildLines(flowType, ctx), i: 0 };
    render(els);
  }

  function render(els) {
    const box = H.utils.$('practiceOutput');
    if (!box || !session) return;
    box.innerHTML = '';
    const line = session.lines[session.i];
    if (!line) {
      box.innerHTML =
        '<p class="ok">End of practice script. Jot a note in <strong>Practice reflection</strong> below if you want to capture how it went.</p>';
      return;
    }
    const div = document.createElement('div');
    div.className = 'practice-line ' + (line.who === 'them' ? 'them' : 'you');
    div.innerHTML =
      '<strong>' +
      (line.who === 'them' ? 'Other station' : 'You') +
      '</strong><div>' +
      line.text +
      '</div>';
    box.appendChild(div);
    const prog = H.utils.$('practiceProgress');
    if (prog) prog.textContent = 'Step ' + (session.i + 1) + ' / ' + session.lines.length;
  }

  function next(els) {
    if (!session) return;
    session.i += 1;
    render(els);
  }

  function reset() {
    session = null;
    const box = H.utils.$('practiceOutput');
    if (box) box.innerHTML = '<p class="muted">Press Start practice to rehearse a scripted exchange.</p>';
    const prog = H.utils.$('practiceProgress');
    if (prog) prog.textContent = '';
  }

  H.practice = { start, next, reset };
})(window.HamApp = window.HamApp || {});
