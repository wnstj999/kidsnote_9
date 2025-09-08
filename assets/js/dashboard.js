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

// ===== Kakao Map Init (주소 기반) =====
function initMap() {
  if (typeof kakao === "undefined" || !document.getElementById("map")) {
    console.warn("⚠️ Kakao SDK 또는 #map 요소를 찾을 수 없습니다.");
    return;
  }

  kakao.maps.load(function () {
    const container = document.getElementById("map");
    const map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.5665, 126.9780), // 초기 서울 중심
      level: 3
    });

    const geocoder = new kakao.maps.services.Geocoder();

    // ✅ 표시할 주소
    const address = "대구광역시 동구 동대구로 566";

    geocoder.addressSearch(address, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 지도 중심 이동
        map.setCenter(coords);

        // 마커
        const marker = new kakao.maps.Marker({
          position: coords
        });
        marker.setMap(map);

        // 말풍선
        const infowindow = new kakao.maps.InfoWindow({
          content: '<div style="padding:5px;font-size:13px;">한국IT교육원</div>'
        });
        infowindow.open(map, marker);

        // Quick Bar Location 탭 열릴 때 지도 리사이즈 보정
        const locationTab = document.querySelector('[href="#qa-location"]');
        if (locationTab) {
          locationTab.addEventListener("click", function () {
            setTimeout(function () {
              map.relayout();
              map.setCenter(coords);
            }, 300);
          });
        }
      } else {
        console.error("주소 변환 실패 ❌", status);
      }
    });
  });
}

// ===== FullCalendar Init =====
function initCalendar() {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",   // 월간 달력만 표시
    locale: "ko",
    height: 500,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: ""   // 👉 주/일 뷰 제거
    },
    buttonText: {
      today: "오늘",
      month: "월"
    },
    selectable: true,     // 날짜 선택 가능
    editable: true,       // 이벤트 드래그 가능
    events: [
      { title: "수업 시작", start: "2025-09-08T10:00:00", className: "lesson" },
      { title: "점심", start: "2025-09-08T12:00:00", className: "lunch" },
      { title: "학부모 상담", start: "2025-09-08T15:00:00", className: "meeting" }
    ],
    // 일정 추가
    select: function(info) {
      const title = prompt("일정 제목을 입력하세요:");
      if (title) {
        calendar.addEvent({
          title: title,
          start: info.start,
          end: info.end,
          allDay: info.allDay
        });
      }
      calendar.unselect();
    },
    // 일정 삭제
    eventClick: function(info) {
      if (confirm(`'${info.event.title}' 일정을 삭제하시겠습니까?`)) {
        info.event.remove();
      }
    }
  });

  calendar.render();
}

// ===== 모든 외부 JS 로드 후 실행 =====
loadScriptsSequentially([...jsLinks], () => {
  console.log("모든 외부 JS 로드 완료 ✅");
  initMap();       // ✅ 주소 기반 지도 실행
  initCalendar();  // ✅ FullCalendar 실행
});
