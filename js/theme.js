(function () {
  var KEY = 'tsf-theme';
  var root = document.documentElement;

  function apply() {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem(KEY, 'light');
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply();
  });
})();
