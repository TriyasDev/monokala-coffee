(function () {
  try {
    var saved = localStorage.getItem('monokala_theme');
    var theme = saved === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }

  try {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    var hourPart = parts.find(function (p) { return p.type === 'hour'; });
    var hour = hourPart ? parseInt(hourPart.value, 10) : new Date().getHours();
    var kala = 'malam';
    if (hour >= 5 && hour < 11) kala = 'pagi';
    else if (hour >= 11 && hour < 15) kala = 'siang';
    else if (hour >= 15 && hour < 19) kala = 'sore';
    document.documentElement.dataset.kala = kala;
  } catch (e) {
    document.documentElement.dataset.kala = 'sore';
  }
})();
