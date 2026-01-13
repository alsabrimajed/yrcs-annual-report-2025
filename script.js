document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load data.json");
      return res.json();
    })
    .then(data => {

      /* =========================
         HERO STATS (Counters)
      ========================== */
      const labelToKey = {
        "إجمالي المستفيدين": "total_beneficiaries",
        "مشروع استجابة": "projects",
        "متدرب": "trainees",
        "مستفيد توعية ألغام": "mine_awareness",
        "حالة إحالة إسعافية": "ambulance_cases",
        "مستفيد تم تعريفهم بالحركة الدولية": "movement_awareness",
        "فصول دراسية جديدة": "classrooms",
        "جهة ممولة": "donors"
      };

      document.querySelectorAll(".stat-number").forEach(el => {
        const label = el.nextElementSibling?.innerText?.trim();
        const key = labelToKey[label];
        if (!key || !data.stats) return;

        const target = Number(data.stats[key] || 0);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            el.textContent = current.toLocaleString();
          }
        }, 20);
      });

      /* =========================
         CATEGORY CARDS
      ========================== */
      const categoryContainer = document.getElementById("categoryCards");
      if (categoryContainer && Array.isArray(data.categories_cards)) {
        categoryContainer.innerHTML = "";
        data.categories_cards.forEach(cat => {
          categoryContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="category-card cat-${cat.key}">
              <div class="category-icon"><i class="fas ${cat.icon}"></i></div>
              <h4>${cat.title}</h4>
              <span class="category-count">${cat.projects} مشاريع</span>
              <span class="category-beneficiaries">${Number(cat.beneficiaries).toLocaleString()} مستفيد</span>
            </div>`
          );
        });
      }

      /* =========================
         CHARTS (Chart.js)
      ========================== */
      if (window.Chart && data.charts) {
        const c1 = document.getElementById("categoryChart");
        if (c1) {
          new Chart(c1, {
            type: "pie",
            data: {
              labels: data.charts.categories.labels,
              datasets: [{
                data: data.charts.categories.values,
                backgroundColor: ["#e74c3c", "#3498db", "#27ae60", "#9b59b6", "#f1c40f", "#e67e22"]
              }]
            }
          });
        }

        const c2 = document.getElementById("donorChart");
        if (c2) {
          new Chart(c2, {
            type: "bar",
            data: {
              labels: data.charts.donors.labels,
              datasets: [{
                label: "عدد المستفيدين",
                data: data.charts.donors.values,
                backgroundColor: "#e74c3c"
              }]
            },
            options: { responsive: true }
          });
        }

        const c3 = document.getElementById("activitiesChart");
        if (c3) {
          new Chart(c3, {
            type: "doughnut",
            data: {
              labels: data.charts.activities.labels,
              datasets: [{
                data: data.charts.activities.values,
                backgroundColor: ["#c0392b", "#2980b9", "#27ae60", "#8e44ad"]
              }]
            }
          });
        }

        const c4 = document.getElementById("ambulanceChart");
        if (c4) {
          new Chart(c4, {
            type: "line",
            data: {
              labels: data.charts.ambulance_monthly.labels,
              datasets: [{
                label: "حالات الإحالة",
                data: data.charts.ambulance_monthly.values,
                borderColor: "#e74c3c",
                fill: false,
                tension: 0.3
              }]
            }
          });
        }
      }

      /* =========================
         PROJECTS TABLE
      ========================== */
      const projectsBody = document.getElementById("projectsTableBody");
      if (projectsBody) {
        const list = data.tables?.projects || [];
        projectsBody.innerHTML = "";
        if (list.length) {
          list.forEach((p, i) => {
            projectsBody.insertAdjacentHTML(
              "beforeend",
              `<tr>
                <td>${i + 1}</td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.location}</td>
                <td>${p.period}</td>
                <td>${p.donor}</td>
                <td>${p.beneficiaries}</td>
              </tr>`
            );
          });
        } else {
          projectsBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:16px;">لا توجد بيانات</td></tr>`;
        }
      }

      /* =========================
         TRAINING & CAPACITY BUILDING
      ========================== */
      const trainingBody = document.getElementById("trainingTableBody");
      if (trainingBody) {
        const list = data.tables?.training || [];
        trainingBody.innerHTML = "";
        if (list.length) {
          list.forEach((t, i) => {
            trainingBody.insertAdjacentHTML(
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
        } else {
          trainingBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:16px;">لا توجد بيانات تدريب متاحة</td></tr>`;
        }
      }

      /* =========================
         MINES AWARENESS TABLE
      ========================== */
      const minesBody = document.getElementById("minesTableBody");
      if (minesBody) {
        const list = data.tables?.mines || [];
        minesBody.innerHTML = "";
        if (list.length) {
          list.forEach((m, i) => {
            minesBody.insertAdjacentHTML(
              "beforeend",
              `<tr>
                <td>${i + 1}</td>
                <td>${m.month}</td>
                <td>${m.location}</td>
                <td>${m.male}</td>
                <td>${m.female}</td>
                <td>${m.total}</td>
              </tr>`
            );
          });
        } else {
          minesBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:16px;">لا توجد بيانات</td></tr>`;
        }
      }

      /* =========================
         EVENTS TABLE
      ========================== */
      const eventsBody = document.getElementById("eventsTableBody");
      if (eventsBody) {
        const list = data.tables?.events || [];
        eventsBody.innerHTML = "";
        if (list.length) {
          list.forEach((e, i) => {
            eventsBody.insertAdjacentHTML(
              "beforeend",
              `<tr>
                <td>${i + 1}</td>
                <td>${e.name}</td>
                <td>${e.category}</td>
                <td>${e.location}</td>
                <td>${e.date}</td>
                <td>${e.donor}</td>
                <td>${e.volunteers}</td>
              </tr>`
            );
          });
        } else {
          eventsBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:16px;">لا توجد بيانات</td></tr>`;
        }
      }

      /* =========================
         MEDIA TABLE
      ========================== */
      const mediaBody = document.getElementById("mediaTableBody");
      if (mediaBody) {
        const list = data.tables?.media || [];
        mediaBody.innerHTML = "";
        if (list.length) {
          list.forEach((m, i) => {
            mediaBody.insertAdjacentHTML(
              "beforeend",
              `<tr>
                <td>${i + 1}</td>
                <td>${m.quarter}</td>
                <td>${m.activity}</td>
                <td>${m.count}</td>
                <td>${m.location}</td>
                <td>${m.target}</td>
                <td>${m.beneficiaries}</td>
              </tr>`
            );
          });
        } else {
          mediaBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:16px;">لا توجد بيانات</td></tr>`;
        }
      }

      /* =========================
         RFL TABLE
      ========================== */
      const rflBody = document.getElementById("rflTableBody");
      if (rflBody) {
        const list = data.tables?.rfl || [];
        rflBody.innerHTML = "";
        if (list.length) {
          list.forEach((r, i) => {
            rflBody.insertAdjacentHTML(
              "beforeend",
              `<tr>
                <td>${i + 1}</td>
                <td>${r.activity}</td>
                <td>${r.beneficiaries}</td>
              </tr>`
            );
          });
        } else {
          rflBody.innerHTML = `<tr><td colspan="3" style="text-align:center;padding:16px;">لا توجد بيانات</td></tr>`;
        }
      }

      /* =========================
         AMBULANCE TABLE
      ========================== */
      const ambulanceBody = document.getElementById("ambulanceTableBody");
      if (ambulanceBody) {
        const list = data.tables?.ambulance || [];
        ambulanceBody.innerHTML = "";
        if (list.length) {
          list.forEach(a => {
            ambulanceBody.insertAdjacentHTML(
              "beforeend",
              `<tr>
                <td>${a.month}</td>
                <td>${a.alfalaj}</td>
                <td>${a.alkassara}</td>
                <td>${a.seiyun}</td>
                <td>${a.alateer}</td>
                <td>${a.total}</td>
              </tr>`
            );
          });
        } else {
          ambulanceBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:16px;">لا توجد بيانات</td></tr>`;
        }
      }

      /* =========================
         GALLERY
      ========================== */
      const galleryGrid = document.querySelector(".gallery-grid");
      if (galleryGrid && Array.isArray(data.gallery)) {
        galleryGrid.innerHTML = "";
        data.gallery.forEach(img => {
          galleryGrid.insertAdjacentHTML(
            "beforeend",
            `<div class="gallery-item">
              <img src="${img.image}" alt="${img.caption}">
              <div class="gallery-overlay"><span>${img.caption}</span></div>
            </div>`
          );
        });
      }

      console.log("✅ data.json loaded and rendered successfully");
    })
    .catch(err => console.error("❌ Error loading data:", err));
});
