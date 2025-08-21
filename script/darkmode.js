document.addEventListener('click', (e) => {
  const btn = e.target.closest('#darkModeBtn');
  if (!btn) return;

  const root = document.documentElement; 
  root.classList.toggle('dark-mode');

  const isDark = root.classList.contains('dark-mode');
  try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
});

try {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
  }
} catch (e) {}