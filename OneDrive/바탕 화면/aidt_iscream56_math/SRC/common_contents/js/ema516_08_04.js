document.addEventListener("DOMContentLoaded", function () {
  const btnSubmit = document.querySelector(".btnSubmit");
  const btnReset = document.querySelector(".btnReset");
  const exBoxes = document.querySelectorAll(".ex_box");
  const canvas = document.querySelector('canvas[data-canvas-id="canvas_1"]');
  const ctx = canvas.getContext("2d");

  const ractangleTexts = Array.from(
    document.querySelectorAll(
      ".ractangle_box1 > .text_top span, .ractangle_box1 > .text_bottom span, .ractangle_box2 > .txt_top span, .ractangle_box2 > .txt_bottom span"
    )
  );

  const exBoxTexts = Array.from(
    document.querySelectorAll(
      ".ractangle_box1 .ex_box span, .ractangle_box2 .ex_box span"
    )
  );

  const ractangleImgs = document.querySelectorAll(
    ".ractangle_box1 > img, .ractangle_box2 > img"
  );

  // 초기화: 예시 박스와 내부 텍스트 숨김
  exBoxes.forEach((box) => (box.style.display = "none"));
  exBoxTexts.forEach((span) => (span.style.display = "none"));

  // ✅ 제출 버튼
  btnSubmit.addEventListener("click", function () {
    ractangleImgs.forEach((img) => (img.style.display = "none"));
    ractangleTexts.forEach((span) => (span.style.display = "none"));
    exBoxes.forEach((box) => (box.style.display = "block"));
    exBoxTexts.forEach((span) => (span.style.display = "inline"));

    // 리셋 버튼 활성화
    btnReset.disabled = false;
    btnReset.classList.remove("disabled");

    // 제출 버튼 비활성화 (공통 스타일에 맡김)
    btnSubmit.disabled = true;
    btnSubmit.classList.add("disabled");
  });

  // ✅ 리셋 버튼
  btnReset.addEventListener("click", function () {
    ractangleImgs.forEach((img) => (img.style.display = "block"));
    ractangleTexts.forEach((span) => (span.style.display = "inline"));
    exBoxTexts.forEach((span) => (span.style.display = "none"));
    exBoxes.forEach((box) => (box.style.display = "none"));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetDrawingTool();

    // 리셋 버튼 비활성화
    btnReset.disabled = true;
    btnReset.classList.add("disabled");

    // 제출 버튼 활성화 (공통 스타일에 맡김)
    btnSubmit.disabled = false;
    btnSubmit.classList.remove("disabled");
  });

  function resetDrawingTool() {
    const activeBtns = document.querySelectorAll(".draw-tool-wrap .active");
    activeBtns.forEach((btn) => btn.classList.remove("active"));

    document.querySelector(".ic_pen")?.classList.add("active");
    document.querySelector(".p_black")?.classList.add("active");
  }
});
