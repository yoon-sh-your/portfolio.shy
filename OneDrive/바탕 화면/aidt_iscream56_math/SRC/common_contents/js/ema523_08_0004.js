document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn_rotation");
  const figureWrap = document.querySelector(".figure_wrap .figure");
  const resetBtn = document.querySelector(".btnReset");

  let rotateDeg = 0;

  // 회전 버튼 클릭 시 회전
  btn?.addEventListener("click", () => {
    rotateDeg = (rotateDeg + 90) % 360;
    figureWrap.style.transform = `rotate(${rotateDeg}deg)`;
  });

  // 리셋 버튼 클릭 시 초기화
  resetBtn?.addEventListener("click", () => {
    const currentPageId = document.querySelector("#app_wrap")?.getAttribute("data-current-page");

    // 🔸 회전을 초기화할 대상 페이지 ID를 여기에 지정 (예: page_2)
    if (currentPageId === "page_3") {
      rotateDeg = 0;
      figureWrap.style.transform = "rotate(0deg)";
    }
  });
});
