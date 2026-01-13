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
      document.querySelectorAll(".stat-number").forEach(el => {
        const keyMap = {
          "إجمالي المستفيدين": "total_beneficiaries",
          "مشروع استجابة": "projects",
          "متدرب": "trainees",
          "مستفيد توعية ألغام": "mine_awareness",
          "حالة إحالة إسعافية": "ambulance_cases",
          "مستفيد تم تعريفهم بالحركة الدولية": "movement_awareness",
          "فصول دراسية جديدة": "classrooms",
          "جهة ممولة": "donors"
        };

        const label = el.nextElementSibling?.innerText;
        const key = keyMap[label];
        if (!key) return;

        const target = data.stats[key];
        let count = 0;
        const step = Math.max(1, Math.floor(target / 60));

        const interval = setInterval(() => {
          count += step;
          if (count >= target) {
            el.textContent = target;
            clearInterval(interval);
          } else {
            el.textContent = count;
          }
        }, 20);
      });

      /* =========================
         PROJECTS TABLE
      ========================== */
      const projectsBody = document.getElementById("projectsTableBody");
      if (projectsBody && data.tables.projects.length) {
        data.tables.projects.forEach((p, i) => {
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
      }

      /* =========================
         TRAINING TABLE
      ========================== */
      const trainingBody = document.getElementById("trainingTableBody");
      if (trainingBody && data.tables.training.length) {
        data.tables.training.forEach((t, i) => {
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
      }

      /* =========================
         MINES AWARENESS TABLE
      ========================== */
      const minesBody = document.getElementById("minesTableBody");
      if (minesBody && data.tables.mines.length) {
        data.tables.mines.forEach((m, i) => {
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
      }

      /* =========================
         EVENTS TABLE
      ========================== */
      const eventsBody = document.getElementById("eventsTableBody");
      if (eventsBody && data.tables.events.length) {
        data.tables.events.forEach((e, i) => {
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
      }

      /* =========================
         MEDIA TABLE
      ========================== */
      const mediaBody = document.getElementById("mediaTableBody");
      if (mediaBody && data.tables.media.length) {
        data.tables.media.forEach((m, i) => {
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
      }

      /* =========================
         RFL TABLE
      ========================== */
      const rflBody = document.getElementById("rflTableBody");
      if (rflBody && data.tables.rfl.length) {
        data.tables.rfl.forEach((r, i) => {
          rflBody.insertAdjacentHTML(
            "beforeend",
            `<tr>
              <td>${i + 1}</td>
              <td>${r.activity}</td>
              <td>${r.beneficiaries}</td>
            </tr>`
          );
        });
      }

      /* =========================
         AMBULANCE TABLE
      ========================== */
      const ambulanceBody = document.getElementById("ambulanceTableBody");
      if (ambulanceBody && data.tables.ambulance.length) {
        data.tables.ambulance.forEach(a => {
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
      }

      /* =========================
         GALLERY
      ========================== */
      const galleryGrid = document.querySelector(".gallery-grid");
      if (galleryGrid && data.gallery.length) {
        data.gallery.forEach(img => {
          galleryGrid.insertAdjacentHTML(
            "beforeend",
            `<div class="gallery-item">
              <img src="${img.image}" alt="${img.caption}">
              <div class="gallery-overlay">
                <span>${img.caption}</span>
              </div>
            </div>`
          );
        });
      }

      console.log("✅ data.json loaded and rendered successfully");
    })
    .catch(err => {
      console.error("❌ Error loading data:", err);
    });
});
