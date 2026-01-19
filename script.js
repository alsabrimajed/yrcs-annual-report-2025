/* =====================================================
   GLOBAL STATE
===================================================== */
const state = {
  lang: "ar",
  data: null,
  charts: {}
};

/* =====================================================
   INIT
===================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  initTabs();
  renderAll();
});

/* =====================================================
   DATA LOADING
===================================================== */
async function loadData() {
  try {
    const res = await fetch("data.json");
    state.data = await res.json();
  } catch (err) {
    console.error("Failed to load data.json", err);
  }
}

/* =====================================================
   MAIN RENDER
===================================================== */
function renderAll() {
  renderStats();
  renderSectorImpact();   // 👈 overview loads visible, safe
  renderCategoryCards();
  renderCharts();
  renderProjectsTable();
  renderTrainingTable();
  renderMinesTable();
  renderGallery();
  applyLanguage();
}

/* =====================================================
   HERO STATS
===================================================== */
function renderStats() {
  document.querySelectorAll(".stat-number").forEach(el => {
    const key = el.dataset.key;
    if (state.data?.stats?.[key] !== undefined) {
      animateNumber(el, state.data.stats[key]);
    }
  });
}

function animateNumber(el, value) {
  let current = 0;
  const step = Math.ceil(value / 60);

  const timer = setInterval(() => {
    current += step;
    if (current >= value) {
      el.textContent = value.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = current.toLocaleString();
    }
  }, 20);
}

/* =====================================================
   SECTOR IMPACT  ✅ PATCHED
===================================================== */
function renderSectorImpact() {
  const grid = document.getElementById("sectorImpactGrid");
  const canvas = document.getElementById("sectorImpactChart");

  if (!grid || !canvas || !state.data?.sector_summary_2025) return;

  grid.innerHTML = "";

  const labels = [];
  const values = [];

  Object.values(state.data.sector_summary_2025).forEach(sector => {
    const value =
      sector.beneficiaries ??
      sector.total_beneficiaries ??
      0;

    labels.push(sector.label[state.lang]);
    values.push(value);

    const card = document.createElement("div");
    card.className = "stat-card impact-card";
    card.innerHTML = `
      <div class="stat-number">${value.toLocaleString()}</div>
      <span>${sector.label[state.lang]}</span>
    `;
    grid.appendChild(card);
  });

  // 🔥 Destroy & recreate chart safely
  if (state.charts.sectorImpact) {
    state.charts.sectorImpact.destroy();
  }

  state.charts.sectorImpact = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#e63946", "#457b9d", "#2a9d8f",
          "#f4a261", "#9b5de5"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } }
    }
  });
}

/* =====================================================
   CATEGORY CARDS
===================================================== */
function renderCategoryCards() {
  const container = document.querySelector(".category-cards");
  if (!container) return;

  container.innerHTML = "";

  state.data.categories_cards.forEach(cat => {
    const div = document.createElement("div");
    div.className = "category-card";
    div.innerHTML = `
      <div class="category-icon"><i class="fas ${cat.icon}"></i></div>
      <h4>${cat.title[state.lang]}</h4>
      <span>${cat.projects} ${state.lang === "ar" ? "مشاريع" : "Projects"}</span>
      <span class="category-beneficiaries">${cat.beneficiaries.toLocaleString()}</span>
    `;
    container.appendChild(div);
  });
}

/* =====================================================
   CHARTS
===================================================== */
function renderCharts() {
  const c = state.data.charts;

  createChart("categoryChart", "pie",
    c.categories.labels.map(l => l[state.lang]),
    c.categories.values
  );

  createChart("donorChart", "bar",
    c.donors.labels,
    c.donors.values
  );

  createChart("activitiesChart", "bar",
    c.activities.labels.map(l => l[state.lang]),
    c.activities.values
  );

  createChart("ambulanceChart", "line",
    c.ambulance_monthly.labels.map(l => l[state.lang]),
    c.ambulance_monthly.values
  );
}

function createChart(id, type, labels, data) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  if (state.charts[id]) {
    state.charts[id].destroy();
  }

  state.charts[id] = new Chart(canvas, {
    type,
    data: {
      labels,
      datasets: [{ data }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

/* =====================================================
   TABLES
===================================================== */
function renderProjectsTable() {
  const body = document.getElementById("projectsTableBody");
  if (!body) return;

  body.innerHTML = "";
  state.data.tables.projects.forEach((p, i) => {
    body.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${p.name[state.lang]}</td>
        <td>${p.category[state.lang]}</td>
        <td>${p.location[state.lang]}</td>
        <td>${p.period[state.lang]}</td>
        <td>${p.donor[state.lang]}</td>
        <td>${p.beneficiaries}</td>
      </tr>`;
  });
}

function renderTrainingTable() {
  const body = document.getElementById("trainingTableBody");
  if (!body) return;

  body.innerHTML = "";
  state.data.tables.training.forEach((t, i) => {
    body.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${t.name[state.lang]}</td>
        <td>${t.location[state.lang]}</td>
        <td>${t.period[state.lang]}</td>
        <td>${t.target[state.lang]}</td>
        <td>${t.donor[state.lang]}</td>
        <td>${t.trainees}</td>
      </tr>`;
  });
}

function renderMinesTable() {
  const body = document.getElementById("minesTableBody");
  if (!body) return;

  body.innerHTML = "";
  state.data.mines_awareness.forEach((m, i) => {
    body.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${m.month[state.lang]}</td>
        <td>${m.location[state.lang]}</td>
        <td>${m.male}</td>
        <td>${m.female}</td>
        <td>${m.total}</td>
      </tr>`;
  });
}

/* =====================================================
   GALLERY
===================================================== */
function renderGallery() {
  const grid = document.querySelector(".gallery-grid");
  if (!grid) return;

  grid.innerHTML = "";
  state.data.gallery.forEach(img => {
    grid.innerHTML += `
      <div class="gallery-item">
        <img src="${img.image}" loading="lazy">
        <div class="gallery-overlay">
          <p>${img.caption[state.lang]}</p>
        </div>
      </div>`;
  });
}

/* =====================================================
   LANGUAGE
===================================================== */
function toggleLanguage() {
  state.lang = state.lang === "ar" ? "en" : "ar";
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  renderAll();
}

function applyLanguage() {
  document.querySelectorAll("[data-ar]").forEach(el => {
    el.textContent = el.dataset[state.lang];
  });
}

/* =====================================================
   TABS  ✅ PATCHED
===================================================== */
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const tab = document.getElementById(btn.dataset.tab);
      tab.classList.add("active");

      // 🔥 CRITICAL FIX: redraw charts when visible
      if (btn.dataset.tab === "tab-overview") {
        setTimeout(renderSectorImpact, 50);
      }
    });
  });
}
