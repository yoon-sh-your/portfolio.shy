runAfterAppReady(() => {
    const page = pagenation.activePage;
    window.getCustomTargets = function (page) {
      return $(page).find(".custom_check_target");
    };
    window.customCheckCondition = function (el) {
      // 정오처리 (기존과 같음)
      const $el = $(el);
      const rule = $el.data("answerSingle");
      const val = $el.val();

      if (val === "" || val == null) {
        return "empty"; // 빈 값
      }
      if (val === rule) {
        return true;
      }
      if (val !== rule) {
        return false;
      }
      return true;
    };

    // 빈값일 경우
    window.onEmptyCustom = function () {
      const exampleBox = page.querySelector(".example_box");
      if (exampleBox) exampleBox.style.display = "none"; // 빈값일 때 예시 박스 숨기기
      // 예시 닫기버튼 변경 막기
      document.querySelectorAll(".btnCheck").forEach((btn) => {
        btn.classList.remove("close");
      });

    };
    window.onIncorrectCustom = function () {
      const exampleBox = page.querySelector(".example_box");
      if (exampleBox) exampleBox.style.display = "none"; // 오답일 때 예시 박스 숨기기
      document.querySelectorAll(".btnCheck").forEach((btn) => {
        btn.classList.remove("close");
      });
    };

    // 두 번째 오답 시
    window.onIncorrectTwiceCustom = function () {
      const exampleBox = page.querySelector(".example_box");
      const resultBox = page.querySelector(".result_box");
      if (exampleBox) exampleBox.style.display = "block"; // 오답일 때 예시 박스 숨기기
      if (resultBox) resultBox.style.opacity = "1";
      // 예시 닫기버튼 변경 막기
      document.querySelectorAll(".btnCheck").forEach((btn) => {
        btn.classList.remove("close");
      });
    };
  });