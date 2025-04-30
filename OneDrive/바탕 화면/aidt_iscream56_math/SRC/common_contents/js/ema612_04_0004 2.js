runAfterAppReady(() => {

    // 채점 대상: boolean_wrap 안의 버튼들 중 하나 이상 선택된 div들
    window.getCustomTargets = function(page) {
        const targets = $(page).find(".page .boolean_wrap").filter((i, el) => {
            return $(el).find("button.selected").length > 0;
        });
        return targets;
    };
    

    // 커스텀 채점 조건
    window.customCheckCondition = function(el) {
        let $wrap = $(el);
    
        // el이 button인 경우 .page .boolean_wrap까지 올라가기
        if (!$wrap.hasClass("boolean_wrap")) {
            $wrap = $wrap.closest(".page .boolean_wrap");
        }
    
        const $selected = $wrap.find("button.selected");
        const $correct = $wrap.find("button[data-answer-single='true']");
    
        if ($selected.length === 0) {
            return "empty";
        }
    
        if ($selected.length !== $correct.length) {
            return false;
        }
    
        const isAllCorrect = $selected.toArray().every(btn =>
            $(btn).data("answerSingle") === true
        );
    
        return isAllCorrect;
    };
    

    // 리셋 버튼 클릭 시
    window.resetCustom = function() {
        $(".page .boolean_wrap button").removeClass("selected hint");
        $('.btnSample').removeClass('active');
    };

    document.querySelectorAll(".page .boolean_wrap button").forEach(button => {
        button.addEventListener("click", () => {
            // 선택 토글
            button.classList.toggle("selected");
            if($(".sampleview .selected").length > 0){
                $('.btnSample').addClass('active');
            }
    
            // 강제로 input 이벤트 발생시켜 조건 평가 유도
            button.dispatchEvent(new Event("input", { bubbles: true }));
        });
    });

    /* 예시버튼 */
    document.querySelectorAll('.btnSample').forEach(function(btn) {
        btn.removeEventListener('click', sampleClick); // 기존 이벤트 제거
        btn.addEventListener('click', sampleClick);
    });
    
    function sampleClick() {
        document.querySelectorAll('.sampleview button').forEach(function(button) {
            if (button.getAttribute('data-answer-single') === "true") {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    }

    let incorrectCount = 0; // 오답 시도 횟수 추적용

document.querySelectorAll('.btnCheck').forEach(function(btn) {
    const originalAction = function () {
        console.log('✅ 원래 btnCheck 동작 실행됨!');

        // hint 처리
        document.querySelectorAll('.textAnswer').forEach(function(section) {
            const hasHint = section.querySelector('button.hint');
            if (hasHint) {
                section.querySelectorAll('button').forEach(function(button) {
                    button.classList.add('hint', 'selected');
                });

                section.querySelectorAll('math-field').forEach(function(mathField) {
                    const answer = mathField.getAttribute('data-answer');
                    if (answer) {
                        mathField.value = answer;
                        mathField.classList.add('correct');
                    }
                });
            }
        });
    };

    btn.addEventListener('click', function (event) {
        event.preventDefault();

        // ✅ 오답 상태 체크
        const hasSelectedWait = document.querySelector('.textAnswer button.selectedWait');
        if (hasSelectedWait) {
            incorrectCount++;

            if (incorrectCount < 3) {
                typeof onIncorrect === 'function' && onIncorrect();
                console.log('❌ 첫 번째 오답 처리 onIncorrect() 실행');
            } else {
                typeof onIncorrectTwice === 'function' && onIncorrectTwice();
                console.log('❌ 두 번째 이상 오답 처리 onIncorrectTwice() 실행');
            }
        }

        // selectedWait → selected 전환
        document.querySelectorAll('.textAnswer button.selectedWait').forEach(function(button) {
            if (button.getAttribute('data-answer-single') === "true") {
                const parentItem = button.closest('.c_item');
                const mathField = parentItem.querySelector('math-field');

                const correctAnswer = mathField.getAttribute('data-answer');
                const userInput = mathField.value.trim();

                if (userInput === correctAnswer) {
                    button.classList.remove('selectedWait');
                    button.classList.add('selected');
                }
            }
        });

        // hint 처리 및 나머지 실행
        originalAction();
    });
});

    
    
    
    

    document.querySelectorAll('.textAnswer button').forEach(function(button) {
        button.addEventListener('click', function () {
            // 정답 후보인 버튼만 처리
            if (button.getAttribute('data-answer-single') === "true") {
                // 만약 selectedWait 상태에서 다시 클릭된 경우 → 전체 해제
                if (button.classList.contains('selectedWait')) {
                    button.classList.remove('selectedWait');
                    button.classList.remove('selected');
                    console.log('❌ 선택 해제됨 (selectedWait & selected 제거)');
                } else {
                    // 그 외는 선택 대기 상태로
                    button.classList.remove('selected'); // 혹시 남아있을 수도 있으니 제거
                    button.classList.add('selectedWait');
                    console.log('⏳ 선택 대기 상태로 변경 (selectedWait 추가)');
                }
    
                // 👉 클릭 후 클래스 상태 확인하여 버튼 활성화
                const anySelected = document.querySelector('.textAnswer button.selected, .textAnswer button.selectedWait');
                if (anySelected) {
                    document.querySelector('.btnCheck')?.classList.add('active');
                    document.querySelector('.btnReset')?.classList.add('active');
                } else {
                    document.querySelector('.btnCheck')?.classList.remove('active');
                    document.querySelector('.btnReset')?.classList.remove('active');
                }
            }
        });
    });
    
    
    

    document.querySelectorAll('math-field').forEach(function(mathField) {
        mathField.addEventListener('input', function () {
            const parentItem = mathField.closest('.c_item');
            const button = parentItem.querySelector('button');
    
            // 만약 selectedWait 상태라면 다시 검사
            if (button && button.classList.contains('selectedWait') && button.getAttribute('data-answer-single') === "true") {
                const correctAnswer = mathField.getAttribute('data-answer');
                const userInput = mathField.value.trim();
    
                if (userInput === correctAnswer) {
                    button.classList.remove('selectedWait');
                    button.classList.add('selected');
                    console.log(`✅ 입력 후 정답 확인됨 (${userInput})`);
                } else {
                    // 오답일 경우 selectedWait 유지 (또는 오답 피드백 가능)
                    console.log(`❌ 입력 후에도 오답 (${userInput})`);
                }
            }
        });
    });
    
    document.querySelectorAll('.btnReset').forEach(function(resetBtn) {
        resetBtn.addEventListener('click', function () {
            // 기존 이벤트 루틴이 모두 끝난 후 실행
            setTimeout(() => {
                // 선택 클래스 모두 제거
                document.querySelectorAll('.textAnswer button').forEach(function(button) {
                    button.classList.remove('selected', 'selectedWait');
                });
    
                // 버튼 비활성화
                resetBtn.classList.remove('active');
                document.querySelector('.btnCheck')?.classList.remove('active');
    
                console.log('🔄 기존 이벤트 이후 selected/selectedWait 초기화 완료');
            }, 0);
        });
    });
    
    
    
    
    

    // 버튼 활성화 제어: 하나라도 선택되었을 때 활성화
    defineButtonClassRules([
        {
            selector: ".page .boolean_wrap button",
            test: el => {
                const $wrap = $(el).closest(".page .boolean_wrap");
                const selectedCount = $wrap.find("button.selected, button.selectedWait").length;
                const isActive = selectedCount > 0;
                return isActive;
            },
            setClass: [
                { target: ".btnCheck", class: "active" },
                { target: ".btnReset", class: "active" }
            ]
        }
    ]);
    
    
    // 제출 전 유효성 검사
    window.customValidateBeforeSubmit = function({ hasEmpty, isSelfCheckMissing, rules }) {
        console.log("📋 제출 전 검사");
        if (hasEmpty) {
            alert("⚠️ 선택하지 않은 항목이 있어요!");
            return false;
        }
        return true;
    };
});