(function (H) {
  'use strict';

  /** Fictional example repeaters for UI demonstration only. */
  const EXAMPLES = [
    {
      call: 'GB3EXA',
      region: 'Exampleshire',
      out: '145.6375',
      in: '145.0375',
      offset: '-0.6 MHz',
      tone: '118.8 Hz (example)',
      mode: 'FM',
    },
    {
      call: 'GB7DMO',
      region: 'Sampleton',
      out: '439.9875',
      in: '430.3875',
      offset: '-9.6 MHz',
      tone: '94.8 Hz (example)',
      mode: 'DMR',
    },
    {
      call: 'GB3DMO',
      region: 'Fictional Fells',
      out: '145.7500',
      in: '145.1500',
      offset: '-0.6 MHz',
      tone: '110.9 Hz (example)',
      mode: 'FM',
    },
  ];

  function render(container) {
    if (!container) return;
    let html =
      '<div class="warn-banner">These are <strong>fictional example</strong> repeaters for learning the UI. For real repeater data in the UK, consult ukrepeater.net (or your repeater keeper\'s official listing).</div>';
    html += '<table class="band-table"><thead><tr><th>Call</th><th>Region</th><th>Output</th><th>Input</th><th>Offset</th><th>Tone</th><th>Mode</th><th></th></tr></thead><tbody>';
    EXAMPLES.forEach((r) => {
      html +=
        '<tr><td>' +
        r.call +
        '</td><td>' +
        r.region +
        '</td><td>' +
        r.out +
        '</td><td>' +
        r.in +
        '</td><td>' +
        r.offset +
        '</td><td>' +
        r.tone +
        '</td><td>' +
        r.mode +
        '</td><td><button type="button" class="small use-repeater" data-call="' +
        r.call +
        '" data-mode="' +
        r.mode +
        '">Use example</button></td></tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  }

  H.repeaters = { EXAMPLES, render };
})(window.HamApp = window.HamApp || {});
