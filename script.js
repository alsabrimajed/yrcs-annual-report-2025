/* =========================
   GLOBAL LANGUAGE
========================= */
let currentLang = localStorage.getItem("lang") || "ar";
let appData = null;

/* =========================
   STATIC TEXTS
========================= */
function updateStaticTexts() {
  document.querySelectorAll("[data-ar]").forEach(el => {
    el.textContent = el.dataset[currentLang];
  });
}

/* =========================
   LOAD DATA
========================= */
async function loadData() {
  const loadingOverlay = document.getElementById('loading-overlay');
  const errorMessage = document.getElementById('error-message');

  try {
    loadingOverlay.style.display = 'flex';

    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    appData = await response.json();

    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

    renderAll();
    loadingOverlay.style.display = 'none';
  } catch (err) {
    console.error("Error loading data.json", err);
    loadingOverlay.style.display = 'none';
    errorMessage.style.display = 'block';
  }
}

loadData();

function renderAll() {
   updateStaticTexts();

   // Prefer `sector_impact` (has icons/colors) and fall back to `sector_summary_2025`.
  renderStats(appData.stats);
  renderCharts(appData.charts);
  renderCategoryCards(appData.categories_cards);

  renderProjectsTable(appData.tables.projects);
  renderTrainingTable(appData.tables.training);

  // 🔽 التعديل هنا
   renderMinesTable(appData.tables.mines_awareness);
  renderEventsTable(appData.tables.events);
  renderMediaTable(appData.tables.media);
const sectorSource = appData.sector_impact || appData.sector_summary_2025;
renderSectorImpactTable(sectorSource);
renderSectorImpactChart(sectorSource);
renderSectorImpactCards(sectorSource);


  renderGallery(appData.gallery);
}

/* =========================
   LANGUAGE TOGGLE
========================= */
function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("lang", currentLang);

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  clearCharts();
  renderAll();
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
   CHARTS (FIXED & STABLE)
========================= */
let chartsCache = [];

function clearCharts() {
  chartsCache.forEach(c => c.destroy());
  chartsCache = [];
}

function renderCharts(charts) {
  clearCharts();

  const mapLabels = labels =>
    labels.map(l => typeof l === "object" ? l[currentLang] : l);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } }
  };

  chartsCache.push(
    new Chart(document.getElementById("categoryChart"), {
      type: "pie",
      options: commonOptions,
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
    })
  );

  chartsCache.push(
    new Chart(document.getElementById("donorChart"), {
      type: "bar",
      options: commonOptions,
      data: {
        labels: mapLabels(charts.donors.labels),
        datasets: [{
          label: currentLang === "ar" ? "المستفيدون" : "Beneficiaries",
          data: charts.donors.values,
          backgroundColor: "#3498db"
        }]
      }
    })
  );

  chartsCache.push(
    new Chart(document.getElementById("activitiesChart"), {
      type: "doughnut",
      options: commonOptions,
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
    })
  );

  chartsCache.push(
    new Chart(document.getElementById("ambulanceChart"), {
      type: "line",
      options: commonOptions,
      data: {
        labels: mapLabels(charts.ambulance_monthly.labels),
        datasets: [{
          label: currentLang === "ar" ? "حالات الإسعاف" : "Ambulance Cases",
          data: charts.ambulance_monthly.values,
          borderColor: "#e74c3c",
          tension: 0.3,
          fill: false
        }]
      }
    })
  );
}

