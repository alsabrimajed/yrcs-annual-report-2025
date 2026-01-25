import { AppState } from "./state.js";
import { $ } from "./dom.js";
import { renderCharts } from "./charts.js";

export function renderStats() {
  document.querySelectorAll(".stat-number").forEach(el => {
    const key = el.dataset.key;
    animate(el, AppState.data.stats[key] || 0);
  });
}

function animate(el, target) {
  let n = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    n += step;
    if (n >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = n.toLocaleString();
    }
  }, 20);
}

export function renderCategories() {
  const box = $(".category-cards");
  box.innerHTML = "";

  AppState.data.categories_cards.forEach(c => {
    box.insertAdjacentHTML("beforeend", `
      <div class="category-card">
        <i class="fas ${c.icon}"></i>
        <h4>${c.title[AppState.lang]}</h4>
        <p>${c.projects} projects</p>
      </div>
    `);
  });
}

export function renderAll() {
  renderStats();
  renderCategories();
  renderCharts(AppState.data.charts, AppState.lang);
}