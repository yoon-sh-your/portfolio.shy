// 리셋 관련 함수들
window.resetInputFields = function () {
    const page = pagenation.activePage;
    page.querySelectorAll("math-field").forEach(field => {
        field.value = "";
    });
};

window.resetCardFlip = function () {
    const page = pagenation.activePage;
    page.querySelectorAll(".card").forEach(card => {
        card.classList.remove("flip");
    });
};

window.resetRevealSystem = function () {
    const page = pagenation.activePage;
    page.querySelectorAll(".reveal_btn").forEach(btn => {
        btn.classList.remove("on");
    });
};

window.resetBooleanBtn = function () {
    const page = pagenation.activePage;
    page.querySelectorAll(".boolean_wrap > button").forEach(btn => {
        btn.classList.remove("selected", "hint", "correct", "incorrect");
    });
};

window.resetBooleanCount = function () {
    const page = pagenation.activePage;
    page.querySelectorAll(".boolean_count_wrap > button").forEach(btn => {
        btn.classList.remove("selected", "hint", "correct", "incorrect");
    });
};

window.resetDragGroupValue = function () {
    const page = pagenation.activePage;
    page.querySelectorAll("[data-drag-group]").forEach(group => {
        group.removeAttribute("data-correction");
        group.classList.remove("correct", "incorrect");
    });
};

window.resetSelfCheckRadioGroups = function () {
    const page = pagenation.activePage;
    page.querySelectorAll(".self_check_radio").forEach(radio => {
        radio.checked = false;
        radio.closest(".radio_group") ?.classList.remove("correct", "incorrect");
    });
};

window.resetAllConnectLines = function () {
    const page = pagenation.activePage;
    page.querySelectorAll(".connect_line").forEach(line => {
        line.remove();
    });
    page.querySelectorAll(".connect_item").forEach(item => {
        item.classList.remove("connected", "correct", "incorrect");
    });
};

window.resetDragDropFraction = function () {
    const page = pagenation.activePage;
    page.querySelectorAll(".fraction_drag_item").forEach(item => {
        const originPosition = item.getAttribute("data-origin-position");
        if (originPosition) {
            const [left, top] = originPosition.split(",");
            item.style.left = left + "px";
            item.style.top = top + "px";
        }
        item.classList.remove("correct", "incorrect");
    });
};

// 기존 버튼 기능 정의
window.resetFields = function () {
    const page = pagenation.activePage;

    // 전역 오답 카운트 초기화
    window.globalFaultCount = 0;

    // 입력 내용 초기화
    resetInputFields();

    // 예시/정답 내용 숨김
    page.querySelectorAll(".example_box").forEach(box => {
        box.classList.remove("on");
    });

    // 기타 시스템 초기화
    resetCardFlip();
    resetRevealSystem();
    resetBooleanBtn();
    resetBooleanCount();
    resetDragGroupValue();
    resetSelfCheckRadioGroups();
    resetAllConnectLines();
    resetDragDropFraction();

    // 입력 필드 및 버튼 활성화
    page.querySelectorAll("math-field, [data-answer-single]").forEach(field => {
        field.removeAttribute("disabled");
        field.classList.remove("disabled", "hint");
    });

    // 모든 버튼 활성화
    page.querySelectorAll(".btn_area button").forEach(btn => {
        btn.removeAttribute("disabled");
    });

    // 커스텀 리셋 함수 실행
    typeof resetCustom === "function" && resetCustom();
};

