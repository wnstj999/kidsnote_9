// ===== 외부 JS 동적 로드 =====
const jsLinks = [
  'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/jquery-3.3.1.min.js',
  'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/popper.min.js',
  'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/bootstrap.min.js',
  'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/perfect-scrollbar.js',
  'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/jquery-ui.min.js',
  'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/Chart.bundle.min.js',
  'assets/js/index.js',
  'assets/js/framework.js',
  'assets/js/settings.js',
  'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/datatables.min.js',
  'https://metropolitanhost.com/themes/templatemoster/html/weeducate/assets/js/data-tables.js'
];

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

// ===== 모든 외부 JS 로드 후 실행 =====
loadScriptsSequentially([...jsLinks], () => {
  console.log("모든 외부 JS 로드 완료 ✅");

  // ===== Kakao Map Init =====
  function initMap() {
    // SDK는 반드시 dashboard.html head에 포함되어야 함
    if (typeof kakao === "undefined" || !document.getElementById("map")) {
      console.warn("Kakao SDK 또는 #map 요소를 찾을 수 없습니다.");
      return;
    }

    kakao.maps.load(function () {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(35.869452, 128.595678), // 대구 한국IT교육원
        level: 3
      };
      const map = new kakao.maps.Map(container, options);

      // 마커
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(35.869452, 128.595678)
      });
      marker.setMap(map);

      // 말풍선
      const infowindow = new kakao.maps.InfoWindow({
        content: '<div style="padding:5px;font-size:13px;">대구 한국IT교육원</div>'
      });
      infowindow.open(map, marker);

      // Quick Bar Location 탭 열릴 때 지도 리사이즈 보정
      const locationTab = document.querySelector('[href="#qa-location"]');
      if (locationTab) {
        locationTab.addEventListener("click", function () {
          setTimeout(function () {
            map.relayout();
            map.setCenter(new kakao.maps.LatLng(35.869452, 128.595678));
          }, 300);
        });
      }
    });
  }

  // DOM 로드 후 지도 초기화 실행
  document.addEventListener("DOMContentLoaded", initMap);
});
