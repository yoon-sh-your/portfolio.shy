document.addEventListener('DOMContentLoaded', function () {
  const rotationButton = document.querySelector('.btn_rotation');
  const resetButton = document.querySelector('.btnReset');
  const drawingGridArea = document.querySelector('.drawing_grid_area.line_ro');
  const rotationWrap = document.querySelector('.rotation');

  let rotationAngle = 0;

  if (rotationButton) {
    rotationButton.addEventListener('click', function () {
      rotationAngle = (rotationAngle + 90) % 360;
      drawingGridArea.style.transform = `rotate(${rotationAngle}deg)`;

      if (rotationWrap) {
        if (rotationAngle === 0) {
          rotationWrap.classList.remove('on'); // 360도 회전 시 클래스 제거
        } else {
          rotationWrap.classList.add('on'); // 회전 중이면 클래스 추가
        }
      }
    });
  } else {
    console.error('회전 버튼을 찾을 수 없습니다.');
  }

  if (resetButton) {
    resetButton.addEventListener('click', function () {
      const currentPageId = document.querySelector('#app_wrap')?.getAttribute('data-current-page');

      // 🔸 페이지 ID 조건 수정 필요 시 아래 변경
      if (currentPageId === 'page_4') {
        rotationAngle = 0;
        drawingGridArea.style.transform = 'rotate(0deg)';
        if (rotationWrap) rotationWrap.classList.remove('on');
      }
    });
  }
});
