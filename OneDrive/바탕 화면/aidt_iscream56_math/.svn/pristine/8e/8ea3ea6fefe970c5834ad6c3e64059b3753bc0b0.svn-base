runAfterAppReady(() => {
  // 앱 준비 후 실행, jQuery 사용가능
  console.log("custom_answer_check.js 실행");

  let showAfterSecondError = document.querySelector(
    ".ema512_02_su_0005 .page_2 .example_box"
  );
  let removeActive = document.querySelector(".btn_area .btnCheck");

  // 정답 시 추가 동작
  window.onCorrectCustom = function () {
    // alert("🎉 정답이에요!");
    $(".page_2 .example_box").css("opacity", "1");
    showAfterSecondError.style.display = "block";
  };

  // 오답 시 추가 동작
  window.onIncorrectCustom = function () {
    // alert("❗ 다시 생각해보세요.");
    showAfterSecondError.style.display = "none";
    removeActive.classList.remove("close");
  };

  // 두 번째 오답 시
  window.onIncorrectTwiceCustom = function () {
    // alert("🚨 정답 공개됩니다!");
    showAfterSecondError.style.display = "block";
    $(".page_2 .example_box").css("opacity", "1");
    // $(".page_2 .boolean_wrap").css("pointer-events", "none");
  };

  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function () {
    // alert("🔄 리셋 버튼 클릭됨");
    // $(".page_2 .boolean_wrap").css("pointer-events", "auto");
    $(".page_2 .example_box").css("opacity", "0");
  };
});
