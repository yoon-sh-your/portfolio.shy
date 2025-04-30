document.addEventListener('DOMContentLoaded', function() {
  // 페이지 3의 버튼 이벤트 처리
  const page3 = document.querySelector('.page_3');
  if (page3) {
    // arr_btn1 클릭 시 col2에 active 클래스 추가
    const arrBtn1 = page3.querySelector('.col1 .btn_arr');
    if (arrBtn1) {
      arrBtn1.addEventListener('click', function() {
        const col2 = page3.querySelector('.col2');
        if (col2) {
          col2.classList.add('active');
        }
      });
    }

    // arr_btn2 클릭 시 col3에 active 클래스 추가
    const arrBtn2 = page3.querySelector('.col2 .btn_arr');
    if (arrBtn2) {
      arrBtn2.addEventListener('click', function() {
        const col3 = page3.querySelector('.col3');
        if (col3) {
          col3.classList.add('active');
        }
      });
    }
  }
});
