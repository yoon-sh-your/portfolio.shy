
let countClickIndex1 = 0;
let countClickIndex2 = 0;



function addInfoImg() {
  // let revealBtn = document.querySelectorAll(".reveal_btn");
  // for (let i = 0; i < revealBtn.length; i++) {
  //   revealBtn[i].classList.add("on");
  // }
  let targetInfoImg = document.querySelectorAll(".etc_img");
  for (let i = 0; i < targetInfoImg.length; i++) {
    targetInfoImg[i].style.display = "block";
  }
}


//summarize버튼이 다 노출 될 때만 그림노출
// let countClickIndex = 0;
function countClick(el) {
  console.log(el);
  // el.classList.add('on');
  // countClickIndex++;

  let countOnClass = document.querySelectorAll(".reveal_btn.on");
  console.log(countOnClass.length);

  if (countOnClass.length === 1) {
    addInfoImg();
   
  } else if (countOnClass.length !== 1) {
    // el.classList.remove('on');
    let targetInfoImg = document.querySelector(".etc_img");
    targetInfoImg.style.display = "none";
  }
  console.log(countOnClass.length);
  // let targetInfoImg = document.querySelectorAll(".etc_img");
  // countClickIndex++;
  // if(countClickIndex % 2 === 0 ){
  //     addInfoImg();
  //     console.log("hihi")
  // }else if(countClickIndex % 2 === 1){
  //     let targetInfoImg = document.querySelectorAll(".etc_img");
  //     for(let i = 0; i < targetInfoImg.length; i++){
  //         targetInfoImg[i].style.display = "none";
  //     }
  // }

  if(el.classList.contains("etcImgOn")){
    addInfoImg();
  }
}

runAfterAppReady(() => {
  // 앱 준비 후 실행, jQuery 사용가능
  console.log("custom_answer_check.js 실행");

  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function () {
    // alert("🔄 리셋 버튼 클릭됨");
    // let revealBtn = document.querySelectorAll(".reveal_btn");
    //     for(let i = 0; i < targetInfoImg.length; i++){
    //         revealBtn[i].classList.remove('on');
    //     }
    // };
    let targetInfoImg = document.querySelectorAll(".etc_img");
    for (let i = 0; i < targetInfoImg.length; i++) {
      targetInfoImg[i].style.display = "none";
    }
  };

  console.log("always one---------------------------------");

    // let revealBtn = document.querySelectorAll(".reveal_btn");
    // let revealClass1 = revealBtn[0].classList;
    // let revealClass2 = revealBtn[1].classList;

    // function showEtcImg(){
    //     $('.etc_img').css("display","block");
    // }
    // function hideEtcImg(){
    //     $('.etc_img').css("display","none");
    // }
    
    // for(let i = 0; i < revealBtn.length; i++){
    //     revealBtn[i].addEventListener("click", function(){
    //         if(revealClass1[1] === 'on' && revealClass2[1] === 'on'){
    //             hideEtcImg();
    //             console.log('state 1')
    //         }else if(revealClass1[1] !== 'on' && revealClass2[1] !== 'on'){
    //             hideEtcImg();
    //             console.log('state 2')
    //         }else if(revealClass1[1] !== 'on' || revealClass2[1] !== 'on'){
    //             showEtcImg();
    //             console.log('state 3')
    //         }
    
    //     }) 
    // }


    const buttons = document.querySelectorAll('.reveal_btn');
    const etcImg = document.querySelector('.etc_img');
    
    // buttons.forEach(btn => {
    //   btn.addEventListener('click', () => {
       
    
    //     // 두 reveal_btn 모두 on 상태인지 확인
    //     const allOn = Array.from(buttons).every(b => b.classList.contains('on'));
    //     console.log(allOn)
    //     // etc_img 표시 여부 제어
    //     etcImg.style.display = allOn ? 'block' : 'none';
    //     btn.classList.toggle('countOn');
    //   });
    // });
    console.log(buttons)


    // $('.reveal_btn').on('click', function() {
    //     $(this).toggleClass('countOn');
    
    //     // on 클래스가 붙은 버튼이 하나만 있는지 확인
    //     const onCount = $('.reveal_btn.on').length;
    
    //     if (onCount === 1) {
    //       $('.etc_img').css('display', 'block');
    //     } else {
    //       $('.etc_img').css('display', 'none');
    //     }
    //   });



    // $('.reveal_btn').on('click', function() {
    //     $(this).toggleClass('countOn');

    //     // 두 버튼 모두 on 클래스가 있는지 확인
    //     const allOn = $('.reveal_btn').length === $('.reveal_btn.on').length;
    //     console.log(allOn)
    //     // 조건에 따라 이미지 표시
    //     if (allOn) {
    //     $('.etc_img').css('display', 'block');
    //     } else {
    //     $('.etc_img').css('display', 'none');
    //     }
    // });

});
