(function (H) {
  'use strict';

  let tickHandle = null;

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function renderClocks() {
    const utcEl = H.utils.$('utcClock');
    const localEl = H.utils.$('localClock');
    const now = new Date();
    if (utcEl) {
      utcEl.textContent =
        pad2(now.getUTCHours()) +
        ':' +
        pad2(now.getUTCMinutes()) +
        ':' +
        pad2(now.getUTCSeconds()) +
        ' UTC';
    }
    if (localEl) {
      localEl.textContent =
        'Local ' +
        pad2(now.getHours()) +
        ':' +
        pad2(now.getMinutes()) +
        ':' +
        pad2(now.getSeconds());
    }
  }

  function startClocks() {
    if (tickHandle) return;
    renderClocks();
    tickHandle = setInterval(renderClocks, 1000);
  }

  /**
   * @param {number} lat
   * @param {number} lon
   */
  function updateGridFromLatLon(lat, lon) {
    const el = H.utils.$('gridSquareDisplay');
    if (!el) return;
    const g = H.utils.latLonToMaidenhead(lat, lon, 6);
    el.textContent = g;
  }

  async function updateGridFromPostcode(els) {
    const pc = (els.postcode && els.postcode.value || '').trim();
    const el = H.utils.$('gridSquareDisplay');
    if (!pc) {
      if (el) el.textContent = '—';
      return;
    }
    try {
      const geoRes = await fetch(
        'https://geocoding-api.open-meteo.com/v1/search?name=' +
          encodeURIComponent(pc) +
          '&count=1&language=en&format=json'
      );
      const geo = await geoRes.json();
      const result = geo.results && geo.results[0];
      if (!result) {
        if (el) el.textContent = 'Not found';
        return;
      }
      updateGridFromLatLon(result.latitude, result.longitude);
    } catch (e) {
      if (el) el.textContent = '—';
    }
  }

  H.clock = {
    startClocks,
    updateGridFromLatLon,
    updateGridFromPostcode,
  };
})(window.HamApp = window.HamApp || {});
