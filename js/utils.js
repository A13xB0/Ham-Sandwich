(function (H) {
  'use strict';

  H.utils = {
    /** @param {string} id */
    $(id) {
      return document.getElementById(id);
    },

    /**
     * @param {unknown} value
     * @param {string} fallback
     */
    clean(value, fallback) {
      return value && String(value).trim() ? String(value).trim() : fallback;
    },

    /**
     * @param {string[]} lines
     */
    joinLines(lines) {
      return lines.filter((line) => Boolean(line && String(line).trim())).join('\n');
    },

    /**
     * @param {number} celsius
     */
    fahrenheitFromCelsius(celsius) {
      return (celsius * 9) / 5 + 32;
    },

    /**
     * @param {string} value
     */
    normaliseCallsign(value) {
      return H.utils.clean(value, '').toUpperCase();
    },

    /**
     * @param {string|{call?: string, name?: string}} m
     */
    netMemberCall(m) {
      if (!m) return '';
      if (typeof m === 'string') return H.utils.normaliseCallsign(m);
      return H.utils.normaliseCallsign(m.call || '');
    },

    /**
     * @param {string|{call?: string, name?: string}} m
     */
    netMemberName(m) {
      if (!m || typeof m === 'string') return '';
      return H.utils.clean(m.name, '');
    },

    /**
     * @param {unknown[]} arr
     * @returns {{ call: string, name: string }[]}
     */
    normalizeNetMembersArray(arr) {
      if (!Array.isArray(arr)) return [];
      const out = [];
      const seen = new Set();
      for (const raw of arr) {
        let call = '';
        let name = '';
        if (typeof raw === 'string') {
          call = H.utils.normaliseCallsign(raw);
        } else if (raw && typeof raw === 'object') {
          call = H.utils.normaliseCallsign(raw.call || '');
          name = H.utils.clean(raw.name, '');
        }
        if (!call || seen.has(call)) continue;
        seen.add(call);
        out.push({ call, name });
      }
      return out;
    },

    /**
     * @param {{ call: string, name: string }[]} members
     */
    firstNetMemberCall(members) {
      if (!members.length) return null;
      return H.utils.netMemberCall(members[0]);
    },

    /**
     * @param {{ call: string, name: string }[]} members
     * @param {string|null} call
     */
    formatNetParticipant(members, call) {
      if (!call) return '—';
      const m = members.find((x) => H.utils.netMemberCall(x) === call);
      const nm = m ? H.utils.netMemberName(m) : '';
      return nm ? call + ' — ' + nm : call;
    },

    /**
     * @param {Function} fn
     * @param {number} waitMs
     */
    debounce(fn, waitMs) {
      let t = null;
      return function debounced() {
        const ctx = this;
        const args = arguments;
        if (t) clearTimeout(t);
        t = setTimeout(() => {
          t = null;
          fn.apply(ctx, args);
        }, waitMs);
      };
    },

    /**
     * Maidenhead grid (4 or 6 chars) from WGS84.
     * @param {number} lat
     * @param {number} lon
     * @param {4|6} [precision]
     */
    latLonToMaidenhead(lat, lon, precision) {
      const p = precision === 6 ? 6 : 4;
      const U = 'ABCDEFGHIJKLMNOPQRSTUVWX';
      let lon180 = lon + 180;
      let lat90 = lat + 90;
      const a = Math.floor(lon180 / 20);
      const b = Math.floor(lat90 / 10);
      lon180 -= a * 20;
      lat90 -= b * 10;
      const c = Math.floor(lon180 / 2);
      const d = Math.floor(lat90);
      let grid = U.charAt(a) + U.charAt(b) + String(c) + String(d);
      if (p >= 6) {
        const lonRem = lon180 - c * 2;
        const latRem = lat90 - d;
        const e = Math.min(23, Math.floor(lonRem / (2 / 24)));
        const f = Math.min(23, Math.floor(latRem / (1 / 24)));
        grid += U.charAt(e) + U.charAt(f);
      }
      return grid;
    },
  };
})(window.HamApp = window.HamApp || {});
