(function () {
  var KEY = 'tsf-theme';
  var root = document.documentElement;

  function current() {
    return root.getAttribute('data-theme') || 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀' : '🌙';
  }

  function toggle() { apply(current() === 'dark' ? 'light' : 'dark'); }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = current() === 'dark' ? '☀' : '🌙';
      btn.addEventListener('click', toggle);
    }
  });
})();
