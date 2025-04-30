runAfterAppReady(() => {
  // 두 번째 오답 시
  window.onIncorrectTwiceCustom = function () {
    $('.hint').addClass('show');
  };
  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function () {
    $('.hint').removeClass('show');
  };
});
