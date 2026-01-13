/* =====================================================
   Load data.json
===================================================== */
fetch('data.json')
  .then(res => res.json())
  .then(data => {

    /* =====================================================
       HERO STATS (Counters)
    ===================================================== */
    document.querySelectorAll('.stat-number').forEach(el => {
      const key = el.dataset.key;
      const target = data.stats[key];
      if (target === undefined) return;

      let current = 0;
      const step = Math.max(1, target / 120);

      const update = () => {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current).toLocaleString('ar-EG');
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString('ar-EG');
        }
      };
      update();
    });

    /* =====================================================
       TOTAL BADGES (optional dynamic totals)
    ===================================================== */
    document.querySelectorAll('.total-badge[data-key]').forEach(el => {
      const key = el.dataset.key;
      if (data.stats[key] !== undefined) {
        el.textContent = data.stats[key].toLocaleString('ar-EG');
      }
    });

    /* =====================================================
       CHARTS (Chart.js)
    ===================================================== */
    Chart.defaults.font.family = 'Tajawal';
    Chart.defaults.color = '#333';

    // Category Chart
    new Chart(categoryChart, {
      type: 'pie',
      data: {
        labels: data.charts.categories.labels,
        datasets: [{
          data: data.charts.categories.values,
          backgroundColor: ['#b11226','#1f4e79','#2ecc71','#8e44ad','#f39c12','#7f8c8d']
        }]
      },
      options: { plugins: { legend: { position: 'bottom' } } }
    });

    // Donor Chart
    new Chart(donorChart, {
      type: 'bar',
      data: {
        labels: data.charts.donors.labels,
        datasets: [{
          label: 'عدد المستفيدين',
          data: data.charts.donors.values,
          backgroundColor: '#1f4e79'
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });

    // Activities Chart
    new Chart(activitiesChart, {
      type: 'doughnut',
      data: {
        labels: data.charts.activities.labels,
        datasets: [{
          data: data.charts.activities.values,
          backgroundColor: ['#e74c3c','#3498db','#27ae60','#9b59b6']
        }]
      },
      options: { plugins: { legend: { position: 'bottom' } } }
    });

    // Ambulance Monthly Chart
    new Chart(ambulanceChart, {
      type: 'line',
      data: {
        labels: data.charts.ambulance_monthly.labels,
        datasets: [{
          label: 'حالات الإحالة',
          data: data.charts.ambulance_monthly.values,
          borderColor: '#b11226',
          backgroundColor: 'rgba(177,18,38,0.15)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });

    /* =====================================================
       TABLES
    ===================================================== */

    // Projects
    const projectsBody = document.getElementById('projectsTableBody');
    if (projectsBody && data.tables.projects) {
      data.tables.projects.forEach((p, i) => {
        projectsBody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.location}</td>
            <td>${p.period}</td>
            <td>${p.donor}</td>
            <td>${p.beneficiaries.toLocaleString('ar-EG')}</td>
          </tr>`;
      });
    }

    // Training
    const trainingBody = document.getElementById('trainingTableBody');
    if (trainingBody && data.tables.training) {
      data.tables.training.forEach((t, i) => {
        trainingBody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${t.title}</td>
            <td>${t.location}</td>
            <td>${t.period}</td>
            <td>${t.target}</td>
            <td>${t.donor}</td>
            <td>${t.count}</td>
          </tr>`;
      });
    }

    // Mines Awareness
    const minesBody = document.getElementById('minesTableBody');
    if (minesBody && data.tables.mines) {
      data.tables.mines.forEach((m, i) => {
        const total = m.male + m.female;
        minesBody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${m.month}</td>
            <td>${m.location}</td>
            <td>${m.male}</td>
            <td>${m.female}</td>
            <td>${total}</td>
          </tr>`;
      });
    }

    // Events
    const eventsBody = document.getElementById('eventsTableBody');
    if (eventsBody && data.tables.events) {
      data.tables.events.forEach((e, i) => {
        eventsBody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${e.name}</td>
            <td>${e.category}</td>
            <td>${e.location}</td>
            <td>${e.date}</td>
            <td>${e.donor}</td>
            <td>${e.volunteers}</td>
          </tr>`;
      });
    }

    // Media
    const mediaBody = document.getElementById('mediaTableBody');
    if (mediaBody && data.tables.media) {
      data.tables.media.forEach((m, i) => {
        mediaBody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${m.quarter}</td>
            <td>${m.activity}</td>
            <td>${m.count}</td>
            <td>${m.location}</td>
            <td>${m.target}</td>
            <td>${m.beneficiaries}</td>
          </tr>`;
      });
    }

    // RFL
    const rflBody = document.getElementById('rflTableBody');
    if (rflBody && data.tables.rfl) {
      data.tables.rfl.forEach((r, i) => {
        rflBody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${r.type}</td>
            <td>${r.count}</td>
          </tr>`;
      });
    }

    // Ambulance Referrals Table
    const ambulanceBody = document.getElementById('ambulanceTableBody');
    if (ambulanceBody && data.tables.ambulance) {
      data.tables.ambulance.forEach(row => {
        const total = row.falaj + row.kassara + row.sayun + row.attir;
        ambulanceBody.innerHTML += `
          <tr>
            <td>${row.month}</td>
            <td>${row.falaj}</td>
            <td>${row.kassara}</td>
            <td>${row.sayun}</td>
            <td>${row.attir}</td>
            <td>${total}</td>
          </tr>`;
      });
    }

  })
  .catch(err => {
    console.error('Failed to load data.json', err);
  });
