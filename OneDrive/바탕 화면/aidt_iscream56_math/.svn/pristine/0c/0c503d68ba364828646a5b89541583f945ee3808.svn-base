


document.addEventListener('DOMContentLoaded', () => {
    const booleanWraps = document.querySelectorAll('.boolean_wrap');
  
    booleanWraps.forEach(wrap => {
      const buttons = wrap.querySelectorAll('button');
  
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          // 클릭한 버튼이 이미 selected면 아무것도 하지 않음
          if (button.classList.contains('selected')) return;
  
          // 현재 wrap 안의 버튼들 중 클릭된 버튼 외에는 selected 제거
          buttons.forEach(btn => {
            if (btn !== button) {
              btn.classList.remove('selected');
            }
          });

        });
      });
    });
  });
  
