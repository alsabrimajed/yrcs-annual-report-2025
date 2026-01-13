 fetch('data.json')
  .then(res => res.json())
  .then(data => {

    /* ================= Counters ================= */
    document.querySelectorAll('.stat-number').forEach(el => {
      const key = el.dataset.key;
      const target = data.stats[key];
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

    /* ================= Charts ================= */
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

    /* ================= Tables ================= */
    const projectsBody = document.getElementById('projectsTableBody');
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

    const trainingBody = document.getElementById('trainingTableBody');
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

  });
