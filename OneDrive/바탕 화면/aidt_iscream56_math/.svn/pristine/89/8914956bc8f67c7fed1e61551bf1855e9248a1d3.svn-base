document.addEventListener("DOMContentLoaded", () => {
  // 회전 버튼 클릭 시 회전
  document.querySelectorAll('.btn_rotation').forEach(button => {
    button.addEventListener('click', () => {
      const container = button.closest('.po_relative');
      const svg = container?.querySelector('.drawing_grid_area svg');

      if (!svg) return;

      let currentRotation = parseInt(svg.dataset.rotation || "0", 10);
      currentRotation = (currentRotation + 90) % 360;

      svg.style.transform = `rotate(${currentRotation}deg)`;
      svg.style.transformOrigin = 'center center';
      svg.dataset.rotation = currentRotation;

      if (container) {
        if (currentRotation === 0) {
          container.classList.remove('on');
        } else {
          container.classList.add('on');
        }
      }
    });
  });

  // 제출 버튼 클릭 시 전체 회전 초기화
  const btnSubmit = document.querySelector('.btnSubmit');
  btnSubmit?.addEventListener('click', () => {
    document.querySelectorAll('.po_relative').forEach(container => {
      const svg = container.querySelector('.drawing_grid_area svg');
      if (svg) {
        svg.style.transform = 'rotate(0deg)';
        svg.style.transformOrigin = 'center center';
        svg.dataset.rotation = "0";
      }
      container.classList.remove('on');
    });
  });

  // 리셋 버튼 클릭 시, 현재 페이지에서만 회전 초기화
  const btnReset = document.querySelector('.btnReset');
  btnReset?.addEventListener('click', () => {
    const currentPageId = document.querySelector('#app_wrap')?.getAttribute('data-current-page');
    if (!currentPageId) return;

    const currentPage = document.querySelector(`.page.${currentPageId}`);
    if (!currentPage) return;

    // 현재 페이지 내 .po_relative들만 초기화
    currentPage.querySelectorAll('.po_relative').forEach(container => {
      const svg = container.querySelector('.drawing_grid_area svg');
      if (svg) {
        svg.style.transform = 'rotate(0deg)';
        svg.style.transformOrigin = 'center center';
        svg.dataset.rotation = "0";
      }
      container.classList.remove('on');
    });
  });
});

