runAfterAppReady(() => {
  console.log("custom_answer_check.js 실행");

  // 요소 선택
  const bubbleImg = document.querySelector(".page_3 .bubble_img");
  const bubble = document.querySelector(".page_3 .bubble");
  const btnCheck = document.querySelector(".btnCheck");
  const revealBtn = document.querySelector(".page_3 .reveal_btn"); // ← 추가됨

  // 초기 숨김 상태 + 커서 적용
  if (bubbleImg) {
    bubbleImg.style.display = "none";
  }
  if (bubble) {
    bubble.style.display = "none";
  }

  // 공통 함수: bubble과 bubble_img 보이게
  const showBubble = () => {
    if (bubbleImg) bubbleImg.style.display = "block";
    if (bubble) bubble.style.display = "block";
  };

  // ✅ btnCheck 클릭 시 말풍선 보이기
  if (btnCheck) {
    btnCheck.addEventListener("click", showBubble);
  }

  // ✅ reveal_btn 클릭 시도 같은 동작
  if (revealBtn) {
    revealBtn.addEventListener("click", showBubble);
  }

  // ✅ reset 시 말풍선 숨기기
  window.resetCustom = function () {
    $(".page_2 .example_box").css("opacity", "0");
    if (bubbleImg) bubbleImg.style.display = "none";
    if (bubble) bubble.style.display = "none";
  };
});
