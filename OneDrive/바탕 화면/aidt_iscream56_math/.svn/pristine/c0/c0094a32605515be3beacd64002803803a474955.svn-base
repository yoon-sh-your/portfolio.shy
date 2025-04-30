runAfterAppReady(() => {
    window.customCheckCondition = function () {
        let slideIdx = $("#app_wrap").attr("data-current-page");
        if (slideIdx === "page_8") {
            const dropdown = document.querySelector(".custom_dropdown");
            const exampleBox = document.querySelector('.example_box');
            const button = document.querySelector('.btnCheck');
            const page = document.querySelector('.page_8');
            
            if (dropdown && exampleBox && button && page) {
                const value = dropdown.value;
                const answer = dropdown.getAttribute("data-answer-single");
                
                if (value === answer) {
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
            }
            
            return "empty";
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