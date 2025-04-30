document.addEventListener('DOMContentLoaded', function () {
    const btnCheck = document.querySelector('.btn_area .btnCheck');
    const stars = document.querySelectorAll('.stars .star');
  
    function updateBtnCheck() {
      const hasActive = document.querySelector('.stars .star.active');
      if (hasActive) {
        btnCheck?.classList.add('active');
      } else {
        btnCheck?.classList.remove('active');
      }
    }
  
    // 각 .star 요소를 감시
    stars.forEach(star => {
      const observer = new MutationObserver(updateBtnCheck);
      observer.observe(star, { attributes: true, attributeFilter: ['class'] });
    });
  
    // 로딩 시에도 확인
    updateBtnCheck();
  });
  