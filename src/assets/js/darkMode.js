const THEME_KEY = 'theme';
const root = document.documentElement;

export function detectTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  const attr = root.getAttribute('data-bs-theme');
  if (attr === 'dark' || attr === 'light') return attr;
  if (document.body.classList.contains('dark-mode')) return 'dark';
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function applyTheme(t, btn) {
  root.setAttribute('data-bs-theme', t);              
  document.body.classList.toggle('dark-mode', t === 'dark'); 
  localStorage.setItem(THEME_KEY, t);
  if (btn) {
    const isOn = t === 'light';
    btn.setAttribute('aria-pressed', isOn);
    btn.classList.toggle('active', isOn);
  }
}

export function toggleTheme(btn) {
  const current = (
    root.getAttribute('data-bs-theme') === 'dark' ||
    document.body.classList.contains('dark-mode')
  ) ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next, btn);
}

export default function initDarkMode(btnId = 'darkToggle') {
  const btn = document.getElementById(btnId);
  if (btn) btn.addEventListener('click', () => toggleTheme(btn));
  applyTheme(detectTheme(), btn);
}