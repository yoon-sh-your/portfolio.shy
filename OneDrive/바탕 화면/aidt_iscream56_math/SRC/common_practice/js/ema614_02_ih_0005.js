document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.boolean_wrap button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // 클릭한 버튼이 이미 selected면 아무것도 하지 않음
      if (button.classList.contains('selected')) return;

      // 모든 버튼 반복해서 현재 클릭된 버튼 외에는 selected 제거
      buttons.forEach(btn => {
        if (btn !== button) {
          btn.classList.remove('selected');
        }
      });

  
    });
  });
});
