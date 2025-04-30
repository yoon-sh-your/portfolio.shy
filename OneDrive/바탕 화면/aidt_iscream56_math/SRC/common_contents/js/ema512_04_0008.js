runAfterAppReady(() => { // 앱 준비 후 실행, jQuery 사용가능 
    console.log("custom_answer_check.js 실행");

    // 두 번째 오답 시
    window.onIncorrectTwiceCustom = function() {
        $(".ema512_04_su_0008 .contents .question_box:nth-child(2) > div:first-child > div:last-child").css("marginTop","50px")
    };
    
    // 리셋 버튼 클릭 시 실행할 커스텀 함수
    window.resetCustom = function() {
        // alert("🔄 리셋 버튼 클릭됨");
        $(".ema512_04_su_0008 .contents .question_box:nth-child(2) > div:first-child > div:last-child").css("marginTop","0px");
    };

});