/** input, textarea, select, drawline의 정오답 체크 및 힌트 기능 */
function checkAnswers(onCorrect, onIncorrect, onIncorrectTwice, onEmpty) {
    const page = pagenation.activePage;

    // ✅ 카드 플립만 존재하는 경우: 정답 검사 대신 커버 전체 벗기기만 실행
    const cards = page.querySelectorAll(".letCheck li");
    const otherCheckTargets = page.querySelectorAll("[data-answer-single]:not(.letCheck li)");
    const hasCardFlipOnly = cards.length > 0 && otherCheckTargets.length === 0;

    if (hasCardFlipOnly) {
        cards.forEach(card => {
            const cover = card.querySelector(".cover");
            if (cover) {
                cover.classList.add("removed");
                cover.remove();
            }
        });

        // 리셋 버튼 활성화
        document.querySelector(".btn_area .btnReset") ?.classList.add("active");

        return; // 여기서 종료 (정답 체크 안 함)
    }

    const defaultTargets = page.querySelectorAll("[data-answer-single]");

    let incorrectOccurred = false;
    let emptyOccurred = false;

    const customTargets = typeof window.getCustomTargets === "function" ?
        window.getCustomTargets(page) || [] : [];

    const targetSet = new Set([...defaultTargets, ...customTargets]);
    const finalTargets = Array.from(targetSet);

    if (finalTargets.length === 0) return;

    finalTargets.forEach(el => {
        const correction = el.dataset ?.correction;
        const answerValue = el.dataset ?.answerSingle;

        let isEmpty = false;
        let isIncorrect = false;

        const hasCustom = typeof window.customCheckCondition === "function";

        // ✅ 커스텀 검사 우선
        if (hasCustom) {
            const result = window.customCheckCondition(el);
            if (result === "empty") isEmpty = true;
            else if (result === false) isIncorrect = true;
            // true는 정답 처리
        } else {
            // ✅ 기본 검사만 적용
            const booleanWrap = el.closest('.boolean_wrap');
            if (booleanWrap) {
                const buttons = booleanWrap.querySelectorAll('button');
                let hasSelected = false;
                let isGroupCorrect = true;

                buttons.forEach(button => {
                    const isSelected = button.classList.contains('selected');
                    const buttonAnswer = button.dataset.answerSingle;

                    if (isSelected) {
                        hasSelected = true;
                        if (buttonAnswer === "false") isGroupCorrect = false;
                    } else if (buttonAnswer === "true") {
                        isGroupCorrect = false;
                    }
                });

                if (!hasSelected) isEmpty = true;
                else if (!isGroupCorrect) isIncorrect = true;

            } else {
                // 일반 필드 검사
                if (correction === "false") {
                    isIncorrect = true;
                } else if (!correction || correction === undefined) {
                    if (answerValue !== "empty_answer") {
                        isEmpty = true;
                    }
                }
            }
        }

        // 플래그 반영
        if (isEmpty) emptyOccurred = true;
        else if (isIncorrect) incorrectOccurred = true;
    });


    // ✅ 결과 처리
    if (emptyOccurred) {
        onEmpty();
        return;
    }

    if (incorrectOccurred) {
        updateGlobalFaultCount(globalFaultCount + 1);
        audioManager.playSound("incorrect");
        return;
    }

    onCorrect();
    updateGlobalFaultCount(0);
    audioManager.playSound("correct");
}


// 계산 순서 점 잇기 정답 비교 함수 (배열이 동일한지 검사)
function compareConnectionArrays(correct, user) {
    if (correct.length !== user.length) return false;

    // 배열을 문자열로 변환하여 정렬 후 비교 (순서 무관 비교)
    const sortedCorrect = correct.map(pair => JSON.stringify(pair.sort((a, b) => a - b))).sort();
    const sortedUser = user.map(pair => JSON.stringify(pair.sort((a, b) => a - b))).sort();

    return JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser);
}

// 정답 처리 콜백
function onCorrect() {
    typeof onCorrectCustom === "function" && onCorrectCustom();
    pagenation.activePage.querySelectorAll(".input_wrap, .dropdown_wrap, .drawing_area").forEach(wrapper => wrapper.classList.remove("hint")); // 모든 hint 제거
    toastCheckMsg("정답이에요!", 4, false);
}

// 첫 번째 오답 처리 콜백
function onIncorrect() {
    typeof onIncorrectCustom === "function" && onIncorrectCustom();
    toastCheckMsg("한 번 더 생각해 보세요.", 2, false);
}

