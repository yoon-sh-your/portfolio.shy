runAfterAppReady(() => {
    window.customCheckCondition = function () {
        let slideIdx = $("#app_wrap").attr("data-current-page");
        if (slideIdx === "page_2") {
            // 첫 번째 필드
            const mathField = document.querySelector(".input_wrap math-field.textarea");
            const value = mathField && (typeof mathField.getValue === "function" ? mathField.getValue() : mathField?.value || "");
            const isFilled = !!(value && value.trim() !== "");
            const exampleBox = document.querySelector('.example_box');
            const button = document.querySelector('.btnCheck');
            const page = document.querySelector('.page_2');

            // 두 번째 필드들 (여러 개의 answer-field)
            const mathFields2 = document.querySelectorAll(".input_wrap math-field.answer-field");
            let isFilled2 = true;
            let allCorrect = true;

            // \text{...} 제거 함수
            function parseMathfieldValue(val) {
                return val.replace(/\\text\{([^}]*)\}/g, "$1").trim();
            }

            mathFields2.forEach(field => {
                const value2 = field && (typeof field.getValue === "function" ? field.getValue() : field?.value || "");
                if (!value2 || value2.trim() === "") {
                    isFilled2 = false;
                    return;
                }

                const parsedValue2 = parseMathfieldValue(value2);
                const answer = field?.dataset?.answerSingle ?? field?.getAttribute("data-answer-single") ?? "";
                
                if (parsedValue2 !== answer.trim()) {
                    allCorrect = false;
                }
            });

            if (!isFilled || !isFilled2) {
                return "empty";
            }

            if (allCorrect) {
                page.querySelectorAll(".example_box").forEach(el => el.classList.add("on"));
                if (!button.classList.contains("btnCheck")) {
                    button.classList.add("close");
                }
                return true;
            } else {
                if (globalFaultCount > 0) {
                    page.querySelectorAll(".example_box").forEach(el => el.classList.add("on"));
                }
                return false;
            }
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
