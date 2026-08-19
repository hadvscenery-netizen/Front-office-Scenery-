/* Load the full application as a normal script.
 *
 * The split loader previously assembled source strings and executed them with
 * eval(). Hosted CSP rules can block that path, leaving a static dashboard
 * with no click handlers. app-source.js is shipped as a regular script so
 * all tabs and forms keep their event listeners.
 */
(function () {
  const build = '20260819-csp-direct-1';
  document.write('<script src="app-source.js?v=' + build + '"><\\/script>');
}());
