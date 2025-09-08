// ===== 외부 JS 동적 로드 =====
const jsLinks = ['https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/jquery-3.3.1.min.js', 'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/popper.min.js', 'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/bootstrap.min.js', 'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/perfect-scrollbar.js', 'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/jquery-ui.min.js', 'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/Chart.bundle.min.js', 'assets/js/index.js', 'assets/js/framework.js', 'assets/js/settings.js', 'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/datatables.min.js', 'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/data-tables.js'];

function loadScriptsSequentially(sources, callback) {
  if (!sources.length) {
    if (callback) callback();
    return;
  }
  const src = sources.shift();
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => loadScriptsSequentially(sources, callback);
  document.body.appendChild(script);
}

loadScriptsSequentially([...jsLinks], () => {
  console.log("모든 외부 JS 로드 완료 ✅");
  // ===== 여기에 커스텀 JS 작성 =====
});
