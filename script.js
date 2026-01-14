/* =========================
   GLOBAL LANGUAGE
========================= */
let currentLang = "ar";

/* =========================
   LOAD DATA
========================= */
let appData = null;

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    appData = data;
    renderAll();
  })
  .catch(err => console.error("Error loading data.json", err));

function renderAll() {
  renderStats(appData.stats);
  renderCharts(appData.charts);
  renderCategoryCards(appData.categories_cards);
  renderProjectsTable(appData.tables.projects);
  renderTrainingTable(appData.tables.training);
  renderGallery(appData.gallery);
}

/* =========================
   LANGUAGE TOGGLE
========================= */
function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-ar]").forEach(el => {
    el.textContent = el.dataset[currentLang];
  });

  renderAll(); // re-render content safely
}

/* =========================
   HERO STATS
========================= */
function renderStats(stats) {
  document.querySelectorAll(".stat-number").forEach(el => {
    const key = el.dataset.key;
    if (stats[key] !== undefined) {
      animateCounter(el, stats[key]);
    }
  });
}

function animateCounter(el, target) {
  let count = 0;
  const step = Math.ceil(target / 60);
  const interval = setInterval(() => {
    count += step;
    if (count >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(interval);
    } else {
      el.textContent = count.toLocaleString();
    }
  }, 20);
}

/* =========================
   CHARTS
========================= */
let chartsCache = [];

function clearCharts() {
  chartsCache.forEach(c => c.destroy());
  chartsCache = [];
}

 function renderCharts(charts) {

  const mapLabels = (labels) =>
    labels.map(l => typeof l === "object" ? l[currentLang] : l);

  /* CATEGORY PIE */
  new Chart(document.getElementById("categoryChart"), {
    type: "pie",
    data: {
      labels: mapLabels(charts.categories.labels),
      datasets: [{
        data: charts.categories.values,
        backgroundColor: [
          "#e74c3c", "#3498db", "#27ae60",
          "#9b59b6", "#f39c12", "#95a5a6"
        ]
      }]
    }
  });

  /* DONORS BAR */
  new Chart(document.getElementById("donorChart"), {
    type: "bar",
    data: {
      labels: mapLabels(charts.donors.labels),
      datasets: [{
        label: currentLang === "ar" ? "المستفيدون" : "Beneficiaries",
        data: charts.donors.values,
        backgroundColor: "#3498db"
      }]
    }
  });

  /* ACTIVITIES DOUGHNUT */
  new Chart(document.getElementById("activitiesChart"), {
    type: "doughnut",
    data: {
      labels: mapLabels(charts.activities.labels),
      datasets: [{
        data: charts.activities.values,
        backgroundColor: [
          "#e67e22", "#2ecc71",
          "#e74c3c", "#3498db"
        ]
      }]
    }
  });

  /* AMBULANCE LINE */
  new Chart(document.getElementById("ambulanceChart"), {
    type: "line",
    data: {
      labels: mapLabels(charts.ambulance_monthly.labels),
      datasets: [{
        label: currentLang === "ar"
          ? "حالات الإسعاف"
          : "Ambulance Cases",
        data: charts.ambulance_monthly.values,
        borderColor: "#e74c3c",
        fill: false,
        tension: 0.3
      }]
    }
  });
}

/* =========================
   CATEGORY CARDS
========================= */
function renderCategoryCards(categories) {
  const container = document.querySelector(".category-cards");
  container.innerHTML = "";

  categories.forEach(cat => {
    container.insertAdjacentHTML("beforeend", `
      <div class="category-card">
        <div class="category-icon"><i class="fas ${cat.icon}"></i></div>
        <h4>${cat.title?.[currentLang] || cat.title}</h4>
        <span>${cat.projects} ${currentLang === "ar" ? "مشاريع" : "Projects"}</span>
        <span>${cat.beneficiaries.toLocaleString()} ${currentLang === "ar" ? "مستفيد" : "Beneficiaries"}</span>
      </div>
    `);
  });
}

/* =========================
   PROJECTS TABLE
========================= */
function renderProjectsTable(projects) {
  const tbody = document.getElementById("projectsTableBody");
  tbody.innerHTML = "";

  projects.forEach((p, i) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${i + 1}</td>
        <td>${p.name?.[currentLang] || p.name}</td>
        <td>${p.category?.[currentLang] || p.category}</td>
        <td>${p.location?.[currentLang] || p.location}</td>
        <td>${p.period?.[currentLang] || p.period}</td>
        <td>${p.donor?.[currentLang] || p.donor}</td>
        <td>${p.beneficiaries.toLocaleString()}</td>
      </tr>
    `);
  });
}

/* =========================
   TRAINING TABLE
========================= */
function renderTrainingTable(training) {
  const tbody = document.getElementById("trainingTableBody");
  tbody.innerHTML = "";

  training.forEach((t, i) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${i + 1}</td>
        <td>${t.name}</td>
        <td>${t.location}</td>
        <td>${t.period}</td>
        <td>${t.target}</td>
        <td>${t.donor}</td>
        <td>${t.trainees}</td>
      </tr>
    `);
  });
}

/* =========================
   GALLERY (FIXED)
========================= */
function renderGallery(items) {
  const grid = document.querySelector(".gallery-grid");
  grid.innerHTML = "";

  items.forEach(item => {
    const src = encodeURI(item.image);

    grid.insertAdjacentHTML("beforeend", `
      <div class="gallery-item">
        <img src="${src}" alt="${item.caption?.[currentLang] || item.caption}" loading="lazy">
        <div class="gallery-overlay">
          <span>${item.caption?.[currentLang] || item.caption}</span>
        </div>
      </div>
    `);
  });
}