// 두 번째 이상 오답 처리 콜백
function onIncorrectTwice() {
    typeof onIncorrectTwiceCustom === "function" && onIncorrectTwiceCustom();
    const page = pagenation.activePage;
    const btn = document.querySelectorAll(".btn_area button:not(.btnReset)")

    btn.forEach(btn => {
        if (btn && btn.classList.contains("active")) {
            btn.classList.remove("active")
        } else if (!btn.classList.contains("btnType")) {
            btn.setAttribute("disabled", true);
        }
    })

    // math-field와 data-answer-single 속성을 가진 요소들 비활성화
    page.querySelectorAll("math-field, [data-answer-single]").forEach(el => {
        el.classList.add("disabled");
        if (el.dataset.correction === "false") {
            el.classList.add("hint");
        }
    });

    // input_wrap, dropdown_wrap, drawing_area 처리
    page.querySelectorAll(".input_wrap math-field:not(.textarea), .input_wrap math-field.textarea, .custom_dropdown").forEach(wrapper => {
        const isDrawingArea = wrapper.classList.contains("drawing_area");

        if (isDrawingArea) {
            if (wrapper.dataset.correction === "false") {
                wrapper.classList.add("hint");
            }
        } else {
            const inner = wrapper.querySelector("input, textarea, select.custom_dropdown, .connection_lines");
            if (inner ?.dataset.correction === "false") {
                wrapper.classList.add("hint");
            }
        }
    });

    // ✅ boolean 버튼 처리
    page.querySelectorAll(".boolean_wrap > button").forEach(button => {
        const isTrueAnswer = button.dataset.answerSingle === "true";

        if (isTrueAnswer) {
            button.classList.add("hint");
        }
    });

    page.querySelector(".boolean_count_wrap") ? applyBooleanCountSimplified() : null

    // ✅ drag_group 정답 힌트 처리
    page.querySelectorAll(".drag_group[data-answer-single]").forEach(group => {
        let answerArray;
        try {
            answerArray = JSON.parse(group.dataset.answerSingle || "[]");
        } catch {
            answerArray = [];
        }

        const droppables = group.querySelectorAll(".droppable");

        answerArray.forEach((val, i) => {
            if (droppables[i]) {
                droppables[i].dataset.value = val;
            }
        });
    });

    page.querySelectorAll(".connect_wrap").forEach(wrap => {
        drawAnswerConnections(wrap);
    });

    page.querySelectorAll(".dragndrop_fraction_wrap .drop_item").forEach(drop => {
        if (drop.dataset.correction === "false") {
            drop.classList.add("hint");
        }
    });

    toastCheckMsg("정답을 확인해 보세요.", 3, false);
}

// 빈 값 처리 콜백
function onEmpty() {
    typeof onEmptyCustom === "function" && onEmptyCustom();
    toastCheckMsg("문제를 풀어보세요!", 1, false);
}

// 체크 버튼 클릭 핸들러
window.checkAnswerFields = function (button) {
    const page = pagenation.activePage;
    const revealBtns = page.querySelectorAll(".reveal_btn");
    const hasOnlyReveal = revealBtns.length > 0 && page.querySelectorAll("[data-answer-single]:not(.reveal_btn)").length === 0;

    if (hasOnlyReveal) {
        // 모든 reveal_btn에 on 부여
        revealBtns.forEach(btn => btn.classList.add("on"));
        button.classList.remove("active"); // 버튼 비활성화
        return; // ✅ 이후 로직 실행 방지
    }

    // 아래는 기존 예시 버튼 처리 로직
    const hasExampleBox = page.querySelector(".example_box");
    const hasSampleBtn = document.querySelector(".btn_area .btnSample");
    const canToggleClose = hasExampleBox && !hasSampleBtn;

    if (!canToggleClose) {
        if (!button.classList.contains("close")) {
            checkAnswers(onCorrect, onIncorrect, onIncorrectTwice, onEmpty);
        }
        return;
    }

    if (button.classList.contains("close")) {
        resetRevealSystem();
        page.querySelectorAll(".example_box").forEach(el => el.classList.remove("on"));
        button.classList.remove("close");
        return;
    }

    page.querySelectorAll(".example_box").forEach(el => el.classList.add("on"));
    button.classList.add("close");

    checkAnswers(onCorrect, onIncorrect, onIncorrectTwice, onEmpty);
};

