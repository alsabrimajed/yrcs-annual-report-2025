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
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    appData = data;

    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

    renderAll();
  })
  .catch(err => console.error("Error loading data.json", err));

function renderAll() {
   updateStaticTexts();

  renderStats(appData.stats);
  renderCharts(appData.charts);
  renderCategoryCards(appData.categories_cards);

  renderProjectsTable(appData.tables.projects);
  renderTrainingTable(appData.tables.training);

  // 🔽 التعديل هنا
   renderMinesTable(appData.tables.mines_awareness);
  renderEventsTable(appData.tables.events);
  renderMediaTable(appData.tables.media);

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
