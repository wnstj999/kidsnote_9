// 회원가입 처리
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // 회원가입
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;

      if (!username || !password) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return;
      }

      // LocalStorage에 계정 저장
      localStorage.setItem("user", JSON.stringify({ username, password }));
      alert("회원가입 완료! 로그인 페이지로 이동합니다.");
      window.location.href = "index.html"; // 로그인 페이지로 이동
    });
  }

  // 로그인
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (savedUser && username === savedUser.username && password === savedUser.password) {
        alert("로그인 성공!");
        window.location.href = "dashboard.html"; // 로그인 성공 후 이동할 페이지
      } else {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    });
  }
});
