(function (H) {
  'use strict';

  const DMR_TG = [
    { tg: 'TG9', desc: 'Local cluster (example use: local rag-chew)' },
    { tg: 'TG80', desc: 'UK wide (example branding; verify on your network)' },
    { tg: 'TG91', desc: 'UK talkgroup (commonly referenced example)' },
    { tg: 'TG235', desc: 'UK wide cluster (example)' },
    { tg: 'TG9990', desc: 'Echo / parrot test (commonly referenced example)' },
  ];

  const BANDS = [
    {
      id: '6m',
      name: '6m',
      summary: '50–52 MHz (region-dependent; UK Full typical allocation summary)',
      segments: [
        {
          label: 'All-mode / weak signal (typical)',
          freq: '50.000–50.290 MHz',
          use: 'CW, SSB, beacons (sub-bands vary)',
          notes: 'Sporadic-E openings. Confirm sub-bands for your licence class.',
        },
        {
          label: 'FM simplex / calling (example)',
          freq: '50.110 MHz (example calling)',
          use: 'FM calling (verify locally)',
          notes: 'Not all regions use the same calling frequency.',
        },
      ],
    },
    {
      id: '2m',
      name: '2m',
      summary: '144–146 MHz (UK amateur allocation summary)',
      segments: [
        {
          label: 'CW / weak-signal (typical)',
          freq: '144.000–144.150 MHz',
          use: 'CW, EME, weak signal',
          notes: 'Keep power and bandwidth appropriate; check band plan detail.',
        },
        {
          label: 'SSB calling (example)',
          freq: '144.300 MHz',
          use: 'SSB calling frequency (weak signal)',
          notes: 'Listen first; move off calling for long QSOs.',
        },
        {
          label: 'FM simplex segment (summary)',
          freq: '145.200–145.59375 MHz',
          use: 'FM simplex channels (12.5 kHz steps typical)',
          notes: 'Many channels; verify local use before calling.',
        },
        {
          label: 'National FM calling (example)',
          freq: '145.500 MHz',
          use: 'FM calling / simplex',
          notes: 'Listen first; ask if frequency is in use.',
        },
        {
          label: 'Repeater inputs (typical UK offset narrative)',
          freq: '145.000–145.1875 MHz',
          use: 'Repeater inputs (often −600 kHz offset from output)',
          notes: 'Each repeater has keeper-defined access tone and rules.',
        },
        {
          label: 'Repeater outputs (typical)',
          freq: '145.600–145.7875 MHz',
          use: 'Repeater outputs',
          notes: 'Program CTCSS per machine; wrong tone = no access or wrong machine.',
        },
      ],
    },
    {
      id: '70cm',
      name: '70cm',
      summary: '430–440 MHz (UK amateur allocation summary)',
      segments: [
        {
          label: 'FM simplex / channels (summary)',
          freq: '430–431 MHz (typical FM simplex narrative)',
          use: 'FM simplex and data (sub-bands vary)',
          notes: 'Check detailed UK band plan for your licence.',
        },
        {
          label: 'FM calling (example)',
          freq: '433.500 MHz',
          use: 'Common FM calling example',
          notes: 'Listen first; local practice may differ.',
        },
        {
          label: 'Repeater pairs (narrative)',
          freq: 'Offset per repeater',
          use: 'Repeater access',
          notes: 'Offset, tone, and access are repeater-specific — look up before TX.',
        },
      ],
    },
    {
      id: '23cm',
      name: '23cm',
      summary: '1240–1325 MHz (summary; sub-bands vary by licence)',
      segments: [
        {
          label: 'ATV / data / weak signal',
          freq: '1240–1325 MHz (sub-bands)',
          use: 'ATV, data links, weak signal',
          notes: 'High directive gain common; confirm power and bandwidth limits.',
        },
        {
          label: 'FM / repeater (where allocated)',
          freq: 'Per local coordination',
          use: 'FM voice / repeaters where available',
          notes: 'Very licence-segment dependent — verify before transmitting.',
        },
      ],
    },
  ];

  function dmrTableHTML() {
    let html =
      '<table class="band-table"><thead><tr><th>TG</th><th>Description (examples)</th></tr></thead><tbody>';
    DMR_TG.forEach((t) => {
      html += '<tr><td>' + t.tg + '</td><td>' + t.desc + '</td></tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  function bandTableHTML(band) {
    let html =
      '<p class="band-summary"><strong>' +
      band.name +
      '</strong> — ' +
      band.summary +
      '</p>' +
      '<table class="band-table"><thead><tr><th>Segment</th><th>Frequency</th><th>Typical use</th><th>Notes</th></tr></thead><tbody>';
    band.segments.forEach((s) => {
      html +=
        '<tr><td>' +
        s.label +
        '</td><td>' +
        s.freq +
        '</td><td>' +
        s.use +
        '</td><td>' +
        s.notes +
        '</td></tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  function applySelection(container) {
    const sel = container.querySelector('#bandPlanBand');
    const mount = container.querySelector('#bandplanDetail');
    if (!sel || !mount) return;
    const v = sel.value;
    if (!v || v === '') {
      mount.innerHTML = '<p class="muted">Select a band or DMR talkgroups to see the table.</p>';
      return;
    }
    if (v === 'dmr') {
      mount.innerHTML = '<h4 class="band-dmr-title">DMR talkgroups (examples)</h4>' + dmrTableHTML();
      return;
    }
    const band = BANDS.find((b) => b.id === v);
    if (!band) {
      mount.innerHTML = '<p class="muted">Unknown selection.</p>';
      return;
    }
    mount.innerHTML = bandTableHTML(band);
  }

  function render(container) {
    if (!container) return;
    let opts =
      '<option value="">Select a band…</option>' +
      BANDS.map((b) => '<option value="' + b.id + '">' + b.name + '</option>').join('') +
      '<option value="dmr">DMR talkgroups</option>';
    container.innerHTML =
      '<p class="muted band-disclaimer">Educational summary only. Always verify current Ofcom conditions and RSGB guidance before operating.</p>' +
      '<div class="bandplan-toolbar">' +
      '<label for="bandPlanBand" class="muted">Band</label>' +
      '<select id="bandPlanBand">' +
      opts +
      '</select></div>' +
      '<div id="bandplanDetail" class="bandplan-detail"></div>';

    const sel = container.querySelector('#bandPlanBand');
    if (sel) {
      sel.addEventListener('change', () => applySelection(container));
    }
    applySelection(container);
  }

  H.bandplan = { BANDS, DMR_TG, render };
})(window.HamApp = window.HamApp || {});
