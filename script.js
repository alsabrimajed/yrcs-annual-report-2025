 /* =====================================================
   Load data.json
===================================================== */
fetch('data.json')
  .then(response => response.json())
  .then(data => {

    /* =====================================================
       HERO STATS (Animated Counters)
    ===================================================== */
    document.querySelectorAll('.stat-number').forEach(el => {
      const key = el.dataset.key;
      const target = data.stats[key];
      if (typeof target !== 'number') return;

      let current = 0;
      const step = Math.max(1, Math.ceil(target / 120));

      const animate = () => {
        current += step;
        if (current < target) {
          el.textContent = current.toLocaleString('ar-EG');
          requestAnimationFrame(animate);
        } else {
          el.textContent = target.toLocaleString('ar-EG');
        }
      };
      animate();
    });

    /* =====================================================
       CHARTS (Chart.js)
    ===================================================== */
    Chart.defaults.font.family = 'Tajawal';
    Chart.defaults.color = '#333';

    // Category Chart
    if (window.categoryChart) {
      new Chart(categoryChart, {
        type: 'pie',
        data: {
          labels: data.charts.categories.labels,
          datasets: [{
            data: data.charts.categories.values,
            backgroundColor: [
              '#b11226', '#1f4e79', '#2ecc71',
              '#8e44ad', '#f39c12', '#7f8c8d'
            ]
          }]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
      });
    }

    // Donor Chart
    if (window.donorChart) {
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
    }

    // Activities Chart
    if (window.activitiesChart) {
      new Chart(activitiesChart, {
        type: 'doughnut',
        data: {
          labels: data.charts.activities.labels,
          datasets: [{
            data: data.charts.activities.values,
            backgroundColor: ['#e74c3c', '#3498db', '#27ae60', '#9b59b6']
          }]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
      });
    }

    // Ambulance Monthly Chart
    if (window.ambulanceChart) {
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
    }

    /* =====================================================
       TABLES
    ===================================================== */

    // Projects
    const projectsBody = document.getElementById('projectsTableBody');
    if (projectsBody && data.tables.projects) {
      data.tables.projects.forEach((p, i) => {
        projectsBody.insertAdjacentHTML('beforeend', `
          <tr>
            <td>${i + 1}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.location}</td>
            <td>${p.period}</td>
            <td>${p.donor}</td>
            <td>${p.beneficiaries.toLocaleString('ar-EG')}</td>
          </tr>
        `);
      });
    }

    // Training
    const trainingBody = document.getElementById('trainingTableBody');
    if (trainingBody && data.tables.training) {
      data.tables.training.forEach((t, i) => {
        trainingBody.insertAdjacentHTML('beforeend', `
          <tr>
            <td>${i + 1}</td>
            <td>${t.title}</td>
            <td>${t.location}</td>
            <td>${t.period}</td>
            <td>${t.target}</td>
            <td>${t.donor}</td>
            <td>${t.count}</td>
          </tr>
        `);
      });
    }

    /* =====================================================
       CATEGORY CARDS (Dynamic)
    ===================================================== */
    const categoryCards = document.getElementById('categoryCards');
    if (categoryCards && data.categories_cards) {
      data.categories_cards.forEach(cat => {
        categoryCards.insertAdjacentHTML('beforeend', `
          <div class="category-card cat-${cat.key}">
            <div class="category-icon">
              <i class="fas ${cat.icon}"></i>
            </div>
            <h4>${cat.title}</h4>
            <span class="category-count">${cat.projects} مشاريع</span>
            <span class="category-beneficiaries">
              ${cat.beneficiaries.toLocaleString('ar-EG')} مستفيد
            </span>
          </div>
        `);
      });
    }

    /* =====================================================
       RECOMMENDATIONS (Dynamic)
    ===================================================== */
    const recommendationsGrid = document.getElementById('recommendationsGrid');
    if (recommendationsGrid && data.recommendations) {
      data.recommendations.forEach(rec => {
        recommendationsGrid.insertAdjacentHTML('beforeend', `
          <div class="recommendation-card"
               style="
                 background: linear-gradient(135deg,#f8f9fa,#e9ecef);
                 padding:30px;
                 border-radius:15px;
                 border-right:5px solid ${rec.color};
               ">
            <h3 style="color:${rec.color};margin-bottom:15px;">
              <i class="fas ${rec.icon}"></i>
              ${rec.sector}
            </h3>
            <p style="line-height:1.6;color:var(--text-light);">
              ${rec.text}
            </p>
          </div>
        `);
      });
    }

  })
  .catch(error => {
    console.error('❌ Failed to load data.json', error);
  });
