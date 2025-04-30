document.addEventListener('DOMContentLoaded', () => {
  const pages = document.querySelectorAll('.page');

  pages.forEach(page => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          if (page.classList.contains('success')) {
            const img = page.querySelector('.img_are img');
            if (img) {
              img.src = '../../common_practice/img/EMA615_11_IH/puzzle_on.png';
            }
          } else {
            const img = page.querySelector('.img_are img');
            if (img) {
              img.src = '../../common_practice/img/EMA615_11_IH/puzzle_off.png';
            }
          }
        }
      });
    });

    observer.observe(page, { attributes: true });
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const checkButtons = document.querySelectorAll('.btnCheck');

  checkButtons.forEach(button => {
    let isWrongTry = false;

    button.addEventListener('click', () => {
      const currentPage = button.closest('.page');
      const solveArea = currentPage.querySelector('.solve_area');
      const selectedButton = currentPage.querySelector('.boolean_wrap button.selected');
      const correctAnswer = currentPage.querySelector('.boolean_wrap button[data-answer-single="true"]');

      if (!selectedButton) return; // 선택 안 했을 경우 무시

      const isCorrect = selectedButton === correctAnswer;

      if (isCorrect) {
        solveArea.classList.add('active'); // 정답은 바로 해설 보여줌
        isWrongTry = false; // 리셋
      } else {
        if (!isWrongTry) {
          isWrongTry = true; // 첫 오답 시 저장만
        } else {
          solveArea.classList.add('active'); // 두 번째 오답 시 해설 보여줌
        }
      }
    });
  });
});

  


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


