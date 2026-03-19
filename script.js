/**
 * RollForward — Accessibility JavaScript
 * Handles: text size, high contrast, dyslexia mode, reduced motion,
 * mobile nav, keyboard nav, and live region announcements.
 * All preferences are persisted in localStorage.
 */

(function () {
  'use strict';

  /* ── ANNOUNCER (WCAG 4.1.3 live regions) ── */
  const announcer = document.getElementById('a11y-announcer');

  function announce(message) {
    if (!announcer) return;
    announcer.textContent = '';
    // Force re-announcement by clearing then setting
    requestAnimationFrame(() => {
      announcer.textContent = message;
    });
  }

  /* ── TEXT SIZE ── */
  const TEXT_SIZES = [0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5];
  const TEXT_LABELS = ['75%', '87.5%', '100% (default)', '112.5%', '125%', '137.5%', '150%'];
  let currentSizeIndex = 2; // default = 1rem = index 2

  function applyTextSize(index) {
    const size = TEXT_SIZES[index];
    document.documentElement.style.setProperty('--text-base', size + 'rem');
    // Scale all derived sizes proportionally
    document.documentElement.style.fontSize = size + 'rem';
    localStorage.setItem('rf-text-size', index);
    announce('Text size set to ' + TEXT_LABELS[index]);
  }

  document.getElementById('btn-text-increase').addEventListener('click', function () {
    if (currentSizeIndex < TEXT_SIZES.length - 1) {
      currentSizeIndex++;
      applyTextSize(currentSizeIndex);
    } else {
      announce('Text size is already at maximum');
    }
  });

  document.getElementById('btn-text-decrease').addEventListener('click', function () {
    if (currentSizeIndex > 0) {
      currentSizeIndex--;
      applyTextSize(currentSizeIndex);
    } else {
      announce('Text size is already at minimum');
    }
  });

  document.getElementById('btn-text-reset').addEventListener('click', function () {
    currentSizeIndex = 2;
    applyTextSize(currentSizeIndex);
  });

  /* ── HIGH CONTRAST ── */
  let highContrast = false;

  document.getElementById('btn-high-contrast').addEventListener('click', function () {
    highContrast = !highContrast;
    document.documentElement.setAttribute('data-high-contrast', highContrast);
    this.setAttribute('aria-pressed', highContrast);
    localStorage.setItem('rf-high-contrast', highContrast);
    announce(highContrast ? 'High contrast mode enabled' : 'High contrast mode disabled');
  });

  /* ── DYSLEXIA FONT ── */
  let dyslexiaMode = false;

  document.getElementById('btn-dyslexia').addEventListener('click', function () {
    dyslexiaMode = !dyslexiaMode;
    document.documentElement.setAttribute('data-dyslexia', dyslexiaMode);
    this.setAttribute('aria-pressed', dyslexiaMode);
    localStorage.setItem('rf-dyslexia', dyslexiaMode);
    announce(dyslexiaMode ? 'Dyslexia-friendly font enabled' : 'Standard font restored');
  });

  /* ── REDUCE MOTION ── */
  let reduceMotion = false;

  // Respect OS-level preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reduceMotion = true;
    document.documentElement.setAttribute('data-reduce-motion', true);
    document.getElementById('btn-reduce-motion').setAttribute('aria-pressed', true);
  }

  document.getElementById('btn-reduce-motion').addEventListener('click', function () {
    reduceMotion = !reduceMotion;
    document.documentElement.setAttribute('data-reduce-motion', reduceMotion);
    this.setAttribute('aria-pressed', reduceMotion);
    localStorage.setItem('rf-reduce-motion', reduceMotion);
    announce(reduceMotion ? 'Animations reduced' : 'Animations restored');
  });

  /* ── RESTORE SAVED PREFERENCES ── */
  (function restorePreferences() {
    const savedSize = localStorage.getItem('rf-text-size');
    if (savedSize !== null) {
      currentSizeIndex = parseInt(savedSize, 10);
      applyTextSize(currentSizeIndex);
    }

    if (localStorage.getItem('rf-high-contrast') === 'true') {
      highContrast = true;
      document.documentElement.setAttribute('data-high-contrast', true);
      document.getElementById('btn-high-contrast').setAttribute('aria-pressed', true);
    }

    if (localStorage.getItem('rf-dyslexia') === 'true') {
      dyslexiaMode = true;
      document.documentElement.setAttribute('data-dyslexia', true);
      document.getElementById('btn-dyslexia').setAttribute('aria-pressed', true);
    }

    if (localStorage.getItem('rf-reduce-motion') === 'true') {
      reduceMotion = true;
      document.documentElement.setAttribute('data-reduce-motion', true);
      document.getElementById('btn-reduce-motion').setAttribute('aria-pressed', true);
    }
  })();

  /* ── MOBILE NAVIGATION ── */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('is-open');
    this.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      // Focus first nav link
      const firstLink = navMenu.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }
  });

  // Close nav when a link is activated
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  // Close nav when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.main-nav') && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── SMOOTH SCROLL FOR IN-PAGE LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Move focus to target for screen readers
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    });
  });

  /* ── ACTIVE NAV LINK on scroll (WCAG 2.4.8 location awareness) ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.setAttribute('aria-current', 'true');
            }
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ── KEYBOARD TRAP PREVENTION ── */
  // Ensure all cards can be focused via keyboard
  document.querySelectorAll('.type-card, .a11y-card, .resource-card').forEach(function (card) {
    // Cards themselves don't need tabindex; their internal links/buttons handle focus
    // But we ensure no trap exists
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const focusable = document.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex="0"]'
        );
        const arr = Array.from(focusable);
        const idx = arr.indexOf(document.activeElement);
        if (idx > 0) arr[idx - 1].focus();
      }
    });
  });

  /* ── TABLE KEYBOARD NAVIGATION ── */
  const keyboardTable = document.querySelector('.keyboard-table');
  if (keyboardTable) {
    const rows = keyboardTable.querySelectorAll('tbody tr');
    rows.forEach(function (row) {
      row.setAttribute('tabindex', '0');
      row.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = this.nextElementSibling;
          if (next) next.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = this.previousElementSibling;
          if (prev) prev.focus();
        }
      });
    });
  }

})();