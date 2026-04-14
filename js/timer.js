(function (H) {
  'use strict';

  const timerState = {
    running: false,
    startedAt: null,
    elapsedMs: 0,
    raf: null,
    laps: [],
  };

  function formatMs(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  }

  function tickDisplay() {
    const el = H.utils.$('timerDisplay');
    if (!el) return;
    const now = Date.now();
    const total = timerState.running && timerState.startedAt != null
      ? timerState.elapsedMs + (now - timerState.startedAt)
      : timerState.elapsedMs;
    el.textContent = formatMs(total);
  }

  function loop() {
    tickDisplay();
    if (timerState.running) timerState.raf = requestAnimationFrame(loop);
  }

  function start() {
    if (timerState.running) return;
    timerState.running = true;
    timerState.startedAt = Date.now();
    cancelAnimationFrame(timerState.raf || 0);
    timerState.raf = requestAnimationFrame(loop);
    tickDisplay();
  }

  function stop() {
    if (!timerState.running) return;
    const now = Date.now();
    if (timerState.startedAt != null) {
      timerState.elapsedMs += now - timerState.startedAt;
    }
    timerState.running = false;
    timerState.startedAt = null;
    cancelAnimationFrame(timerState.raf || 0);
    tickDisplay();
  }

  function reset() {
    stop();
    timerState.elapsedMs = 0;
    timerState.laps = [];
    tickDisplay();
    const lapEl = H.utils.$('timerLaps');
    if (lapEl) lapEl.textContent = '';
  }

  function lap() {
    const now = Date.now();
    const total = timerState.running && timerState.startedAt != null
      ? timerState.elapsedMs + (now - timerState.startedAt)
      : timerState.elapsedMs;
    timerState.laps.push({ t: new Date().toISOString(), ms: total });
    const lapEl = H.utils.$('timerLaps');
    if (lapEl) {
      const line = document.createElement('div');
      line.textContent = formatMs(total) + ' — ' + new Date().toLocaleTimeString();
      lapEl.prepend(line);
    }
  }

  function toggle() {
    if (timerState.running) stop();
    else start();
  }

  H.timer = {
    start,
    stop,
    reset,
    lap,
    toggle,
    tickDisplay,
    formatMs,
    getState() {
      return timerState;
    },
  };
})(window.HamApp = window.HamApp || {});
