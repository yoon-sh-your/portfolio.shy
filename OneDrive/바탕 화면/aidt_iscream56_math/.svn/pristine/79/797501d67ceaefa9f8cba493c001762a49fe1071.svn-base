runAfterAppReady(() => { // 앱 준비 후 실행, jQuery 사용가능 
    console.log("custom_answer_check.js 실행");

    // 리셋 버튼 클릭 시 실행할 커스텀 함수
    window.resetCustom = function() {
    $(".option_group input").prop("checked", false);
    };

    // 제출 버튼 클릭 시 커스텀 검증 로직
    window.customValidateBeforeSubmit = function({ hasEmpty, isSelfCheckMissing, rules }) {
        const inputs = pagenation.activePage.querySelectorAll("[data-answer-single]");

        inputs.forEach(input => {
            if(input.dataset.correction == "false"){
                input.classList.add("hint");
            }
        });

        return true; // 기본 로직 계속 실행
    };
});

