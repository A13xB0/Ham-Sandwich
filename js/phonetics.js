(function (H) {
  'use strict';

  const NATO = {
    A: 'Alpha',
    B: 'Bravo',
    C: 'Charlie',
    D: 'Delta',
    E: 'Echo',
    F: 'Foxtrot',
    G: 'Golf',
    H: 'Hotel',
    I: 'India',
    J: 'Juliet',
    K: 'Kilo',
    L: 'Lima',
    M: 'Mike',
    N: 'November',
    O: 'Oscar',
    P: 'Papa',
    Q: 'Quebec',
    R: 'Romeo',
    S: 'Sierra',
    T: 'Tango',
    U: 'Uniform',
    V: 'Victor',
    W: 'Whiskey',
    X: 'X-ray',
    Y: 'Yankee',
    Z: 'Zulu',
    '0': 'Zero',
    '1': 'One',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
  };

  function spellCallsign(str) {
    const s = String(str || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    const parts = [];
    for (let i = 0; i < s.length; i++) {
      const ch = s.charAt(i);
      parts.push(NATO[ch] || ch);
    }
    return parts.join(' ');
  }

  function renderGrid(container) {
    if (!container) return;
    container.innerHTML = '';
    Object.keys(NATO).forEach((k) => {
      const div = document.createElement('div');
      div.className = 'phonetic-cell';
      div.innerHTML = '<strong>' + k + '</strong> — ' + NATO[k];
      container.appendChild(div);
    });
  }

  H.phonetics = { NATO, spellCallsign, renderGrid };
})(window.HamApp = window.HamApp || {});
