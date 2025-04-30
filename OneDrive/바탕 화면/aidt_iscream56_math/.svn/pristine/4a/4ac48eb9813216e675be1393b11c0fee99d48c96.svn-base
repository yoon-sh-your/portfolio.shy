document.addEventListener("DOMContentLoaded", function() {
  const imgLeft = document.querySelector(".img_left");
  const lineChk = document.querySelector(".line_chk");  // line_chk 요소
  const imgRight = document.querySelector(".img_right");
  const dotWrap = document.querySelector(".dot_wrap");
  const txt7 = document.querySelector(".txt_7");
  const txt8 = document.querySelector(".txt_8");
  const dot3 = document.querySelector(".dot3");
  const dot4 = document.querySelector(".dot4");
  const btnReset = document.querySelector(".btnReset");

  // img_left 클릭 시 line_chk에 folded 클래스 추가 및 img_right가 붉은 선을 기준으로 대칭으로 접히도록 설정
  imgLeft.addEventListener("click", function() {
      lineChk.classList.toggle("folded");

      // img_right 대칭 접기 및 dot3, dot4, txt_7, txt_8 숨기기
      if (lineChk.classList.contains("folded")) {
          // dot3.classList.add("hidden");
          // dot4.classList.add("hidden");
          // txt7.classList.add("hidden");
          // txt8.classList.add("hidden");

          // btnReset 활성화
          btnReset.classList.add("active");
      } else {
          // btnReset 비활성화
          btnReset.classList.remove("active");
      }
  });

  // btnReset 클릭 시 초기화
  btnReset.addEventListener("click", function() {
      // line_chk에서 folded 클래스 제거
      lineChk.classList.remove("folded");

      // img_right 펼치기
      // dot3.classList.remove("hidden");
      // dot4.classList.remove("hidden");
      // txt7.classList.remove("hidden");
      // txt8.classList.remove("hidden");

      // btnReset 비활성화
      btnReset.classList.remove("active");
  });
});
