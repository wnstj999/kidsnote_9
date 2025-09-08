// layout.js
// load dashboard.html into #content
fetch('dashboard.html').then(r=>r.text()).then(html => {
  document.getElementById('content').innerHTML = html;
});