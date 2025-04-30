(() => {
  // ✅ 별도 스코프로 감싸 변수 충돌 방지
  function initPage4Interaction() {
    const wrapper = document.querySelector("#app_wrap");
    const currentPageId = wrapper?.getAttribute("data-current-page");
    if (currentPageId !== "page_4") return;

    const currentPage = document.querySelector(`.page.${currentPageId}`);
    if (!currentPage) return;

    console.log("✅ page_4 진입 확인");

    const questionBox = currentPage.querySelector(".question_box");
    const inner1 = questionBox.querySelector(".inner1");
    const inner2 = questionBox.querySelector(".inner2");

    const select1 = inner1.querySelector("select.custom_dropdown");
    const select2 = inner2.querySelector("select.custom_dropdown");
    const textarea1 = inner1.querySelector("math-field.textarea");
    const textarea2 = inner2.querySelector("math-field.textarea");

    if (!select1 || !select2 || !textarea1 || !textarea2) {
      console.warn("❌ 필수 요소 누락");
      return;
    }

    let firstSelected = null;
    let inputDone = false;

    textarea1.addEventListener("input", () => {
      const value = textarea1.getValue()?.trim();
      inputDone = !!value;
      console.log("✏️ 입력 감지됨:", value);
    });

    select1.addEventListener("change", function () {
      const value = this.value;
      if (!value) return;

      if (!firstSelected) {
        firstSelected = value;
        console.log("🔐 첫 선택 저장됨:", firstSelected);
        return;
      }

      if (inputDone && value !== firstSelected) {
        console.log("🚨 다른 값 선택됨:", value);

        setTimeout(() => {
          select1.value = firstSelected;
          console.log("🔁 select1 복원:", firstSelected);
        }, 0);

        inner2.style.display = "flex";
        select2.value = value;
        textarea2.setValue("");

        questionBox.classList.add("input_row");
        console.log("🎯 inner2 열림 + input_row 클래스 추가됨");
      }
    });
  }

  // ✅ DOM 로드 후 + 슬라이드 전환 감지
  document.addEventListener("DOMContentLoaded", () => {
    initPage4Interaction(); // 초기 진입 시 실행
  });

  const appWrapForObserver = document.querySelector("#app_wrap");
  if (appWrapForObserver) {
    const observer = new MutationObserver(() => {
      initPage4Interaction(); // 슬라이드 이동 시 실행
    });

    observer.observe(appWrapForObserver, {
      attributes: true,
      attributeFilter: ["data-current-page"]
    });
  }
})();
