 
 runAfterAppReady(() => { // 앱 준비 후 실행, jQuery 사용가능 
    console.log("custom_answer_check.js 실행");

 
 let showAfterSecondError = document.querySelector(".ema513_02_su_0003 .page_4 .example_box");
        // 오답 시 추가 동작
        window.onIncorrectCustom = function () {
            // alert("❗ 다시 생각해보세요.");
            showAfterSecondError.style.display = "none";
        };

        // 두 번째 오답 시
        window.onIncorrectTwiceCustom = function () {
            // alert("🚨 정답 공개됩니다!");
            showAfterSecondError.style.display = "block";
        };
       
    

    });

    