/* =========================
   SECTOR HELPERS
========================= */
function getSectorBeneficiaries(x) {
  if (!x) return 0;
  if (x.beneficiaries !== undefined) return Number(x.beneficiaries) || 0;
  if (x.total_beneficiaries !== undefined) return Number(x.total_beneficiaries) || 0;
  const direct = Number(x.direct_beneficiaries) || 0;
  const indirect = Number(x.indirect_beneficiaries) || 0;
  return direct + indirect;
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
        <span>${cat.beneficiaries.toLocaleString()}
          ${currentLang === "ar" ? "مستفيد" : "Beneficiaries"}
        </span>
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
  if (!tbody || !training) return;

  tbody.innerHTML = "";

  training.forEach((t, i) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${i + 1}</td>
        <td>${t.name?.[currentLang] || t.name}</td>
        <td>${t.location?.[currentLang] || t.location}</td>
        <td>${t.period?.[currentLang] || t.period}</td>
        <td>${t.target?.[currentLang] || t.target}</td>
        <td>${t.donor?.[currentLang] || t.donor}</td>
        <td>${t.trainees}</td>
      </tr>
    `);
  });
}
 function renderMinesTable(items) {
  

  const tbody = document.getElementById("minesTableBody");
  if (!tbody || !items) return;

  tbody.innerHTML = "";

  items.forEach((m, i) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${i + 1}</td>
        <td>${m.month?.[currentLang] || m.month}</td>
        <td>${m.location?.[currentLang] || m.location}</td>
        <td>${m.male}</td>
        <td>${m.female}</td>
        <td>${m.total}</td>
      </tr>
    `);
  });
}

 function renderEventsTable(items) {
  

  const tbody = document.getElementById("eventsTableBody");
  if (!tbody || !items) return;

  tbody.innerHTML = "";

  items.forEach((e, i) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${i + 1}</td>
        <td>${e.name?.[currentLang] || e.name}</td>
        <td>${e.category?.[currentLang] || e.category}</td>
        <td>${e.location?.[currentLang] || e.location}</td>
        <td>${e.date}</td>
        <td>${e.donor?.[currentLang] || e.donor}</td>
        <td>${e.volunteers}</td>
      </tr>
    `);
  });
}

 function renderMediaTable(items) {
 

  const tbody = document.getElementById("mediaTableBody");
  if (!tbody || !items) return;

  tbody.innerHTML = "";

  items.forEach((m, i) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${i + 1}</td>
        <td>${m.quarter?.[currentLang] || m.quarter}</td>
        <td>${m.activity?.[currentLang] || m.activity}</td>
        <td>${m.count}</td>
        <td>${m.location?.[currentLang] || m.location}</td>
        <td>${m.beneficiaries.toLocaleString()}</td>
      </tr>
    `);
  });
}

/* =========================
   GALLERY
========================= */
 /* =========================
   GALLERY – ADVANCED LAZY LOADING
========================= */
 /* =========================
   GALLERY – YRCS LAZY LOADING
========================= */
function renderGallery(items) {
  const grid = document.querySelector(".gallery-grid");
  if (!grid || !items) return;

  grid.innerHTML = "";

  items.forEach(item => {
    const src = encodeURI(item.image);
    const caption = item.caption?.[currentLang] || item.caption;

    grid.insertAdjacentHTML("beforeend", `
      <div class="gallery-item">
        <img
          class="lazy-image"
          src="Assets/placeholder.png"
          data-src="${src}"
          alt="${caption}"
        >
        <div class="gallery-overlay">
          <span>${caption}</span>
        </div>
      </div>
    `);
  });

  initLazyLoading();
}

/* =========================
   LAZY LOADING (IntersectionObserver)
========================= */
/* =========================
========================= */
function initLazyLoading() {
  const images = document.querySelectorAll("img.lazy-image");

  if (!("IntersectionObserver" in window)) {
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add("loaded");
    });
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add("loaded");
        obs.unobserve(img);
      }
    });
  }, {
    rootMargin: "200px"
  });

  images.forEach(img => observer.observe(img));
}

/* ===============================
   Reveal on Scroll
================================ */

const revealElements = document.querySelectorAll(".category-card");

const revealOnScroll = () => {
  revealElements.forEach((el, index) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 120;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add("active");
      el.style.transitionDelay = `${index * 0.1}s`;
    }
  });
};

// Add reveal class initially
revealElements.forEach(el => el.classList.add("reveal"));

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
/* ================= TABS LOGIC ================= */

/* =========================
   TABS LOGIC (FIXED – SINGLE SOURCE)
========================= */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".tab-btn")
      .forEach(b => b.classList.remove("active"));

    document.querySelectorAll(".tab-content")
      .forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    const tab = document.getElementById(btn.dataset.tab);
    tab.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });

    // 🔥 Render sector impact ONLY when overview is visible
    if (btn.dataset.tab === "tab-overview") {
      const sectorSource = appData.sector_impact || appData.sector_summary_2025;
      renderSectorImpactCards(sectorSource);
      renderSectorImpactChart(sectorSource);
    }
  });
});

