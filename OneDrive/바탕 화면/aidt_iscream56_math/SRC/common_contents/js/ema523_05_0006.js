document.addEventListener("DOMContentLoaded", function() {
    const imgLeft = document.querySelector(".img_left");
    const lineChk = document.querySelector(".line_chk");  // line_chk 요소
    const btnReset = document.querySelector(".btnReset");
  
    // img_left 클릭 시 line_chk에 folded 클래스 추가 및 img_right가 붉은 선을 기준으로 대칭으로 접히도록 설정
    imgLeft.addEventListener("click", function() {
        lineChk.classList.toggle("folded");
  
        if (lineChk.classList.contains("folded")) {
  
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
  
        // btnReset 비활성화
        btnReset.classList.remove("active");
    });
  });
  