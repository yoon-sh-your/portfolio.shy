runAfterAppReady(() => {
    console.log("custom_answer_check.js 실행");

    // 리셋 버튼 클릭 시 실행할 커스텀 함수
    window.resetCustom = function() {
        console.log("리셋 버튼 클릭");
        // 커스텀 셀렉트 초기화
        document.querySelectorAll(".custom_select").forEach(select => {
            const trigger = select.querySelector(".select_trigger");
            if (trigger) {
                trigger.setAttribute("data-value", "");
                trigger.textContent = "";
            }
        });

        // 모든 입력 필드 초기화
        document.querySelectorAll("math-field[data-answer-single]").forEach(field => {
            field.setAttribute("data-answer-single", "");
        });

        // 드롭다운 초기화
        document.querySelectorAll(".custom_dropdown").forEach(dropdown => {
            dropdown.classList.remove("hint", "disabled");
            dropdown.removeAttribute("disabled");
        });
        //선택 스타일 초기화
        document.querySelectorAll(".dropdown_wrap .select_options li").forEach(li => {
            li.removeAttribute("style"); 
          });

        return false;
    };

    // 제출 버튼 클릭 시 커스텀 검증 로직
    window.customValidateBeforeSubmit = function({ hasEmpty, isSelfCheckMissing, rules }) {
        console.log("제출 버튼 클릭");
        const inputs = pagenation.activePage.querySelectorAll("[data-answer-single]");
        inputs.forEach(input => {
            if(input.dataset.correction == "false"){
                input.classList.add("hint");
            }
        });
        return true;
    };

    document.querySelectorAll(".problem_generator2").forEach(generator => {
        console.log("problem_generator2 초기화");
        
        const updateInputsByCombo2 = () => {
            console.log("updateInputsByCombo2 함수 실행");
            
            // 커스텀 셀렉트에서 선택된 값들 가져오기
            const customSelects = generator.querySelectorAll(".custom_select");
            console.log("커스텀 셀렉트 개수:", customSelects.length);
            
            const values = Array.from(customSelects).map(select => {
                const trigger = select.querySelector(".select_trigger");
                const value = trigger ? trigger.getAttribute("data-value") : "";
                console.log("선택된 옵션:", value || "없음");
                return value || "";
            });

            if (values.includes("")) {
                console.log("선택되지 않은 드롭다운이 있음");
                return;
            }

            console.log("선택된 값들:", values);

            // 선택된 순서대로 문장 생성
            const sentences = {
                "㉠": "색종이 24장이 있습니다.",
                "㉡": "색종이 8장을 더 받았습니다.",
                "㉢": "4명이 똑같이 나누어 가졌습니다.",
                "㉣": "12장을 동생에게 주었습니다."
            };

            // 문장 조합
            const fullSentence = ["㉠", ...values].map(key => sentences[key]).join(" ");
            console.log("생성된 문장:", fullSentence);

            // 조합 키 생성 (㉡,㉢,㉣ → 1,2,3 변환)
            const comboKey = values.map(v => v.replace("㉡", "1").replace("㉢", "2").replace("㉣", "3")).join("-");
            console.log("조합 키:", comboKey);
            
            const match = generator.querySelector(`.combo_map [data-combo="${comboKey}"]`);
            console.log("매칭된 조합:", match);

            // 각 입력 필드 찾기
            const sentenceInput = generator.querySelector(".sentence_input");
            const textInput = generator.querySelector(".text_input");
            const formulaInput = generator.querySelector(".formula_input");
            
            console.log("입력 필드 상태:", {
                sentenceInput: !!sentenceInput,
                textInput: !!textInput,
                formulaInput: !!formulaInput
            });

            if (match) {
                // 1. 문장 입력 필드 업데이트
                if (sentenceInput) {
                    sentenceInput.setAttribute("data-answer-single", fullSentence);
                    console.log("문장 입력 필드 업데이트:", fullSentence);
                }
                
                // 2. 수식 입력 필드 업데이트
                if (textInput) {
                    const textValue = match.dataset.text || "";
                    textInput.setAttribute("data-answer-single", textValue);
                    console.log("수식 입력 필드 업데이트:", textValue);
                }
                
                // 3. 답 입력 필드 업데이트
                if (formulaInput) {
                    const formulaValue = match.dataset.formula || "";
                    formulaInput.setAttribute("data-answer-single", formulaValue);
                    console.log("답 입력 필드 업데이트:", formulaValue);
                }
            } else {
                console.log("매칭되는 조합이 없음");
                // 매칭되는 조합이 없으면 모든 필드 초기화
                if (sentenceInput) sentenceInput.setAttribute("data-answer-single", "");
                if (textInput) textInput.setAttribute("data-answer-single", "");
                if (formulaInput) formulaInput.setAttribute("data-answer-single", "");
            }
        };

        // 커스텀 셀렉트 변경 이벤트 리스너
        generator.addEventListener("click", (e) => {
            const option = e.target.closest("li[data-value]");
            if (!option) return;

            const customSelect = option.closest(".custom_select");
            if (!customSelect) return;

            console.log("커스텀 셀렉트 옵션 선택:", option.getAttribute("data-value"));

            // 선택된 값들을 가져옴
            const selectedValues = Array.from(generator.querySelectorAll(".select_trigger"))
                .map(trigger => trigger.getAttribute("data-value"))
                .filter(value => value);

            // 다른 커스텀 셀렉트의 옵션들 업데이트
            generator.querySelectorAll(".custom_select").forEach(select => {
                if (select !== customSelect) {
                    select.querySelectorAll("li[data-value]").forEach(opt => {
                        if (selectedValues.includes(opt.getAttribute("data-value"))) {
                            opt.style.display = "none";
                        } else {
                            opt.style.display = "";
                        }
                    });
                }
            });

            // 값이 변경된 후에 업데이트
            setTimeout(updateInputsByCombo2, 0);
        });

        // 초기 실행
        console.log("초기 실행");
        updateInputsByCombo2();
    });
});