function renderSectorImpactTable(sectors) {
  const tbody = document.getElementById("sectorImpactBody");
  const totalCell = document.getElementById("sectorImpactTotal");

  if (!tbody || !sectors) return;

  tbody.innerHTML = "";
  let grandTotal = 0;
  let index = 1;

  Object.values(sectors).forEach(sector => {
    const value = getSectorBeneficiaries(sector);
    if (value > 0) {
      grandTotal += value;

      tbody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>${index++}</td>
          <td>${sector.label?.[currentLang] || ''}</td>
          <td>${value.toLocaleString()}</td>
        </tr>
      `);
    }
  });

  totalCell.textContent = grandTotal.toLocaleString();
}
function renderSectorImpactChart(sectors) {
  const ctx = document.getElementById("sectorImpactBarChart");
  if (!ctx || !sectors) return;

  const list = Object.values(sectors);
  const labels = list.map(s => (s.label && s.label[currentLang]) ? s.label[currentLang] : (s.label || ""));
  const values = list.map(s => getSectorBeneficiaries(s));
  const colors = list.map(s => s.color || '#1f4e79');

  if (window.sectorBarChart) window.sectorBarChart.destroy();

  window.sectorBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: currentLang === 'ar' ? 'عدد المستفيدين' : 'Beneficiaries',
        data: values,
        backgroundColor: colors,
        borderRadius: 10,
        barThickness: 48
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ctx.raw.toLocaleString() + ' ' + (currentLang === 'ar' ? 'مستفيد' : 'beneficiaries')
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Tajawal', size: 13 } } },
        y: { beginAtZero: true, ticks: { callback: v => v.toLocaleString(), font: { family: 'Tajawal', size: 13 } }, grid: { color: 'rgba(0,0,0,0.08)' } }
      },
      animation: { duration: 900, easing: 'easeOutQuart' }
    }
  });
}
function renderSectorImpactCards(sectors) {
    if (!sectors) return;   // 👈 add this
  const grid = document.getElementById("sectorImpactGrid");
  const ctx = document.getElementById("sectorImpactChart");
  if (!grid || !ctx) return;

  grid.innerHTML = "";

  const list = Object.values(sectors);
  const getBeneficiaries = x => {
    if (x.beneficiaries !== undefined) return Number(x.beneficiaries) || 0;
    if (x.total_beneficiaries !== undefined) return Number(x.total_beneficiaries) || 0;
    const direct = Number(x.direct_beneficiaries) || 0;
    const indirect = Number(x.indirect_beneficiaries) || 0;
    return direct + indirect;
  };

  const total = list.reduce((s, x) => s + getBeneficiaries(x), 0);

  /* ===== TOTAL CARD ===== */
  grid.insertAdjacentHTML("beforeend", `
    <div class="stat-card impact-card total-impact animate">
      <i class="fas fa-globe"></i>
      <div class="stat-number">${total.toLocaleString()}</div>
      <span>${currentLang === "ar" ? "الإجمالي الكلي" : "Total Impact"}</span>
    </div>
  `);

  const labels = [];
  const values = [];
  const colors = [];

  list.forEach(sec => {
    const b = getBeneficiaries(sec);
    const percent = total > 0 ? ((b / total) * 100).toFixed(1) : "0.0";

    labels.push(sec.label?.[currentLang] || "");
    values.push(b);
    colors.push(sec.color || '#1f4e79');

    grid.insertAdjacentHTML("beforeend", `
      <div class="stat-card impact-card animate"
           style="--accent:${sec.color}"
           title="${percent}%">
        <i class="fas ${sec.icon || 'fa-layer-group'}"></i>
        <div class="stat-number">${b.toLocaleString()}</div>
        <span>${sec.label?.[currentLang] || ''}</span>
        <small>${percent}%</small>
      </div>
    `);
  });

  /* ===== DOUGHNUT CHART ===== */
  if (window.sectorChart) window.sectorChart.destroy();

  window.sectorChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: ctx =>
              `${ctx.label}: ${ctx.raw.toLocaleString()}`
          }
        }
      }
    }
  });
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".animate").forEach(el => observer.observe(el));
