// ✅ 현재 페이지 기준으로 btnReset 활성/비활성 처리
function updateResetButtonStateGlobally() {
  const currentPage = document.querySelector('.page.on'); // 현재 활성화된 페이지
  const btnReset = document.querySelector('.btnReset');
  if (!currentPage || !btnReset) return;

  const hasCorrection = currentPage.querySelector('[data-correction="true"]') !== null;
  btnReset.classList.toggle('active', hasCorrection);
}

// ✅ center-line 클릭 처리 및 data-correction 설정
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.center-line').forEach(centerLine => {
    centerLine.addEventListener('click', function () {
      const foldable = this.closest('.foldable');
      const leftImg = foldable.querySelector('.left');
      const imgMotion = foldable.querySelector('.img_motion');

      if (leftImg) leftImg.style.opacity = '0';

      if (imgMotion) {
        const gif = imgMotion.querySelector('img');
        if (gif) {
          const src = gif.getAttribute('src');
          gif.setAttribute('src', src);
        }
        imgMotion.style.opacity = '1';
      }

      // ✅ data-correction="true" 부여
      foldable.setAttribute('data-correction', 'true');

      // ✅ 현재 페이지에만 리셋 버튼 활성화
      const currentPageId = document.querySelector('#app_wrap')?.getAttribute('data-current-page');
      if (!currentPageId) return;
      const currentPage = document.querySelector(`.page.${currentPageId}`);
      if (currentPage) updateResetButtonStateGlobally(currentPage);
      
      updateResetButtonStateGlobally();
      window.forceWatchEvaluation();
    });
  });
});


// ✅ 슬라이드 환경 초기화
runAfterAppReady(() => {

  window.resetCustom = function () {
    const currentPage = document.querySelector('.page.on');
    if (!currentPage) return;
  
    currentPage.querySelectorAll('.foldable').forEach(foldable => {
      foldable.removeAttribute('data-correction');
      const leftImg = foldable.querySelector('.left');
      const imgMotion = foldable.querySelector('.img_motion');
  
      if (leftImg) leftImg.style.opacity = '1';
      if (imgMotion) {
        const gif = imgMotion.querySelector('img');
        if (gif) {
          const src = gif.getAttribute('src');
          gif.setAttribute('src', src);
        }
        imgMotion.style.opacity = '0';
      }
    });
  
    updateResetButtonStateGlobally();
    window.forceWatchEvaluation();
  };
  

  // ✅ 슬라이드 전환 후 버튼 상태 재조정
  window.addEventListener("pageSlideChange", () => {
    setTimeout(() => {
      updateResetButtonStateGlobally();
    }, 120);
  });  

  // ✅ paging_controller 버튼 클릭 시에도 리셋 상태 재확인
  document.querySelectorAll('.paging_controller button').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        updateResetButtonStateGlobally();
      }, 120);
    });
  });
  

  defineButtonClassRules([
    {
      selector: ".foldable",
      key: "custom_check_btn_active",
      test: (el) => {
        const leftImg = el.querySelector('.left');
        return leftImg && leftImg.style.opacity === '0';
      }
    },
  ]);
});
