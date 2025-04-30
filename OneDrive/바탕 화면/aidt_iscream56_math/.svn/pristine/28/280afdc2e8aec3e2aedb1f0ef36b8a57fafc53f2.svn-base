// 1. center-line 클릭 이벤트 처리
document.addEventListener('DOMContentLoaded', function () {
  const centerLines = document.querySelectorAll('.center-line');

  centerLines.forEach(centerLine => {
    centerLine.addEventListener('click', function () {
      const foldable = this.closest('.foldable'); 
      const leftImg = foldable.querySelector('.left');
      const imgMotion = foldable.querySelector('.img_motion');

      if (leftImg) leftImg.style.opacity = '0';

      if (imgMotion) {
        const gif = imgMotion.querySelector('img');
        if (gif) {
          const src = gif.getAttribute('src');
          gif.setAttribute('src', src); // ✅ GIF 강제 재로딩
        }
        imgMotion.style.opacity = '1';
      }

      // ✅ 리셋 버튼 활성화
      document.querySelector('.btnReset')?.classList.add('active');

      // ✅ 버튼 상태 강제 평가
      window.forceWatchEvaluation?.();
    });
  });
});


// 2. 슬라이드 환경에 맞춘 초기화 및 버튼 상태 재조정
runAfterAppReady(() => {

  // ✅ 페이지 전환 시 리셋버튼 상태 재설정 함수
  function updateButtonStateForCurrentPage() {
    const currentPageId = document.querySelector('#app_wrap')?.getAttribute('data-current-page');
    if (!currentPageId) return;

    const currentPage = document.querySelector(`.page.${currentPageId}`);
    if (!currentPage) return;

    const isAnyFolded = [...currentPage.querySelectorAll('.foldable .left')]
      .some(el => el.style.opacity === '0');

    const btnReset = document.querySelector('.btnReset');
    if (btnReset) {
      if (isAnyFolded) {
        btnReset.classList.add('active');
      } else {
        btnReset.classList.remove('active');
      }
    }
  }

  // ✅ 페이지 슬라이드 시 버튼 상태 평가 연결
  window.addEventListener("pageSlideChange", updateButtonStateForCurrentPage);


  // ✅ 리셋 버튼 동작 정의
  window.resetCustom = function () {
    const currentPageId = document.querySelector('#app_wrap')?.getAttribute('data-current-page');
    if (!currentPageId) return;

    const currentPage = document.querySelector(`.page.${currentPageId}`);
    if (!currentPage) return;

    currentPage.querySelectorAll('.foldable').forEach(foldable => {
      const leftImg = foldable.querySelector('.left');
      const imgMotion = foldable.querySelector('.img_motion');

      if (leftImg) leftImg.style.opacity = '1';

      if (imgMotion) {
        const gif = imgMotion.querySelector('img');
        if (gif) {
          const src = gif.getAttribute('src');
          gif.setAttribute('src', src); // ✅ GIF 재초기화
        }
        imgMotion.style.opacity = '0';
      }
    });

    currentPage.querySelectorAll('.custom_check_target').forEach(input => {
      input.value = '';
    });

    // ✅ 현재 페이지 기준으로만 btnReset 상태 조정
    const isAnyFolded = [...currentPage.querySelectorAll('.foldable .left')]
      .some(el => el.style.opacity === '0');

    const btnReset = document.querySelector('.btnReset');
    if (btnReset) {
      if (isAnyFolded) {
        btnReset.classList.add('active');
      } else {
        btnReset.classList.remove('active');
      }
    }

    window.forceWatchEvaluation?.();
    console.log("🔄 현재 페이지 초기화 완료:", currentPageId);
  };

  // ✅ 버튼 상태를 감시하는 기준 설정
  defineButtonClassRules([
    {
      selector: ".foldable",
      key: "custom_check_btn_active", // 확인 버튼 상태 감지용
      test: (el) => {
        const leftImg = el.querySelector('.left');
        return leftImg && leftImg.style.opacity === '0';
      }
    },
  ]);
});
