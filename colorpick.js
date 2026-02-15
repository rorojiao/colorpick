// ColorPick Shared Utilities
const CP = {
  // Show toast notification
  toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  },

  // Copy to clipboard
  async copy(text) {
    await navigator.clipboard.writeText(text);
    this.toast(`Copied ${text}`);
  },

  // HSL to RGB
  hsl2rgb(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
  },

  // RGB to HEX
  rgb2hex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  },

  // HEX to RGB
  hex2rgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  },

  // RGB to HSL
  rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  },

  // Generate harmonious palette (golden angle)
  harmonize(count = 5) {
    const base = Math.random() * 360;
    const s = 60 + Math.random() * 25;
    const l = 45 + Math.random() * 20;
    const colors = [];
    for (let i = 0; i < count; i++) {
      const h = (base + i * 137.508) % 360;
      const rgb = this.hsl2rgb(h, s, l);
      colors.push({ h: Math.round(h), s: Math.round(s), l: Math.round(l), hex: this.rgb2hex(...rgb), rgb });
    }
    return colors;
  },

  // Relative luminance
  luminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Contrast ratio
  contrast(rgb1, rgb2) {
    const l1 = this.luminance(...rgb1);
    const l2 = this.luminance(...rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  // Nav HTML
  nav(active) {
    const pages = [
      ['index.html', 'Home'], ['picker.html', 'Picker'],
      ['palette.html', 'Palette'], ['contrast.html', 'Contrast']
    ];
    return `<nav>
      <a href="index.html" class="logo">ColorPick 🎨</a>
      <ul>${pages.map(([href, name]) =>
        `<li><a href="${href}" class="${active === href ? 'active' : ''}">${name}</a></li>`
      ).join('')}</ul>
    </nav>`;
  },

  // Footer HTML
  footer() {
    return `<footer>
      <p>Love the colors? <a class="tip-link" href="https://etherscan.io/address/0xEeD903787Cb86bcCc17777E5C7d10A4c2De43823" target="_blank">Buy the artist a coffee ☕</a></p>
      <p style="margin-top:0.5rem;font-size:0.8rem">© ${new Date().getFullYear()} ColorPick — Free color tools for designers</p>
    </footer>`;
  }
};
