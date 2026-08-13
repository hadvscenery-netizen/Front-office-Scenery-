/* Loader for the split application bundle. */
(function () {
  const parts = ["app-part-01.js","app-part-02.js","app-part-03.js","app-part-04.js","app-part-05.js","app-part-06.js","app-part-07.js","app-part-08.js","app-part-09.js"];
  parts.forEach((src) => document.write('<script src="' + src + '"><\/script>'));
}());
