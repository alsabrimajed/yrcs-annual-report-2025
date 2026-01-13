/* =====================================================
   Animated Counters (Hero Stats)
===================================================== */
document.querySelectorAll('.stat-number').forEach(el => {
  const target = +el.dataset.count;
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
   Charts (Chart.js)
===================================================== */
Chart.defaults.font.family = 'Tajawal';
Chart.defaults.color = '#333';

/* --- Projects by Category --- */
new Chart(document.getElementById('categoryChart'), {
  type: 'pie',
  data: {
    labels: ['التقييم', 'الإيواء', 'زراعي', 'جلسات نقاش', 'التحقق', 'مساعدات نقدية'],
    datasets: [{
      data: [5, 3, 4, 3, 3, 1],
      backgroundColor: ['#b11226', '#1f4e79', '#2ecc71', '#8e44ad', '#f39c12', '#7f8c8d']
    }]
  },
  options: {
    plugins: { legend: { position: 'bottom' } }
  }
});

/* --- Beneficiaries by Donor --- */
new Chart(document.getElementById('donorChart'), {
  type: 'bar',
  data: {
    labels: ['ICRC', 'IFRC', 'NRCS', 'GRC'],
    datasets: [{
      label: 'عدد المستفيدين',
      data: [6200, 4800, 3500, 3165],
      backgroundColor: '#1f4e79'
    }]
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  }
});

/* --- Activities Distribution --- */
new Chart(document.getElementById('activitiesChart'), {
  type: 'doughnut',
  data: {
    labels: ['توعية ألغام', 'تدريب', 'إحالة إسعافية', 'إعلام'],
    datasets: [{
      data: [6705, 131, 747, 362],
      backgroundColor: ['#e74c3c', '#3498db', '#27ae60', '#9b59b6']
    }]
  },
  options: {
    plugins: { legend: { position: 'bottom' } }
  }
});

/* --- Ambulance Monthly Referrals --- */
new Chart(document.getElementById('ambulanceChart'), {
  type: 'line',
  data: {
    labels: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
    datasets: [{
      label: 'حالات الإحالة',
      data: [40, 55, 60, 70, 65, 75, 80, 90, 85, 70, 55, 52],
      borderColor: '#b11226',
      backgroundColor: 'rgba(177,18,38,0.15)',
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    scales: { y: { beginAtZero: true } }
  }
});

/* =====================================================
   Tables Data
===================================================== */

/* --- Projects Table --- */
const projects = [
  ['توزيع سلال إيوائية', 'الإيواء', 'مأرب', 'فبراير 2025', 'ICRC', 1600],
  ['التقييم متعدد القطاعات', 'التقييم', 'حريب', 'مارس 2025', 'IFRC', 450],
  ['مساعدات نقدية', 'نقدي', 'الوادي', 'أبريل 2025', 'NRCS', 1000]
];

const projectsBody = document.getElementById('projectsTableBody');
projects.forEach((p, i) => {
  projectsBody.innerHTML += `
    <tr>
      <td>${i + 1}</td>
      <td>${p[0]}</td>
      <td>${p[1]}</td>
      <td>${p[2]}</td>
      <td>${p[3]}</td>
      <td>${p[4]}</td>
      <td>${p[5].toLocaleString('ar-EG')}</td>
    </tr>`;
});

/* --- Training Table --- */
const trainings = [
  ['إسعافات أولية', 'مأرب', 'يونيو 2025', 'متطوعين', 'IFRC', 40],
  ['إدارة الكوارث', 'مأرب', 'أغسطس 2025', 'موظفين', 'GRC', 35],
  ['إعداد المبادرات', 'مأرب', 'نوفمبر 2025', 'شباب', 'NRCS', 56]
];

const trainingBody = document.getElementById('trainingTableBody');
trainings.forEach((t, i) => {
  trainingBody.innerHTML += `
    <tr>
      <td>${i + 1}</td>
      <td>${t[0]}</td>
      <td>${t[1]}</td>
      <td>${t[2]}</td>
      <td>${t[3]}</td>
      <td>${t[4]}</td>
      <td>${t[5]}</td>
    </tr>`;
});

/* --- Mines Awareness Table --- */
const mines = [
  ['يناير', 'مخيم السويداء', 520, 480],
  ['فبراير', 'الوادي', 600, 540],
  ['مارس', 'حريب', 700, 650]
];

const minesBody = document.getElementById('minesTableBody');
mines.forEach((m, i) => {
  const total = m[2] + m[3];
  minesBody.innerHTML += `
    <tr>
      <td>${i + 1}</td>
      <td>${m[0]}</td>
      <td>${m[1]}</td>
      <td>${m[2]}</td>
      <td>${m[3]}</td>
      <td>${total}</td>
    </tr>`;
});

/* --- RFL Table --- */
const rflData = [
  ['استقبال جثث', 48],
  ['نقل جثث', 62],
  ['لمّ شمل أسر', 1256]
];

const rflBody = document.getElementById('rflTableBody');
rflData.forEach((r, i) => {
  rflBody.innerHTML += `
    <tr>
      <td>${i + 1}</td>
      <td>${r[0]}</td>
      <td>${r[1]}</td>
    </tr>`;
});

/* --- Ambulance Table --- */
const ambulanceData = [
  ['يناير', 10, 8, 6, 12],
  ['فبراير', 14, 12, 10, 15],
  ['مارس', 18, 15, 12, 20]
];

const ambulanceBody = document.getElementById('ambulanceTableBody');
ambulanceData.forEach(row => {
  const total = row.slice(1).reduce((a, b) => a + b, 0);
  ambulanceBody.innerHTML += `
    <tr>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td>${row[3]}</td>
      <td>${row[4]}</td>
      <td>${total}</td>
    </tr>`;
});
