/* main.js - small global utilities (navigation toggle) */
"use strict";

function initNavToggles() {
  const t1 = document.getElementById('nav-toggle');
  const nav1 = document.getElementById('main-nav');
  if (t1 && nav1) {
    t1.addEventListener('click', () => {
      const expanded = t1.getAttribute('aria-expanded') === 'true';
      t1.setAttribute('aria-expanded', String(!expanded));
      nav1.style.display = expanded ? 'none' : 'block';
    });
  }

  const t2 = document.getElementById('nav-toggle-2');
  const nav2 = document.getElementById('main-nav-2');
  if (t2 && nav2) {
    t2.addEventListener('click', () => {
      const expanded = t2.getAttribute('aria-expanded') === 'true';
      t2.setAttribute('aria-expanded', String(!expanded));
      nav2.style.display = expanded ? 'none' : 'block';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggles();
});
