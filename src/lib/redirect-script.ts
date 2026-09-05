/**
 * Inline script for the "/" page. Runs during HTML parsing, before React and
 * before the <meta http-equiv="refresh"> fallback fires, and replaces the URL.
 *
 * Priority: saved choice (localStorage "locale") > first browser language > "mn".
 * Kept as a plain string so the exact shipped code is unit-tested with fake globals.
 */
export const REDIRECT_SCRIPT = `(function () {
  var target = null;
  try {
    var saved = localStorage.getItem('locale');
    if (saved === 'mn' || saved === 'en') target = saved;
  } catch (e) {}
  if (!target) {
    var lang = '';
    try {
      lang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    } catch (e) {}
    target = /^en(-|$)/i.test(lang) ? 'en' : 'mn';
  }
  location.replace('/' + target + '/');
})();`;
