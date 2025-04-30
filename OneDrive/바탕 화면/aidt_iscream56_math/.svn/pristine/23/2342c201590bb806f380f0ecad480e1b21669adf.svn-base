
runAfterAppReady(() => {
    // 앱 준비 후 실행, jQuery 사용가능
    console.log("custom_answer_check.js 실행");
  
    // 리셋 버튼 클릭 시 실행할 커스텀 함수
    window.resetCustom = function () {
      let targetInfoImg = document.querySelectorAll(".etc_img");
      for (let i = 0; i < targetInfoImg.length; i++) {
        targetInfoImg[i].style.display = "none";
      }
      summarizeIndex1 = 0;
      summarizeIndex2 = 0;
    };
  
    let summarizeBtn1 = document.querySelectorAll(".reveal_btn")[0];
  
    let summarizeIndex1 = 0;
    let targetInfoImg = document.querySelector(".etc_img");
  
    summarizeBtn1.addEventListener("click", function () {
      if (summarizeIndex1 === 0) {
        summarizeIndex1 = (summarizeIndex1 + 1) % 2;
        showTeacher();
      } else if (summarizeIndex1 === 1) {
        summarizeIndex1 = 0;
        targetInfoImg.style.display = "none";
      }
  
    });
  
    function showTeacher() {
      if (summarizeIndex1 === 1) {
          targetInfoImg.style.display = "block";
      }else{
          targetInfoImg.style.display = "none";
      }
    }
  
    let showTeacherCheck = document.querySelector(".etcImgOn");
    showTeacherCheck.addEventListener('click', function(){
      summarizeIndex1 = 1;
      showTeacher();
    })
  
  });