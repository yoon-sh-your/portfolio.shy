
//summarize버튼 클릭에 따라서 박스내 글자 노출-css문제때문에 따로 조절
let countClickIndex = 0;
function countClick(){
    let targetInfoImgOnlySubmit = document.querySelectorAll(".etc_img");
    let targetInfoImg = document.querySelectorAll(".reveal_btn .answerWrap");
    let targetReveal = document.querySelector(".reveal_btn");
    countClickIndex++;
    if(countClickIndex % 2 === 0 ){
      for(let i = 0; i < targetInfoImg.length; i++){
        targetInfoImgOnlySubmit[i].style.display = "none";
          targetInfoImg[i].style.opacity = "0";
          targetReveal.classList.remove('on');
      }
    }else if(countClickIndex % 2 === 1){
      for(let i = 0; i < targetInfoImg.length; i++){
        targetInfoImgOnlySubmit[i].style.display = "block";
        targetInfoImg[i].style.opacity = "1";
        targetReveal.classList.add('on');
    }  
    }
}

runAfterAppReady(() => { // 앱 준비 후 실행, jQuery 사용가능 
  console.log("custom_answer_check.js 실행");

  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function() {
      // alert("🔄 리셋 버튼 클릭됨");

      let targetInfoImgOnlySubmit = document.querySelectorAll(".etc_img");
      let targetInfoImg = document.querySelectorAll(".reveal_btn .answerWrap");
      for(let i = 0; i < targetInfoImgOnlySubmit.length; i++){
          targetInfoImgOnlySubmit[i].style.display = "none";
          targetInfoImg[i].style.opacity = "0";
      }
  };

});