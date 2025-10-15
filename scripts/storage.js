/* storage.js
   Handles saving/loading recipes to localStorage.
*/
"use strict";

const STORAGE_KEY = "recipeHaven_v2";

/* generate a unique id */
function generateId() {
  return `r_${Date.now().toString(36)}_${Math.floor(Math.random()*9000+1000)}`;
}

/* load recipes (returns array) */
function loadRecipes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return []; // start empty as requested
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid storage format");
    return parsed;
  } catch (e) {
    console.error("Error reading recipes from storage, resetting:", e);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

/* save recipes (array) */
function saveRecipes(arr) {
  if (!Array.isArray(arr)) throw new Error("Expected array");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}
