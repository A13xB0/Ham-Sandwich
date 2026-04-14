(function (H) {
  'use strict';

  async function fetchWeatherFromPostcode(els, st, onDone) {
    const postcode = (els.postcode && els.postcode.value || '').trim();
    if (!postcode) {
      H.toasts.showToast('Enter a postcode first', 'error');
      return;
    }
    H.toasts.showToast('Looking up weather…', 'info', 2000);
    try {
      const geoRes = await fetch(
        'https://geocoding-api.open-meteo.com/v1/search?name=' +
          encodeURIComponent(postcode) +
          '&count=1&language=en&format=json'
      );
      const geo = await geoRes.json();
      const result = geo.results && geo.results[0];
      if (!result) throw new Error('Location not found');

      const wxRes = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=' +
          result.latitude +
          '&longitude=' +
          result.longitude +
          '&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto'
      );
      const wx = await wxRes.json();
      const current = wx.current;
      const celsius = Number(current.temperature_2m);
      const fahrenheit = H.utils.fahrenheitFromCelsius(celsius).toFixed(1);
      const wind = Number(current.wind_speed_10m).toFixed(1);
      const summary = celsius.toFixed(1) + '°C / ' + fahrenheit + '°F, wind ' + wind + ' km/h';

      st.weather = summary;
      if (els.weatherSummary) els.weatherSummary.value = summary;
      H.clock.updateGridFromLatLon(result.latitude, result.longitude);
      if (onDone) onDone();
      H.toasts.showToast('Weather updated', 'success');
    } catch (error) {
      const msg = error && error.message ? error.message : 'Unknown error';
      H.toasts.showToast('Weather lookup failed: ' + msg, 'error');
    }
  }

  H.weather = { fetchWeatherFromPostcode };
})(window.HamApp = window.HamApp || {});