window.showExampleFields = function (button) {
    const page = pagenation.activePage;
    const exampleBox = page.querySelector(".example_box");
    if (!exampleBox) return;

    if (!button.classList.contains("close")) {
        // 예시 답안 표시 및 입력 필드 비활성화
        exampleBox.classList.add("on");
        button.classList.add("close");
        page.querySelectorAll("math-field").forEach(field => {
            field.setAttribute("disabled", "true");
            field.classList.add("disabled");
        });
    } else {
        // 예시 답안 숨김 및 입력 필드 활성화
        exampleBox.classList.remove("on");
        button.classList.remove("close");
        page.querySelectorAll("math-field").forEach(field => {
            field.removeAttribute("disabled");
            field.classList.remove("disabled");
        });
    }
};

window.submitFields = function (button) {
    const page = pagenation.activePage;
    if (confirm("제출 하시겠습니까?")) {
        // 예시 답안 표시 및 버튼/입력 필드 비활성화
        const exampleBox = page.querySelector(".example_box");
        if (exampleBox) {
            exampleBox.classList.add("on");
        }
        button.classList.remove("active");
        page.querySelectorAll("math-field").forEach(field => {
            field.setAttribute("disabled", "true");
            field.classList.add("disabled");
        });
    }
};

window.toggleKeypadMode = function (button) {
    // 현재 포커스된 요소가 있으면 포커스 해제
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'MATH-FIELD') {
        activeElement.blur();
    }
    mathVirtualKeyboard.hide();

    // 키패드 모드 토글
    if (!window.keypadModeState.isKeypadMode) {
        window.keypadModeState.isKeypadMode = true;
        button.classList.add("keypad");
    } else {
        window.keypadModeState.isKeypadMode = false;
        button.classList.remove("keypad");
    }
};

// boolean_wrap 버튼 클릭 이벤트
document.querySelectorAll(".boolean_wrap > button").forEach(button => {
    button.addEventListener("click", () => {
        // 현재 활성 페이지의 모든 버튼에서 "hint" 클래스 제거
        pagenation.activePage.querySelectorAll(".boolean_wrap > button").forEach(btn => {
            btn.classList.remove("hint");
        });

        // 클릭한 버튼의 "selected" 클래스 토글
        button.classList.toggle("selected");
        checkState();
    });
});

// boolean_count_wrap 버튼 클릭 이벤트
document.querySelectorAll(".boolean_count_wrap > button").forEach(button => {
    button.addEventListener("click", () => {
        const wrapper = button.closest('.boolean_count_wrap');
        const selectedCount = wrapper.querySelectorAll('button.selected').length;
        const correctCount = parseInt(wrapper.dataset.answerSingle, 10);
        
        // 이미 선택된 버튼을 다시 클릭하면 선택 해제
        if (button.classList.contains('selected')) {
            button.classList.remove('selected');
        } else {
            // 정답 개수보다 많이 선택할 수 없음
            if (selectedCount < correctCount) {
                button.classList.add('selected');
            }
        }

        // 선택 상태 저장
        const buttons = wrapper.querySelectorAll('button');
        const selectedIndices = Array.from(buttons)
            .map((btn, index) => btn.classList.contains('selected') ? index : -1)
            .filter(index => index !== -1);
        wrapper.dataset.prevSelected = selectedIndices.join(',');

        checkState();
    });
});

// boolean_count_wrap의 정답을 보여주는 함수
window.applyBooleanCountSimplified = function() {
    const page = pagenation.activePage;
    const booleanCountWrap = page.querySelector('.boolean_count_wrap');
    if (!booleanCountWrap) return;

    const correctCount = parseInt(booleanCountWrap.dataset.answerSingle, 10);
    const buttons = booleanCountWrap.querySelectorAll('button');
    
    // 모든 버튼의 선택 상태 초기화
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    // 정답 개수만큼 버튼 선택
    let count = 0;
    buttons.forEach(btn => {
        if (count < correctCount) {
            btn.classList.add('selected');
            count++;
        }
    });
};

// boolean_count_wrap의 이전 선택 상태를 복원하는 함수
window.restoreBooleanCountSelection = function() {
    const page = pagenation.activePage;
    const booleanCountWrap = page.querySelector('.boolean_count_wrap');
    if (!booleanCountWrap) return;

    // 이전 선택 상태가 저장되어 있으면 복원
    const prevSelected = booleanCountWrap.dataset.prevSelected;
    if (prevSelected) {
        const buttons = booleanCountWrap.querySelectorAll('button');
        buttons.forEach((btn, index) => {
            if (prevSelected.includes(index.toString())) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
};