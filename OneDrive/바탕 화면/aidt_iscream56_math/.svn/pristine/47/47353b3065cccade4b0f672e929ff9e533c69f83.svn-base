runAfterAppReady(() => {
    // 앱 준비 후 실행, jQuery 사용가능
    console.log("custom_answer_check.js 실행");

    let showAfterSecondError = document.querySelector(".ema512_02_su_0005 .page_2 .example_box");
    let removeActive = document.querySelector(".btn_area .btnCheck");

    // 정답 시 추가 동작
    window.onCorrectCustom = function () {
        let slideIdx = $("#app_wrap").attr("data-current-page");
        if (slideIdx === "page_2") {
            $(".page_2 .example_box").css("opacity", "1");
        }
        showAfterSecondError.style.display = "block";
    };

    // 오답 시 추가 동작
    window.onIncorrectCustom = function () {
        // alert("❗ 다시 생각해보세요.");
        showAfterSecondError.style.display = "none";
        removeActive.classList.remove("close");
    };

    // 두 번째 오답 시
    window.onIncorrectTwiceCustom = function () {
        // alert("🚨 정답 공개됩니다!");
        showAfterSecondError.style.display = "block";
        $(".page_2 .example_box").css("opacity", "1");
        // $(".page_2 .boolean_wrap").css("pointer-events", "none");
    };

    // 리셋 버튼 클릭 시 실행할 커스텀 함수
    window.resetCustom = function () {
        // alert("🔄 리셋 버튼 클릭됨");
        // $(".page_2 .boolean_wrap").css("pointer-events", "auto");
        $(".page_2 .example_box").css("opacity", "0");
    };

    window.customCheckCondition = function () {
        let slideIdx = $("#app_wrap").attr("data-current-page");
        if (slideIdx === "page_2") {
            const mathField = document.querySelector(".input_wrap math-field.textarea");
            const value = mathField && (typeof mathField.getValue === "function" ? mathField.getValue() : mathField?.value || "");
            const isFilled = !!(value && value.trim() !== "");

            let boolanBtn = $(".boolean_wrap button").hasClass("selected");
            console.log(boolanBtn);

            if (!isFilled || !boolanBtn) {
                return "empty";
            }

            function checkSelectedAnswers() {
                const selectedElements = document.querySelectorAll(".selected");

                // 요소가 없는 경우 false 반환
                if (selectedElements.length === 0) return false;

                // 모든 요소 체크
                for (const element of selectedElements) {
                    const answer = element.getAttribute("data-answer-single");
                    if (answer !== "true") {
                        // 문자열 비교 (대소문자 구분)
                        return false;
                    }
                }

                return true;
            }

            // 사용 예시
            const result = checkSelectedAnswers();

            return result;
        } else {
            const mathFields = document.querySelectorAll(`.${slideIdx} math-field[data-answer-single]`);

            let hasEmpty = false;
            const values = [];

            mathFields.forEach((field) => {
                const value = (typeof field.getValue === "function" ? field.getValue() : field?.value || "").trim();

                if (!value) hasEmpty = true;
                values.push({
                    element: field,
                    value: value,
                    answer: field.dataset.answerSingle?.trim() || "",
                });
            });

            if (hasEmpty) return "empty";

            function parseMathfieldValue(val) {
                return val.replace(/\\text\{([^}]*)\}/g, "$1").trim();
            }

            for (const item of values) {
                const parsedValue = parseMathfieldValue(item.value);
                if (parsedValue !== item.answer) {
                    return false;
                }
            }

            return true;
        }
    };
});
