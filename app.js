/**
 * Lumina Animated Gradient Studio Controller
 * High-performance, GPU-accelerated fluid mesh animator
 */

document.addEventListener('DOMContentLoaded', () => {
  // Preset Definitions (6 Curated Harmonious Palettes)
  const PRESETS = [
    {
      id: 'cosmic',
      name: 'Cosmic Nebula',
      base: '#090a16',
      colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#6366f1', '#06b6d4'],
      accent: '#a855f7'
    },
    {
      id: 'aurora',
      name: 'Aurora Borealis',
      base: '#04121a',
      colors: ['#06b6d4', '#10b981', '#6366f1', '#8b5cf6', '#34d399'],
      accent: '#2dd4bf'
    },
    {
      id: 'sunset',
      name: 'Sunset Velvet',
      base: '#1a0714',
      colors: ['#f43f5e', '#fb923c', '#a855f7', '#e11d48', '#fbbf24'],
      accent: '#fb7185'
    },
    {
      id: 'ocean',
      name: 'Oceanic Abyss',
      base: '#021220',
      colors: ['#0ea5e9', '#14b8a6', '#0284c7', '#2dd4bf', '#1e3a8a'],
      accent: '#38bdf8'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      base: '#14051d',
      colors: ['#f43f5e', '#06b6d4', '#a855f7', '#fde047', '#ec4899'],
      accent: '#f43f5e'
    },
    {
      id: 'citrus',
      name: 'Citrus Bloom',
      base: '#1b0e04',
      colors: ['#fb923c', '#facc15', '#f43f5e', '#fb7185', '#ea580c'],
      accent: '#f59e0b'
    }
  ];

  // DOM Elements
  const root = document.documentElement;
  const appContainer = document.getElementById('app-container');
  const heroCard = document.getElementById('hero-card');
  const heroTitle = document.getElementById('hero-title');
  const swatchesContainer = document.getElementById('swatches-container');
  const codeDisplay = document.getElementById('code-display');
  const btnCopy = document.getElementById('btn-copy');
  const btnShuffle = document.getElementById('btn-shuffle');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const btnAmbient = document.getElementById('btn-ambient');
  const cursorOrb = document.getElementById('cursor-orb');
  const meshWrapper = document.getElementById('mesh-wrapper');

  // Hide / View Controls
  const btnHideHero = document.getElementById('btn-hide-hero');
  const btnShowHero = document.getElementById('btn-show-hero');
  const btnZenHeader = document.getElementById('btn-zen-header');
  const btnZenDock = document.getElementById('btn-zen-dock');
  const floatingZenExit = document.getElementById('btn-exit-zen');
  const btnFullscreenHeader = document.getElementById('btn-fullscreen-header');
  const btnFullscreenDock = document.getElementById('btn-fullscreen-dock');

  // Presets & Scroll Controls
  const presetsContainer = document.getElementById('presets-container');
  const btnScrollLeft = document.getElementById('btn-scroll-left');
  const btnScrollRight = document.getElementById('btn-scroll-right');
  const btnToggleGrid = document.getElementById('btn-toggle-grid');
  const gridBtnText = document.getElementById('grid-btn-text');

  // Tooling Controls
  const speedButtons = document.querySelectorAll('.speed-opt');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // State Management
  let currentTheme = { ...PRESETS[0] };
  let isPlaying = true;
  let ambientActive = false;
  let isZenMode = false;
  let isGridMode = false;
  let toastTimeout = null;

  // Initialize Presets
  function initPresets() {
    presetsContainer.innerHTML = '';
    PRESETS.forEach(preset => {
      const chip = document.createElement('button');
      chip.className = `preset-chip ${preset.id === currentTheme.id ? 'active' : ''}`;
      chip.setAttribute('type', 'button');
      chip.setAttribute('data-id', preset.id);

      const preview = document.createElement('span');
      preview.className = 'preset-preview';
      preview.style.background = `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`;

      const label = document.createElement('span');
      label.textContent = preset.name;

      chip.appendChild(preview);
      chip.appendChild(label);

      chip.addEventListener('click', () => {
        applyPreset(preset);
      });

      presetsContainer.appendChild(chip);
    });
  }

  // Apply Theme
  function applyTheme(theme) {
    currentTheme = { ...theme };

    // Set CSS variables
    theme.colors.forEach((color, i) => {
      root.style.setProperty(`--color-${i + 1}`, color);
    });
    root.style.setProperty('--bg-base', theme.base);
    root.style.setProperty('--accent-color', theme.accent || theme.colors[0]);

    // Update Text Content
    heroTitle.textContent = theme.name;

    // Update Swatches
    swatchesContainer.innerHTML = '';
    theme.colors.forEach(hex => {
      const chip = document.createElement('div');
      chip.className = 'swatch-chip';

      const dot = document.createElement('span');
      dot.className = 'swatch-color';
      dot.style.backgroundColor = hex;

      const code = document.createElement('span');
      code.textContent = hex.toUpperCase();

      chip.appendChild(dot);
      chip.appendChild(code);

      // Copy on click
      chip.style.cursor = 'pointer';
      chip.title = 'Click to copy color';
      chip.addEventListener('click', () => {
        navigator.clipboard.writeText(hex.toUpperCase()).then(() => {
          showToast(`Copied ${hex.toUpperCase()}!`);
        });
      });

      swatchesContainer.appendChild(chip);
    });

    // Update Code Display
    const cssSummary = `background: linear-gradient(135deg, ${theme.colors.slice(0, 3).join(', ')});`;
    codeDisplay.textContent = cssSummary;
  }

  function applyPreset(preset) {
    applyTheme(preset);

    // Update active chip state
    document.querySelectorAll('.preset-chip').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-id') === preset.id);
    });
  }

  // Generate Harmonious Random Palette
  function generateRandomPalette() {
    const baseHue = Math.floor(Math.random() * 360);
    const hues = [
      baseHue,
      (baseHue + 35) % 360,
      (baseHue + 70) % 360,
      (baseHue + 180) % 360,
      (baseHue + 215) % 360
    ];

    const colors = hues.map(h => hslToHex(h, 80 + Math.random() * 15, 55 + Math.random() * 15));
    const baseColor = hslToHex(baseHue, 40, 6);

    const adjectives = ['Ethereal', 'Prismatic', 'Velvet', 'Electric', 'Luminous', 'Astral', 'Serene', 'Vivid'];
    const nouns = ['Solstice', 'Mirage', 'Echo', 'Horizon', 'Glow', 'Cascade', 'Pulse', 'Dream'];
    const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;

    const newTheme = {
      id: 'custom-' + Date.now(),
      name: randomName,
      base: baseColor,
      colors: colors,
      accent: colors[0]
    };

    applyTheme(newTheme);

    // Deselect preset pills
    document.querySelectorAll('.preset-chip').forEach(btn => btn.classList.remove('active'));

    showToast(`Generated: ${randomName}`);
  }

  // Convert HSL to HEX helper
  function hslToHex(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  // Toast Notification
  function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // Copy Complete CSS Snippet
  function copyCssSnippet() {
    const cssCode = `/* ${currentTheme.name} Palette */
background: ${currentTheme.base};
background-image: 
  radial-gradient(at 0% 0%, ${currentTheme.colors[0]} 0px, transparent 50%),
  radial-gradient(at 100% 0%, ${currentTheme.colors[1]} 0px, transparent 50%),
  radial-gradient(at 100% 100%, ${currentTheme.colors[2]} 0px, transparent 50%),
  radial-gradient(at 0% 100%, ${currentTheme.colors[3]} 0px, transparent 50%),
  radial-gradient(at 50% 50%, ${currentTheme.colors[4]} 0px, transparent 50%);`;

    navigator.clipboard.writeText(cssCode).then(() => {
      showToast('CSS copied to clipboard!');
    }).catch(() => {
      showToast('Copied to clipboard');
    });
  }

  // Toggle Hide Center Card
  function hideCenterCard() {
    heroCard.classList.add('card-hidden');
    btnShowHero.classList.add('visible');
    showToast('Center card hidden');
  }

  function showCenterCard() {
    heroCard.classList.remove('card-hidden');
    btnShowHero.classList.remove('visible');
    showToast('Center card restored');
  }

  function toggleCenterCard() {
    if (heroCard.classList.contains('card-hidden')) {
      showCenterCard();
    } else {
      hideCenterCard();
    }
  }

  // Toggle Zen / Pure View Mode (Hide All UI)
  function toggleZenMode() {
    isZenMode = !isZenMode;
    appContainer.classList.toggle('zen-active', isZenMode);
    floatingZenExit.classList.toggle('visible', isZenMode);

    if (isZenMode) {
      showToast('Pure View: ON (Press Esc to exit)');
    } else {
      showToast('Controls restored');
    }
  }

  // Toggle Fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        showToast('Fullscreen not supported in this frame');
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Synchronize Fullscreen UI icons
  function updateFullscreenIcons() {
    const isFull = !!document.fullscreenElement;
    document.querySelectorAll('.icon-expand').forEach(el => el.style.display = isFull ? 'none' : 'inline-block');
    document.querySelectorAll('.icon-compress').forEach(el => el.style.display = isFull ? 'inline-block' : 'none');

    const titleText = isFull ? 'Exit Fullscreen' : 'Toggle Fullscreen';
    btnFullscreenHeader.title = titleText;
    btnFullscreenDock.title = titleText;
  }

  document.addEventListener('fullscreenchange', updateFullscreenIcons);

  // Toggle Presets Grid View vs Scroll View
  function toggleGridView() {
    isGridMode = !isGridMode;
    presetsContainer.classList.toggle('grid-mode', isGridMode);
    btnToggleGrid.classList.toggle('active', isGridMode);
    gridBtnText.textContent = isGridMode ? 'Scroll View' : 'Grid View';

    showToast(isGridMode ? 'Showing all palettes (Grid View)' : 'Switched to Scroll View');
  }

  // Preset Track Arrow Scrolling
  function scrollPresets(direction) {
    const amount = direction === 'left' ? -180 : 180;
    presetsContainer.scrollBy({ left: amount, behavior: 'smooth' });
  }

  // Play / Pause Animation
  function togglePlayPause() {
    isPlaying = !isPlaying;
    root.style.setProperty('--anim-state', isPlaying ? 'running' : 'paused');

    btnPlayPause.innerHTML = isPlaying
      ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`
      : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;

    btnPlayPause.title = isPlaying ? 'Pause Animation' : 'Resume Animation';
    showToast(isPlaying ? 'Animation resumed' : 'Animation paused');
  }

  // Speed Selector
  speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      speedButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const speed = btn.getAttribute('data-speed');
      let duration = '18s';
      if (speed === 'slow') duration = '32s';
      if (speed === 'fast') duration = '8s';

      root.style.setProperty('--anim-duration', duration);
      showToast(`Speed: ${speed.toUpperCase()}`);
    });
  });

  // Interactive Ambient Orb
  function toggleAmbient() {
    ambientActive = !ambientActive;
    btnAmbient.classList.toggle('active', ambientActive);
    cursorOrb.classList.toggle('active', ambientActive);

    showToast(ambientActive ? 'Interactive Light Orb: ON' : 'Interactive Light Orb: OFF');
  }

  // Pointer & Touch Move Tracking
  function handlePointerMove(e) {
    if (!ambientActive) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    if (x !== undefined && y !== undefined) {
      cursorOrb.style.left = `${x}px`;
      cursorOrb.style.top = `${y}px`;
    }
  }

  window.addEventListener('mousemove', handlePointerMove, { passive: true });
  window.addEventListener('touchmove', handlePointerMove, { passive: true });

  // Event Listeners
  btnCopy.addEventListener('click', copyCssSnippet);
  btnShuffle.addEventListener('click', generateRandomPalette);
  btnPlayPause.addEventListener('click', togglePlayPause);
  btnAmbient.addEventListener('click', toggleAmbient);

  // Center Box Visibility Listeners
  btnHideHero.addEventListener('click', hideCenterCard);
  btnShowHero.addEventListener('click', showCenterCard);

  // Pure View (Zen Mode) Listeners
  btnZenHeader.addEventListener('click', toggleZenMode);
  btnZenDock.addEventListener('click', toggleZenMode);
  floatingZenExit.addEventListener('click', toggleZenMode);

  // Fullscreen Listeners
  btnFullscreenHeader.addEventListener('click', toggleFullscreen);
  btnFullscreenDock.addEventListener('click', toggleFullscreen);

  // Preset Navigation Listeners
  btnScrollLeft.addEventListener('click', () => scrollPresets('left'));
  btnScrollRight.addEventListener('click', () => scrollPresets('right'));
  btnToggleGrid.addEventListener('click', toggleGridView);

  // Exit Zen on background click
  meshWrapper.addEventListener('click', () => {
    if (isZenMode) {
      toggleZenMode();
    }
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Escape') {
      if (isZenMode) toggleZenMode();
    } else if (e.code === 'KeyZ') {
      toggleZenMode();
    } else if (e.code === 'KeyF') {
      toggleFullscreen();
    } else if (e.code === 'KeyH') {
      toggleCenterCard();
    } else if (e.code === 'Space') {
      e.preventDefault();
      generateRandomPalette();
    } else if (e.code === 'KeyP') {
      togglePlayPause();
    } else if (e.code === 'KeyC') {
      copyCssSnippet();
    }
  });

  // Boot Application
  initPresets();
  applyPreset(PRESETS[0]);
});
