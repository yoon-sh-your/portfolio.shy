runAfterAppReady(() => { // 앱 준비 후 실행, jQuery 사용가능 
    console.log("custom_answer_check.js 실행");
 
    let showAfterSecondError2 = document.querySelector(".ema513_02_su_0004 .page_2 .example_box");
    let showAfterSecondError3 = document.querySelector(".ema513_02_su_0004 .page_3 .example_box");
    // 오답 시 추가 동작
    window.onIncorrectCustom = function () {
        // alert("❗ 다시 생각해보세요.");

        showAfterSecondError2.style.display = "none";
        showAfterSecondError3.style.display = "none";
    };

    // 두 번째 오답 시
    window.onIncorrectTwiceCustom = function () {
        // alert("🚨 정답 공개됩니다!");
    
        showAfterSecondError2.style.display = "block";
        showAfterSecondError3.style.display = "block";
    };
       
    

    });


    