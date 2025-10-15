/* recipes.js
   Renders simple recipe cards and handles form submission + favorites.
   All HTML built using template literals.
*/
"use strict";

/* escape to avoid injection */
function escapeHtml(s) {
  if (!s) return "";
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}

/* Build simple card HTML (title, description, category, prepTime, favorite) */
function buildCardHtml(recipe) {
  return `
    <article id="${recipe.id}" class="card" aria-labelledby="h_${recipe.id}">
      <h3 id="h_${recipe.id}">${escapeHtml(recipe.title)}</h3>
      <p class="muted">${escapeHtml(recipe.category)} • ${recipe.prepTime ? recipe.prepTime + ' min' : '—'}</p>
      <p>${escapeHtml(recipe.description)}</p>
      <div class="card-actions">
        <button data-id="${recipe.id}" class="fav-btn">${recipe.favorite ? '★ Favorite' : '☆ Save'}</button>
        <button data-id="${recipe.id}" class="view-btn">View</button>
      </div>
    </article>
  `;
}

/* Render recipes grid (with optional filters) */
function renderRecipes(filter = { query: '', category: 'all' }) {
  const grid = document.getElementById('recipes-grid');
  const noResults = document.getElementById('no-results');
  if (!grid) return;
  let arr = loadRecipes();

  // filter by category
  if (filter.category && filter.category !== 'all') {
    arr = arr.filter(r => r.category === filter.category);
  }

  // filter by query (title or description)
  const q = (filter.query || '').trim().toLowerCase();
  if (q) {
    arr = arr.filter(r => {
      return r.title.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q);
    });
  }

  if (arr.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.hidden = false;
    return;
  } else if (noResults) {
    noResults.hidden = true;
  }

  grid.innerHTML = arr.map(buildCardHtml).join('');
  attachCardHandlers(grid);
}

/* Render favorites grid */
function renderFavorites() {
  const grid = document.getElementById('favorites-grid');
  const noFav = document.getElementById('no-favorites');
  if (!grid) return;
  const arr = loadRecipes().filter(r => r.favorite);
  if (arr.length === 0) {
    grid.innerHTML = '';
    if (noFav) noFav.hidden = false;
    return;
  } else if (noFav) {
    noFav.hidden = true;
  }
  grid.innerHTML = arr.map(buildCardHtml).join('');
  attachCardHandlers(grid);
}

/* Attach fav & view handlers for cards in container */
function attachCardHandlers(container) {
  container.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      toggleFavorite(id);
      // re-render lists that might be visible
      renderRecipes(getCurrentFilters());
      renderFavorites();
    });
  });

  container.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      showRecipeDialog(id);
    });
  });
}

/* Toggle favorite flag */
function toggleFavorite(id) {
  const arr = loadRecipes();
  const idx = arr.findIndex(r => r.id === id);
  if (idx === -1) return;
  arr[idx].favorite = !arr[idx].favorite;
  saveRecipes(arr);
}

/* Show a simple dialog with details */
function showRecipeDialog(id) {
  const r = loadRecipes().find(x => x.id === id);
  if (!r) return;
  const html = `
    <div role="dialog" aria-modal="true" class="dialog" aria-label="${escapeHtml(r.title)}">
      <h3>${escapeHtml(r.title)}</h3>
      <p><strong>Category:</strong> ${escapeHtml(r.category)} • ${r.prepTime ? r.prepTime + ' min' : '—'}</p>
      <p>${escapeHtml(r.description)}</p>
      <p><button id="close-dialog" class="btn ghost">Close</button></p>
    </div>
  `;
  const backdrop = document.createElement('div');
  backdrop.className = 'dialog-backdrop';
  backdrop.innerHTML = html;
  document.body.appendChild(backdrop);
  const close = document.getElementById('close-dialog');
  if (close) {
    close.focus();
    close.addEventListener('click', () => { backdrop.remove(); });
  }
}

/* Form handling (submit.html) */
function initSubmitForm() {
  const form = document.getElementById('recipe-form');
  if (!form) return;
  const msg = document.getElementById('form-message');
  const resetBtn = document.getElementById('reset-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const title = (fd.get('title') || '').toString().trim();
    const category = (fd.get('category') || '').toString();
    const description = (fd.get('description') || '').toString().trim();
    const prepTime = parseInt(fd.get('prepTime') || 0, 10);

    // validation (conditional branching)
    if (!title || !category || !description) {
      msg.textContent = 'Please complete required fields.';
      msg.style.color = 'crimson';
      return;
    }

    const newRecipe = {
      id: generateIdForRecipes(),
      title,
      category,
      description,
      prepTime: isNaN(prepTime) ? 0 : prepTime,
      favorite: false
    };

    const arr = loadRecipes();
    arr.unshift(newRecipe); // add to front
    saveRecipes(arr);

    msg.textContent = `Saved "${title}" — redirecting to Recipes...`;
    msg.style.color = 'green';

    setTimeout(() => { window.location.href = 'recipes.html'; }, 800);
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    msg.textContent = 'Form reset.';
    msg.style.color = 'var(--muted)';
  });
}

/* helper matches storage.generateId (but in this file to avoid cross-file private dependence) */
function generateIdForRecipes() {
  return `r_${Date.now().toString(36)}_${Math.floor(Math.random()*9000+1000)}`;
}

/* Filters init for recipes page */
function initFilters() {
  const search = document.getElementById('search');
  const category = document.getElementById('category');
  const clear = document.getElementById('clear-filters');
  if (!search || !category) return;

  const doFilter = () => {
    renderRecipes({ query: search.value, category: category.value });
  };

  search.addEventListener('input', debounce(doFilter, 200));
  category.addEventListener('change', doFilter);
  clear.addEventListener('click', () => {
    search.value = '';
    category.value = 'all';
    renderRecipes({ query: '', category: 'all' });
  });
}

/* small debounce */
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* get current filters (helper) */
function getCurrentFilters() {
  const search = document.getElementById('search');
  const category = document.getElementById('category');
  return { query: search ? search.value : '', category: category ? category.value : 'all' };
}

/* init on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  renderRecipes({ query: '', category: 'all' });
  renderFavorites();
  initFilters();
  initSubmitForm();
});
