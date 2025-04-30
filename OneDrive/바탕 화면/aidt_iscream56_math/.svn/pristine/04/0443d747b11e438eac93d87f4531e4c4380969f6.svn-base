runAfterAppReady(() => {

  let showAfterSecondError = document.querySelector(
    ".ema521_05_su_0004 .page_2 .example_box"
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
  };

  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function () {
    // alert("🔄 리셋 버튼 클릭됨");
    $(".page_2 .example_box").css("opacity", "0");
  };
});