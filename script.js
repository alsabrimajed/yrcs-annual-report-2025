/* =========================
   GLOBAL LANGUAGE
========================= */
let currentLang = "ar"; // change to "en" for English

/* =========================
   LOAD DATA
========================= */
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    renderStats(data.stats);
    renderCharts(data.charts);
    renderCategoryCards(data.categories_cards);
    renderProjectsTable(data.tables.projects);
    renderTrainingTable(data.tables.training);
    renderGallery(data.gallery);
  })
  .catch(err => console.error("Error loading data.json", err));

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
   CHARTS (Chart.js)
========================= */
function renderCharts(charts) {

  new Chart(document.getElementById("categoryChart"), {
    type: "pie",
    data: {
      labels: charts.categories.labels,
      datasets: [{
        data: charts.categories.values,
        backgroundColor: [
          "#e74c3c", "#3498db", "#27ae60",
          "#9b59b6", "#f39c12", "#95a5a6"
        ]
      }]
    }
  });

  new Chart(document.getElementById("donorChart"), {
    type: "bar",
    data: {
      labels: charts.donors.labels,
      datasets: [{
        label: currentLang === "ar" ? "المستفيدون" : "Beneficiaries",
        data: charts.donors.values,
        backgroundColor: "#3498db"
      }]
    }
  });

  new Chart(document.getElementById("activitiesChart"), {
    type: "doughnut",
    data: {
      labels: charts.activities.labels,
      datasets: [{
        data: charts.activities.values,
        backgroundColor: [
          "#e67e22", "#2ecc71",
          "#e74c3c", "#3498db"
        ]
      }]
    }
  });

  new Chart(document.getElementById("ambulanceChart"), {
    type: "line",
    data: {
      labels: charts.ambulance_monthly.labels,
      datasets: [{
        label: currentLang === "ar" ? "حالات الإسعاف" : "Ambulance Cases",
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
  if (!container) return;

  container.innerHTML = "";

  categories.forEach(cat => {
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="category-card">
        <div class="category-icon">
          <i class="fas ${cat.icon}"></i>
        </div>
        <h4>${cat.title}</h4>
        <span class="category-count">
          ${cat.projects} ${currentLang === "ar" ? "مشاريع" : "Projects"}
        </span>
        <span class="category-beneficiaries">
          ${cat.beneficiaries.toLocaleString()}
          ${currentLang === "ar" ? "مستفيد" : "Beneficiaries"}
        </span>
      </div>`
    );
  });
}

/* =========================
   PROJECTS TABLE
========================= */
function renderProjectsTable(projects) {
  const tbody = document.getElementById("projectsTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  projects.forEach((p, i) => {
    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${i + 1}</td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.location}</td>
        <td>${p.period}</td>
        <td>${p.donor}</td>
        <td>${p.beneficiaries.toLocaleString()}</td>
      </tr>`
    );
  });
}

/* =========================
   TRAINING TABLE
========================= */
function renderTrainingTable(training) {
  const tbody = document.getElementById("trainingTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  training.forEach((t, i) => {
    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${i + 1}</td>
        <td>${t.name}</td>
        <td>${t.location}</td>
        <td>${t.period}</td>
        <td>${t.target}</td>
        <td>${t.donor}</td>
        <td>${t.trainees}</td>
      </tr>`
    );
  });
}
function renderProjectsTable(projects) {
  const tbody = document.getElementById("projectsTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  projects.forEach((p, i) => {
    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${i + 1}</td>
        <td>${p.name[currentLang]}</td>
        <td>${p.category[currentLang]}</td>
        <td>${p.location[currentLang]}</td>
        <td>${p.period[currentLang]}</td>
        <td>${p.donor[currentLang]}</td>
        <td>${p.beneficiaries.toLocaleString()}</td>
      </tr>`
    );
  });
}

/* =========================
   GALLERY (AR / EN)
========================= */
function renderGallery(items) {
  const grid = document.querySelector(".gallery-grid");
  if (!grid) return;

  grid.innerHTML = "";

  items.forEach(item => {
    grid.insertAdjacentHTML(
      "beforeend",
      `<div class="gallery-item">
        <img src="${item.image}"
             alt="${item.caption[currentLang]}"
             loading="lazy">
        <div class="gallery-overlay">
          <span>${item.caption[currentLang]}</span>
        </div>
      </div>`
    );
  });
}
