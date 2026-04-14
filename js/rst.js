(function (H) {
  'use strict';

  const R_MEAN = [
    '',
    'Unreadable',
    'Barely readable',
    'Readable with difficulty',
    'Readable with practically no difficulty',
    'Perfectly readable',
  ];
  const S_MEAN = [
    '',
    'Faint',
    'Very weak',
    'Weak',
    'Fair',
    'Fairly good',
    'Good',
    'Moderately strong',
    'Strong',
    'Extremely strong',
  ];

  function describe(r, s) {
    r = Math.max(1, Math.min(5, r | 0));
    s = Math.max(1, Math.min(9, s | 0));
    return r + ' and ' + s + ' — ' + R_MEAN[r] + ', ' + S_MEAN[s] + ' signal.';
  }

  function wire(els) {
    const wrap = H.utils.$('rstPicker');
    if (!wrap || !els.signalReport) return;

    function readRs() {
      const r = parseInt(wrap.getAttribute('data-r') || '5', 10) || 5;
      const s = parseInt(wrap.getAttribute('data-s') || '9', 10) || 9;
      return { r, s };
    }

    function applyToInput() {
      const { r, s } = readRs();
      els.signalReport.value = r + ' and ' + s;
      const m = H.utils.$('rstMeaning');
      if (m) m.textContent = describe(r, s);
    }

    function parseExisting() {
      const v = (els.signalReport.value || '').trim();
      const m = v.match(/(\d)\D+(\d)/);
      if (m) {
        wrap.setAttribute('data-r', m[1]);
        wrap.setAttribute('data-s', m[2]);
      }
    }

    wrap.innerHTML = '';
    const rRow = document.createElement('div');
    rRow.className = 'rst-row';
    rRow.innerHTML = '<span class="muted">R</span> ';
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rst-btn small';
      b.textContent = String(i);
      b.addEventListener('click', () => {
        wrap.setAttribute('data-r', String(i));
        applyToInput();
      });
      rRow.appendChild(b);
    }
    const sRow = document.createElement('div');
    sRow.className = 'rst-row';
    sRow.innerHTML = '<span class="muted">S</span> ';
    for (let j = 1; j <= 9; j++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rst-btn small';
      b.textContent = String(j);
      b.addEventListener('click', () => {
        wrap.setAttribute('data-s', String(j));
        applyToInput();
      });
      sRow.appendChild(b);
    }
    wrap.appendChild(rRow);
    wrap.appendChild(sRow);

    parseExisting();
    applyToInput();

    els.signalReport.addEventListener('input', () => {
      parseExisting();
      applyToInput();
    });
  }

  H.rst = { describe, wire };
})(window.HamApp = window.HamApp || {});
