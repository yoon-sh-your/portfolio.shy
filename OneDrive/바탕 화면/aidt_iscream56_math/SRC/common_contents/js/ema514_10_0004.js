runAfterAppReady(() => {
  function markFractionHints() {
    // 현재 페이지 기준
    const page = pagenation.activePage;

    // fraction_wrap 내에 있는 math-field 중 data-answer-multi가 있고, 오답인 것 찾기
    page.querySelectorAll(".fraction_wrap math-field[data-answer-multi]").forEach((mathField) => {
      if (mathField.dataset.correction === "false") {
        const wrap = mathField.closest(".fraction_wrap");
        if (!wrap) return;

        const hintEl = wrap.querySelector(".multiple_hint");
        if (hintEl) {
          hintEl.classList.add("hint");
          hintEl.hidden = false; // 혹시 hidden 되어 있으면 보이게 처리
        }
      }
    });
  }

  // onIncorrectTwice 이벤트에서 호출되도록 연결
  const originalOnIncorrectTwice = window.onIncorrectTwiceCustom;
  window.onIncorrectTwiceCustom = function () {
    if (typeof originalOnIncorrectTwice === "function") {
      originalOnIncorrectTwice();
    }
    markFractionHints();
  };

  // 초기 실행에서도 확인 가능하게 설정 (선택사항)
  markFractionHints();

  // btnReset 버튼 클릭 시 multiple_hint에 있는 hint 클래스 제거
  const btnReset = document.querySelector(".btnReset");
  if (btnReset) {
    btnReset.addEventListener("click", function () {
      // 모든 multiple_hint 요소에서 hint 클래스 제거
      document.querySelectorAll(".multiple_hint").forEach((hintEl) => {
        hintEl.classList.remove("hint");
        hintEl.hidden = true; // 힌트 숨기기
      });
    });
  }
});
