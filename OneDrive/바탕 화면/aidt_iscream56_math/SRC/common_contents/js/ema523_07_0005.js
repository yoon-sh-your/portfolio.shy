
// ✅ 슬라이딩 페이지 구조 기준으로 회전 버튼 바인딩 (기본 기능 우선 동작 보장)
document.addEventListener('DOMContentLoaded', () => {
  // ✅ 회전 버튼 바인딩 함수
  function bindRotationForPage3() {
    const currentPage = document.querySelector('.page.page_3');
    if (!currentPage || !currentPage.classList.contains('on')) return;

    const figures = currentPage.querySelectorAll('.boolean_wrap .figure');
    const rotateButtons = currentPage.querySelectorAll('.rotation_buttons .btn_rotation');
    const resetBtn = document.querySelector('.btnReset');

    // ✅ 회전 버튼 이벤트 바인딩
    rotateButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // completed 상태일 때 클릭 막기
        if (currentPage.classList.contains('completed')) return;

        const figure = figures[index];
        const img = figure?.querySelector('img');
        if (!img) return;

        let currentRotation = parseInt(img.getAttribute('data-rotation')) || 0;
        currentRotation = (currentRotation + 90) % 360;

        img.style.transform = `rotate(${currentRotation}deg)`;
        img.setAttribute('data-rotation', currentRotation);

        const bg = figure.querySelector('.bg');
        if (bg) {
          bg.style.zIndex = '2';
          bg.style.display = currentRotation === 0 ? 'none' : 'block';
          console.log(`✅ z-index 적용됨 →`, bg);
        } else {
          console.warn('❌ .bg 요소를 찾을 수 없음');
        }

        const pageIsActive = document.querySelector('#app_wrap')?.getAttribute('data-current-page') === 'page_3';
        if (pageIsActive) {
          resetBtn?.classList.add('active');
        }
      });
    });

    // ✅ completed 상태 감지 → 버튼 disabled 처리
    const completedObserver = new MutationObserver(() => {
      if (currentPage.classList.contains('completed')) {
        rotateButtons.forEach(btn => btn.setAttribute('disabled', 'true'));
      } else {
        rotateButtons.forEach(btn => btn.removeAttribute('disabled'));
      }
    });
    completedObserver.observe(currentPage, { attributes: true, attributeFilter: ['class'] });

    // ✅ 확인 버튼 클릭 시 회전 초기화 (page_3 한정)
    const checkBtn = document.querySelector('.btnCheck');
    checkBtn?.addEventListener('click', () => {
      const pageIsActive = document.querySelector('#app_wrap')?.getAttribute('data-current-page') === 'page_3';
      if (!pageIsActive) return;

      figures.forEach(figure => {
        const img = figure.querySelector('img');
        if (img) {
          img.style.transform = 'rotate(0deg)';
          img.setAttribute('data-rotation', '0');
        }
        const bg = figure.querySelector('.bg');
        if (bg) bg.style.display = 'none';
      });
    });

    // ✅ 리셋 버튼 클릭 시 초기화 (page_3 한정)
    resetBtn?.addEventListener('click', () => {
      const pageIsActive = document.querySelector('#app_wrap')?.getAttribute('data-current-page') === 'page_3';
      if (!pageIsActive) return;

      figures.forEach(figure => {
        const img = figure.querySelector('img');
        if (img) {
          img.style.transform = 'rotate(0deg)';
          img.setAttribute('data-rotation', '0');
        }
        const bg = figure.querySelector('.bg');
        if (bg) bg.style.display = 'none';
      });

      resetBtn.classList.remove('active');
    });
  }

  // ✅ 페이지 전환 시마다 바인딩 시도
  const observer = new MutationObserver(() => {
    const currentPage = document.querySelector('.page.page_3');
    if (currentPage?.classList.contains('on')) {
      bindRotationForPage3();
    }
  });
  observer.observe(document.querySelector('#app_wrap'), { attributes: true, attributeFilter: ['data-current-page'] });
});

