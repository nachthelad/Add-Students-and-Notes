document.addEventListener("DOMContentLoaded", function() {
  const themeSwitch = document.getElementById('themeSwitch');
  const faSun = document.querySelector('.fa-sun');
  const faMoon = document.querySelector('.fa-moon');

  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.documentElement.setAttribute('data-bs-theme', currentTheme);
  }

  themeSwitch.addEventListener('change', function() {
    if (this.checked) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      faSun.style.color = '#fff'
      faMoon.style.color = '#fff'
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
      faSun.style.color = '#000'
      faMoon.style.color = '#000'
    }
  });
});
