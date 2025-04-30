runAfterAppReady(() => {
    const buttons = document.querySelectorAll('.ex_box .boolean_wrap button');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        // 모든 버튼에서 selected 클래스 제거
        buttons.forEach(btn => btn.classList.remove('selected'));
        // 클릭한 버튼에 selected 클래스 추가
        button.classList.add('selected');
      });
    });
});
  