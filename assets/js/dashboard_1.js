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

        map.setCenter(coords);

        const marker = new kakao.maps.Marker({ position: coords });
        marker.setMap(map);

        const infowindow = new kakao.maps.InfoWindow({
          content: '<div style="padding:5px;font-size:13px;">한국IT교육원</div>'
        });
        infowindow.open(map, marker);

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

  // 전역(window)에 보관 (render는 탭 열릴 때 실행)
  window.calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "ko",
    height: 500,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: ""
    },
    buttonText: { today: "오늘", month: "월" },
    selectable: true,
    editable: true,
    events: [
      { title: "수업 시작", start: "2025-09-08T10:00:00", className: "lesson" },
      { title: "점심", start: "2025-09-08T12:00:00", className: "lunch" },
      { title: "학부모 상담", start: "2025-09-08T15:00:00", className: "meeting" }
    ],
    select: function(info) {
      const title = prompt("일정 제목을 입력하세요:");
      if (title) {
        window.calendar.addEvent({
          title: title,
          start: info.start,
          end: info.end,
          allDay: info.allDay
        });
      }
      window.calendar.unselect();
    },
    eventClick: function(info) {
      if (confirm(`'${info.event.title}' 일정을 삭제하시겠습니까?`)) {
        info.event.remove();
      }
    }
  });
}

// ===== 탭 전환 시 캘린더 보정 =====
let calendarRendered = false;

document.addEventListener("DOMContentLoaded", () => {
  const scheduleTab = document.querySelector('[href="#qa-calendar"]');
  if (scheduleTab) {
    scheduleTab.addEventListener("shown.bs.tab", () => {
      if (window.calendar) {
        if (!calendarRendered) {
          window.calendar.render();   // 첫 탭 진입 시 render
          calendarRendered = true;
        } else {
          window.calendar.updateSize(); // 이후엔 사이즈 보정
        }
      }
    });
  }
});

// ===== 급식 조회 =====
async function loadMeal(date) {
  const apiKey = "1a70a5506a3e42a882e2e1ef7d0d1a12";
  const officeCode = "R10";       // 경상북도교육청
  const schoolCode = "8811044";   // 영주동부초등학교

  const targetDate = date || new Date().toISOString().slice(0,10).replace(/-/g,"");

  const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${apiKey}&Type=json&pIndex=1&pSize=10&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${targetDate}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const mealBox = document.getElementById("meal-result");

    if (!data.mealServiceDietInfo) {
      mealBox.innerHTML = `<p>❌ ${targetDate} 급식 데이터가 없습니다</p>`;
      return;
    }

    const meals = data.mealServiceDietInfo[1].row;
    let html = `<h6>${targetDate.slice(0,4)}년 ${targetDate.slice(4,6)}월 ${targetDate.slice(6,8)}일 급식</h6><ul>`;
    meals.forEach(m => {
      let dish = m.DDISH_NM.replace(/<br\/>/g, ", ")
                           .replace(/[0-9]+\./g, "")
                           .replace(/\([0-9]+\)/g, "")
                           .trim();
      html += `<li>${dish}</li>`;
    });
    html += "</ul>";
    mealBox.innerHTML = html;
  } catch (e) {
    console.error("급식 데이터를 불러올 수 없습니다.", e);
    document.getElementById("meal-result").innerHTML = "데이터 오류 ❌";
  }
}

// ===== 모든 외부 JS 로드 후 실행 =====
loadScriptsSequentially([...jsLinks], () => {
  console.log("모든 외부 JS 로드 완료 ✅");
  initMap();
  initCalendar(); // render는 탭 열릴 때 실행
});

// ===== 페이지 로드 시 오늘 급식 표시 =====
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().slice(0,10);
  document.getElementById("meal-date").value = today;
  loadMeal();

  document.getElementById("meal-btn").addEventListener("click", () => {
    const dateInput = document.getElementById("meal-date").value;
    if (dateInput) {
      const yyyymmdd = dateInput.replace(/-/g,"");
      loadMeal(yyyymmdd);
    } else {
      alert("날짜를 선택하세요!");
    }
  });
});
