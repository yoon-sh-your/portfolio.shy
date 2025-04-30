window.addEventListener('DOMContentLoaded', () => {
  const figures = document.querySelectorAll('.boolean_wrap .figure');
  const rotateButtons = document.querySelectorAll('.rotation_buttons .btn_rotation');

  rotateButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const figure = figures[index];
      const img = figure.querySelector('img');
      if (!img) return;

      let currentRotation = parseInt(img.getAttribute('data-rotation')) || 0;
      currentRotation = (currentRotation + 90) % 360;

      img.style.transform = `rotate(${currentRotation}deg)`;
      img.setAttribute('data-rotation', currentRotation);
    });
  });

  const btnSample = document.querySelector('.btnSample');
  if (btnSample) {
    btnSample.addEventListener('click', () => {
      const targetFigures = document.querySelectorAll('[data-answer-single="true"]');
    
      // ✅ 클릭 시점의 selected 상태를 클래스명 기준으로 Map에 저장
      const selectedStateMap = new Map();
    
      targetFigures.forEach(el => {
        const className = [...el.classList].find(cls => /^figure\d+$/.test(cls));
        if (!className) return;
    
        const isSelected = el.classList.contains('selected');
        selectedStateMap.set(className, isSelected);
      });
    
      setTimeout(() => {
        const exampleBox = document.querySelector('.example_box');
    
        targetFigures.forEach(el => {
          const className = [...el.classList].find(cls => /^figure\d+$/.test(cls));
          if (!className) return;
    
          if (exampleBox?.classList.contains('on')) {
            // ✅ on 상태: 모두 selected + correct
            el.classList.add('selected', 'correct');
          } else {
            // ✅ off 상태: 초기 상태 기반으로 조건 처리
            if (selectedStateMap.get(className)) {
              // 🔹 원래 selected였던 경우: correct만 제거
              el.classList.remove('correct');
            } else {
              // 🔹 원래 selected가 없었던 경우: 둘 다 제거
              el.classList.remove('selected', 'correct');
            }
          }
        });
      }, 10);
    });      
  }
});
