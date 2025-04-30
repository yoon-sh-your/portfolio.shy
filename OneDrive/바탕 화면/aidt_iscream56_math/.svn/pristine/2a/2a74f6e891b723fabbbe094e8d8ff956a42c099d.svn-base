const enableConsoleLog = {
    submit: false,
    checkAnswer: false,        // 정오답 체크 관련 로그
    buttonState: true,       // 버튼 상태 변경/활성화 관련 로그
    evaluate: false,          // watchWithCustomTest 평가 관련 로그
    dragDrop: false,          // 드래그 앤 드롭 관련 로그
    connect: false,           // 선잇기 관련 로그
    canvas: false,            // 캔버스 관련 로그
    completionStatus: false, // 완료 상태 설정 관련 로그
    selfCheck: true, // 자가 평가 관련 로그
};

/** 정오답 체크 및 힌트 기능 실행 */
// 모든 버튼 요소를 가져와 이벤트 리스너 추가
document.querySelectorAll(".btn_area button").forEach((button) => {
    button.addEventListener("click", () => {
        // 버튼의 클래스를 확인하여 기능 실행
        const page = pagenation.activePage;

        if (button.classList.contains("btnType")) {
            if (!keypadModeProxy.isKeypadMode) {
                keypadModeProxy.isKeypadMode = true;
            } else {
                keypadModeProxy.isKeypadMode = false;
            }
        } else if (button.classList.contains("btnReset")) {
            globalFaultCount = 0;
            showExampleFields(button);
            resetCardFlip();
            resetInputFields();
            resetRevealSystem();
            resetBooleanBtn();
            resetBooleanCount();
            resetDragGroupValue();
            resetSelfCheckRadioGroups();
            resetAllConnectLines();
            resetDragDropFraction();
            resetCanvas();
            // resetAllDragDrop(page); // 주석 처리
            window.resetDragDrop(pagenation.activePage); // 활성 페이지 전달

            // resetDrawing(); // 기존 호출 방식 주석 처리 또는 제거

            // 현재 페이지의 모든 격자 그리기 영역 초기화
            page.querySelectorAll(".drawing_grid_area").forEach((area) => {
                // resetDrawing 함수가 전역적으로 접근 가능하다고 가정
                if (typeof resetDrawing === "function" && area.querySelector(".hit_area")) {
                    resetDrawing(area);
                }
            });

            // data-answer-single 속성을 가진 요소들의 disabled 상태 초기화
            page.querySelectorAll("math-field, [data-answer-single]").forEach((el) => {
                el.removeAttribute("disabled");
                el.classList.remove("disabled", "hint");
                el.classList.remove("correct");
                if (el.classList.contains("textarea") && el.closest(".input_wrap").querySelector(".example_box")) {
                    el.removeAttribute("disabled");
                }
            });
            page.querySelectorAll(".custom_dropdown").forEach((el) => {
                el.classList.remove("correct");
            });

            // 모든 버튼의 close 클래스 제거
            document.querySelectorAll(".btn_area button").forEach((btn) => {
                btn.classList.remove("active");
                btn.classList.remove("close");
            });

            // 현재 페이지의 completed 클래스 제거
            page.classList.remove("completed", "success", "fail", "fail_all");

            window.forceWatchEvaluation();

            typeof resetCustom === "function" && resetCustom();
        } else if (button.classList.contains("btnCheck") || button.classList.contains("btnSubmit")) {

            // <<<--- 추가: btnSubmit 클릭 시 self_check 유효성 검사 먼저 수행 --->>>
            if (button.classList.contains("btnSubmit")) {
                const page = pagenation.activePage; // 페이지 컨텍스트 가져오기
                const selfCheckGroups = page.querySelectorAll(".self_check .state_wrap");
                if (selfCheckGroups.length > 0) { // .self_check가 페이지에 존재하는 경우에만 검사
                    let allSelfCheckCompleted = true;
                    selfCheckGroups.forEach((group) => {
                        if (!group.querySelector("input[type='radio']:checked")) {
                            allSelfCheckCompleted = false;
                        }
                    });

                    if (!allSelfCheckCompleted) {
                        // self_check가 존재하지만 완료되지 않았으면 메시지 표시 후 종료 (checkAnswers 실행 안 됨)
                        toastCheckMsg("해당하는 표정을 선택해 보세요.", 1, false);
                        return;
                    }
                    // self_check가 존재하고 완료되었으면 아래 로직 계속 진행
                }
                // .self_check가 페이지에 없으면 아래 로직 계속 진행
            }
            // <<<--- 추가 끝 --->>>

            // --- 기존 로직 시작 ---
            if (button.dataset.submit === "true") return;

            const revealBtns = page.querySelectorAll(".reveal_btn");
            const hasOnlyReveal = revealBtns.length > 0 && page.querySelectorAll("[data-answer-single]:not(.reveal_btn)").length === 0;

            if (hasOnlyReveal) {
                // 모든 reveal_btn에 on 부여
                revealBtns.forEach((btn) => btn.classList.add("on"));
                button.classList.remove("active"); // 버튼 비활성화
                return; // ✅ 이후 로직 실행 방지
            }

            const letKnow = page.querySelectorAll(".letKnow li");
            
            letKnow.forEach((li) => {
                li.classList.add("on");
            });
                

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
                page.querySelectorAll(".example_box").forEach((el) => el.classList.remove("on"));
                button.classList.remove("close");
                return;
            }

            if(!button.classList.contains("btnCheck")){
                page.querySelectorAll(".example_box").forEach(el => el.classList.add("on"));
                button.classList.add("close");
            }else if(globalFaultCount > 0){
                page.querySelectorAll(".example_box").forEach(el => el.classList.add("on"));
            }
            
            checkAnswers(onCorrect, onIncorrect, onIncorrectTwice, onEmpty);
        } else if (button.classList.contains("btnSample")) {
            // 예시 필드 표시/숨김
            showExampleFields();

            if (button.classList.contains("close")) {
                button.classList.remove("close");
                restoreBooleanCountSelection();
                page.classList.remove("completed");
            } else {
                button.classList.add("close");
                applyBooleanCountSimplified();
                page.classList.add("completed");
            }

            typeof sampleCustom === "function" && sampleCustom(button);
        } else if (button.classList.contains("btnSubmit") && button.dataset.submit === "true") {
            page.querySelectorAll("math-field").forEach((el) => {
                if (el.classList.contains("textarea") && el.closest(".input_wrap").querySelector(".example_box")) {
                    el.setAttribute("disabled", "true");
                }
            });

        } else if (button.classList.contains("btnErase")) {
            resetCanvas();
        }
    });
});

/****************************************************************************************************************/
/**
 * data-answer-multi 속성을 기반으로 정답 여부를 확인하는 헬퍼 함수
 * @param {any} userValue - 사용자의 입력 값 (문자열, 숫자, 배열 등)
 * @param {string} multiAnswerString - data-answer-multi 속성의 JSON 문자열 값
 * @returns {boolean|null} - 정답이면 true, 오답이면 false, multiAnswerString이 유효하지 않거나 파싱 실패 시 null
 */
function checkMultiCaseAnswer(page) {
    // page.querySelectorAll()은 일치하는 모든 요소를 NodeList로 반환합니다.
    const multiAnswerGroups = page.querySelectorAll("[data-answer-multi]:not([data-answer-single])");

    // 찾은 모든 그룹에 대해 반복 실행
    multiAnswerGroups.forEach(multiAnswerGroup => {
        // --- 기존 if (multiAnswerGroup) { ... } 내부 로직 시작 ---
        const dropItems = multiAnswerGroup.querySelectorAll("[data-answer-single]");
        // 현재 사용자 입력 순서 (data-value 기반)
        const currentUserSequence = Array.from(dropItems).map((el) => el.dataset.value || ""); 

        try {
            // 컨테이너의 data-answer-multi 값(JSON 배열) 파싱
            const possibleAnswers = JSON.parse(multiAnswerGroup.dataset.answerMulti || "[]");

            // 가능한 정답 순서 배열과 현재 사용자 입력 순서 배열 비교
            for (const possibleAnswer of possibleAnswers) {
                // 길이와 각 요소의 값이 모두 일치하는지 확인
                if (possibleAnswer.length === currentUserSequence.length && possibleAnswer.every((val, index) => val === currentUserSequence[index])) {
                    let updated = false; // 업데이트 여부 플래그
                    // 일치하는 정답 배열을 찾으면 각 drop_item의 data-answer-single 업데이트
                    dropItems.forEach((item, index) => {
                        if (item.dataset.answerSingle !== possibleAnswer[index]) {
                            item.dataset.answerSingle = possibleAnswer[index];
                            updated = true; // 값이 변경되었음을 표시
                            // ✅ 변경된 요소에 대해 change 이벤트 강제 발생시켜 correction 재검사 유도
                            item.dispatchEvent(
                                new Event("change", {
                                    bubbles: true,
                                })
                            );
                        }
                    });

                    if (updated) {
                        break; // 현재 그룹에 대한 정답을 찾았으면 다음 가능한 정답 확인 중지 (다음 그룹으로 이동)
                    }
                }
            }
        } catch (e) {
            console.error("Error parsing data-answer-multi:", e, "for group:", multiAnswerGroup);
        }
        // --- 기존 if (multiAnswerGroup) { ... } 내부 로직 끝 ---
    });
}

function checkMultiAnswer(userValue, multiAnswerString) {
    if (!multiAnswerString) return null;

    try {
        const multiAnswerData = JSON.parse(multiAnswerString);
        const answerValues = multiAnswerData.values;

        if (!Array.isArray(answerValues)) {
            console.warn("data-answer-multi의 values는 배열이어야 합니다:", multiAnswerString);
            return null;
        }

        // OR 로직: userValue가 answerValues 중 하나라도 일치하면 정답
        // 비교를 위해 값을 정규화 (예: 배열은 정렬 후 문자열화)
        const normalizedUserValue = Array.isArray(userValue) ? JSON.stringify([...userValue].sort()) : String(userValue);
        return answerValues.some((ans) => {
            const normalizedAns = Array.isArray(ans) ? JSON.stringify([...ans].sort()) : String(ans);
            return normalizedUserValue === normalizeExpression(normalizedAns);
        });
    } catch (e) {
        console.error("data-answer-multi JSON 파싱 오류:", e, multiAnswerString);
        return null;
    }
}

/** input, textarea, select, drawline의 정오답 체크 및 힌트 기능 */
function checkAnswers(onCorrect, onIncorrect, onIncorrectTwice, onEmpty) {
    const page = pagenation.activePage;
    checkMultiCaseAnswer(page);
    // ✅ 카드 플립만 존재하는 경우: 정답 검사 대신 커버 전체 벗기기만 실행
    const cards = page.querySelectorAll(".letCheck li");
    const otherCheckTargets = page.querySelectorAll("[data-answer-single]:not(.letCheck li)");
    const hasCardFlipOnly = cards.length > 0 && otherCheckTargets.length === 0;

    if (hasCardFlipOnly) {
        cards.forEach((card) => {
            const cover = card.querySelector(".cover");
            if (cover) {
                cover.classList.add("removed");
                cover.remove();
            }
        });

        // 정답확인 버튼으로 카드가 열려도 샘버디 캐릭터 보이기
        const bubble = document.querySelector(".bubble_charactor");
        if (bubble) {
            bubble.style.display = "block";
        }

        // 리셋 버튼 활성화
        document.querySelector(".btn_area .btnReset")?.classList.add("active");

        return; // 여기서 종료 (정답 체크 안 함)
    }

    const defaultTargets = page.querySelectorAll("[data-answer-single]");

    let incorrectOccurred = false;
    let emptyOccurred = false;

    const customTargets = typeof window.getCustomTargets === "function" ? window.getCustomTargets(page) || [] : [];

    const targetSet = new Set([...defaultTargets, ...customTargets]);
    const finalTargets = Array.from(targetSet);

    if (finalTargets.length === 0){
        page.classList.add('completed'); // 정답 미체크인 경우에도 completed 추가 되어야 함. (250422)
        return;
    }

    finalTargets.forEach((el) => {
        const correction = el.dataset?.correction;
        const answerValue = el.dataset?.answerSingle;

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
            const booleanWrap = el.closest(".boolean_wrap");
            if (booleanWrap) {
                const buttons = booleanWrap.querySelectorAll("button");
                let hasSelected = false;
                let isGroupCorrect = true;

                buttons.forEach((button) => {
                    const isSelected = button.classList.contains("selected");
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
    const sortedCorrect = correct.map((pair) => JSON.stringify(pair.sort((a, b) => a - b))).sort();
    const sortedUser = user.map((pair) => JSON.stringify(pair.sort((a, b) => a - b))).sort();

    return JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser);
}

// 정답 처리 콜백
function onCorrect() {
    typeof onCorrectCustom === "function" && onCorrectCustom();
    const page = pagenation.activePage;
    // page.classList.add("completed"); // 변경: 아래 checkAndSetCompletionStatus 호출로 대체
    checkAndSetCompletionStatus(page);
    pagenation.activePage.querySelectorAll(".input_wrap, .dropdown_wrap, .drawing_grid_area, .boolean_wrap").forEach((wrapper) => wrapper.classList.remove("hint")); // drawing_grid_area 추가 및 hint 제거

    // drawing_grid_area에 correct 클래스 추가
    pagenation.activePage.querySelectorAll(".drawing_grid_area, .boolean_wrap, [data-answer-single], [data-correction]").forEach((area) => {
        area.classList.add("correct");
    });

    // 정답 확인 메시지 표시
    toastCheckMsg("정답이에요!", 4, false);
}

// 첫 번째 오답 처리 콜백
function onIncorrect() {
    typeof onIncorrectCustom === "function" && onIncorrectCustom();
    toastCheckMsg("한 번 더 생각해 보세요.", 2, false);
}

/**
 * 요소의 correction 상태에 따라 hint 또는 correct 클래스를 처리하는 함수
 * @param {Element} el - 처리할 요소
 */
const processHintClasses = (el) => {
    // 기존 클래스 모두 제거
    el.classList.remove("correct", "hint");

    // correction 상태에 따라 클래스 추가
    if (el.dataset.correction === "true") {
        el.classList.add("correct");
    } else if (!el.dataset.correction || el.dataset.correction === "false") {
        el.classList.add("hint");
    }
};

// 두 번째 이상 오답 처리 콜백
function onIncorrectTwice() {
    typeof onIncorrectTwiceCustom === "function" && onIncorrectTwiceCustom();
    const page = pagenation.activePage;
    // page.classList.add("completed"); // 변경: 아래 checkAndSetCompletionStatus 호출로 대체
    checkAndSetCompletionStatus(page);

    // math-field와 data-answer-single 속성을 가진 요소들 비활성화
    page.querySelectorAll("math-field, [data-answer-single]").forEach((el) => {
        if (el.tagName === "MATH-FIELD" && el.classList.contains("textarea")) {
            el.setAttribute("disabled", "true");
        }
        if (el.dataset.correction === "false") {
            el.classList.add("hint");
            if (el.tagName === "MATH-FIELD") {
                el.setAttribute("disabled", "true");
            }
        } else if (!el.hasAttribute("disabled")) {
            el.classList.add("correct");
        }
    });

    // input_wrap, dropdown_wrap, drawing_area(이제 drawing_grid_area) 처리
    const wrappers = page.querySelectorAll(".input_wrap, .custom_dropdown, .drawing_grid_area"); // 선택자 수정: math-field 대신 input_wrap, dropdown_wrap 대신 custom_dropdown 선택
    if (wrappers.length > 0) {
        wrappers.forEach((wrapper) => {
             processHintClasses(wrapper); // 모든 타입의 wrapper에 대해 processHintClasses 호출 (내부에서 data-correction 확인)
        });
    }

    // ✅ boolean 버튼 처리
    page.querySelectorAll(".boolean_wrap > button").forEach((button) => {
        const isTrueAnswer = button.dataset.answerSingle === "true";
        // console.log(page, button.dataset.answerSingle);
        if (isTrueAnswer) {
            button.classList.add("hint");
        }
    });

    page.querySelector(".boolean_count_wrap") ? applyBooleanCountSimplified() : null;

    // ✅ drag_group 정답 힌트 처리
    page.querySelectorAll(".drag_group[data-answer-single]").forEach((group) => {
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

    page.querySelectorAll(".connect_wrap").forEach((wrap) => {
        drawAnswerConnections(wrap);
    });

    page.querySelectorAll(".dragndrop_fraction_wrap .drop_item").forEach((drop) => {
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

function resetInputFields() {
    // math-field 요소 리셋
    pagenation.activePage.querySelectorAll(".input_wrap math-field").forEach((mathField) => {
        // 값 초기화
        if (typeof mathField.setValue === "function") {
            mathField.setValue('\\text{}'); // MathLive 메서드 사용
        } else {
            mathField.value = ""; // 일반 속성 사용
        }

        // empty_answer 처리
        if (mathField.dataset.answerSingle === "empty_answer") {
            mathField.dataset.correction = "true"; // 빈 값이므로 true
        } else {
            delete mathField.dataset.correction;
        }
        mathField.classList.remove("hint");
    });

    // 기존 input, select 요소 리셋
    pagenation.activePage.querySelectorAll(".custom_dropdown").forEach((element) => {
        if (element.tagName === "SELECT") {
            element.selectedIndex = 0; // 첫 번째 선택값으로 초기화
        } else {
            element.value = ""; // 입력 필드 값 초기화
        }
        element.parentElement.classList.remove("hint"); // 부모 태그에서 hint 클래스 제거
        delete element.dataset.correction;
    });

    // drawing_area 리셋 -> drawing_grid_area로 변경 및 correct 클래스 제거 추가
    pagenation.activePage.querySelectorAll(".drawing_grid_area").forEach((element) => {
        // 클래스명 변경
        element.classList.remove("hint", "correct"); // correct 클래스 제거 추가
        delete element.dataset.correction;
    });

    resetRevealSystem();
}

function showExampleFields(trigger) {
    if (trigger && trigger.classList.contains("btnReset")) {
        pagenation.activePage.querySelectorAll(".example_box").forEach((element) => {
            element.classList.remove("on");
        });
    } else {
        pagenation.activePage.querySelectorAll(".example_box").forEach((element) => {
            element.classList.toggle("on");
        });
    }
}

/****************************************************************************************************************/
/** 개별 버튼 클릭 시 숨김 답안 공개 (순서 제한 제거) */
document.addEventListener("click", (event) => {
    if (pagenation.activePage && pagenation.activePage.contains(event.target) && event.target.classList.contains("reveal_btn")) {
        const button = event.target;
        button.classList.toggle("on");

        // data-pair 값 가져오기
        const pairValue = button.dataset.pair;
        if (pairValue) {
            // 같은 data-pair 값을 가진 hidden_obj 요소에 on 클래스 추가/제거
            pagenation.activePage.querySelectorAll(`.hidden_obj[data-pair='${pairValue}']`).forEach((hidden) => {
                hidden.classList.toggle("on");
            });
        }
    }
});

/** 전체 답안 공개 */
function revealAllAnswers() {
    pagenation.activePage.querySelectorAll(".reveal_btn").forEach((hidden) => hidden.classList.add("on"));
    pagenation.activePage.querySelectorAll(".hidden_obj").forEach((hidden) => hidden.classList.add("on"));
}

/** 모든 답안 숨기기 (초기화) */
function resetRevealSystem() {
    pagenation.activePage.querySelectorAll(".reveal_btn").forEach((hidden) => hidden.classList.remove("on"));
    pagenation.activePage.querySelectorAll(".hidden_obj").forEach((hidden) => hidden.classList.remove("on"));
}

/****************************************************************************************************************/
/**
 * 활성 페이지 내부 요소들 중 조건을 만족하면 콜백 실행
 * 각 rule은 { selector, test(el) } 형식
 * @param {Array} rules - 검사할 규칙 배열
 * @param {Function} callback - 하나라도 만족하면 실행
 * @param {Function} callbackNot - 전부 불만족이면 실행
 */
(function () {
    const allRules = [];
    const allCallbacks = [];

    window.watchWithCustomTest = function (rules, callback, callbackNot) {
        allRules.push(...rules);
        allCallbacks.push({
            callback,
            callbackNot,
        });
        evaluate(); // 초깃값 확인

        // 버튼 클래스 변경 감지를 위한 MutationObserver 추가
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    evaluate();
                }
            });
        });

        // 버튼 요소들 감시
        document.querySelectorAll(".btn_area button").forEach((button) => {
            observer.observe(button, {
                attributes: true,
                attributeFilter: ["class"],
            });
        });
    };

    window.registerCustomWatchRule = function (rule, callback, callbackNot) {
        allRules.push(rule);
        allCallbacks.push({
            callback,
            callbackNot,
        });
        evaluate(); // 등록 즉시 반영
    };

    let lastMatchedKeys = new Set();
    let evaluateScheduled = false;

    const evaluate = () => {
        if (!pagenation.activePage) return;

        // 무한루프 방지: 연속 실행 방지용 debounce 처리
        if (evaluateScheduled) return;
        evaluateScheduled = true;
        requestAnimationFrame(() => {
            evaluateScheduled = false;

            const matchedNow = new Set();

            allRules.forEach(({ selector, test, key, condition, setClass = [] }) => {
                // condition 추가
                let isMatched = false;
                if (condition && typeof condition === "function") {
                    // condition 함수 사용
                    try {
                        isMatched = condition();
                    } catch (e) {
                        console.warn(`condition 오류 for key ${key}:`, e);
                    }
                } else if (selector && test && typeof test === "function") {
                    // selector/test 사용
                    const elements = pagenation.activePage ? pagenation.activePage.querySelectorAll(selector) : [];
                    isMatched = Array.from(elements).some((el) => {
                        try {
                            return test(el);
                        } catch (e) {
                            if (enableConsoleLog.evaluate) console.warn(`test 오류 for selector ${selector}:`, e);
                            return false;
                        }
                    });
                } else {
                    // test 또는 condition이 유효하지 않은 규칙 처리 (옵션)
                    // console.warn(`Invalid rule format for key ${key || selector}`);
                }

                if (isMatched) matchedNow.add(key || selector);

                // 🔒 loop-safe: 상태가 바뀔 때만 class 변경
                if (setClass && setClass.length > 0) {
                    setClass.forEach(({ target, class: className }) => {
                        const targets = document.querySelectorAll(target);
                        targets.forEach((el) => {
                            const hasClass = el.classList.contains(className);
                            if (isMatched && !hasClass) {
                                el.classList.add(className);
                            } else if (!isMatched && hasClass) {
                                el.classList.remove(className);
                            }
                        });
                    });
                }
            });

            const added = [...matchedNow].filter((k) => !lastMatchedKeys.has(k));
            const removed = [...lastMatchedKeys].filter((k) => !matchedNow.has(k));
            const changed = added.length > 0 || removed.length > 0;

            if (changed) {
                lastMatchedKeys = new Set(matchedNow); // ✨ 변경 감지 시 lastMatchedKeys 갱신 (Set 복사) ✨

                allCallbacks.forEach(({ callback, callbackNot }) => {
                    // ✨ 로그 추가: 콜백 함수 호출 조건 확인 ✨
                    if (matchedNow.size > 0 && typeof callback === "function") {
                        // console.log('[Evaluate] Calling main callback with keys:', [...matchedNow]);
                        callback([...matchedNow]); // 콜백에는 배열 형태로 전달 (기존 로직 유지 위함)
                    } else if (typeof callback === "function") {
                        // 콜백 함수가 있는데 호출 안된 경우
                        // if (enableConsoleLog.evaluate) console.log('[Evaluate] Main callback not called (matchedNow is empty or callback is not a function).');
                    }

                    if (removed.length > 0 && typeof callbackNot === "function") {
                        // console.log('[Evaluate] Calling removal callback with keys:', removed, 'isEmpty:', matchedNow.size <= 0);
                        callbackNot([...removed], matchedNow.size <= 0); // 콜백에는 배열 형태로 전달
                    } else if (typeof callbackNot === "function") {
                        // 제거 콜백이 있는데 호출 안된 경우
                        // if (enableConsoleLog.evaluate) console.log('[Evaluate] Removal callback not called (no removed keys or callbackNot is not a function).');
                    }
                });
            } else {
                // if (enableConsoleLog.evaluate) console.log('[Evaluate] No changes detected, callbacks not triggered.');
            }
        });
    };

    ["click", "keyup", "input", "change", "drop", "dropoutEvaluate"].forEach((evt) => {
        document.addEventListener(evt, evaluate);
    });

    // 드래그 그룹 감시
    const observer = new MutationObserver(evaluate);
    document.querySelectorAll(".drag_share .drag_group").forEach((group) => {
        observer.observe(group, {
            attributes: true,
            attributeFilter: ["data-group-value"],
        });
    });

    // 외부에서도 강제 평가 가능하도록 공개
    window.forceWatchEvaluation = evaluate;
})();

window.defineButtonClassRules = function (rules) {
    const formatted = rules.map((rule) => {
        const testFn = rule.test || defaultTest(rule.condition);
        return {
            selector: rule.selector,
            test: testFn,
            key: rule.key || rule.selector,
            setClass: rule.setClass || [],
        };
    });

    window.watchWithCustomTest(formatted);
};

function defaultTest(condition) {
    return function (el) {
        if (condition === "nonEmptyValue") return el.value?.trim?.() !== "";
        if (condition === "hasSelectedClass") return el.classList.contains("selected");
        if (condition === "hasOnClass") return el.classList.contains("on");
        if (condition === "hasData") return el.dataset.value !== undefined && el.dataset.value !== "";
        if (condition === "hasCheckedRadio") return el.querySelector("input[type='radio']:checked") !== null;
        if (condition === "hasCorrectionData") return el.dataset.correction !== undefined;
        return false;
    };
}

watchWithCustomTest(
    [
        {
            selector: ".btn_area .btnCheck",
            key: "check_btn_active",
            test: (el) => el.classList.contains("active"),
        },
        {
            selector: ".btn_area .btnSample",
            key: "sample_btn_active",
            test: (el) => el.classList.contains("active"),
        },
        {
            selector: ".btn_area .btnSample",
            key: "sample_btn_close",
            test: (el) => el.classList.contains("active") && el.classList.contains("close"),
        },
        {
            selector: ".btn_area .btnSubmit",
            key: "submit_btn_active",
            test: (el) => el.classList.contains("active"),
        },
        {
            selector: ".input_wrap math-field",
            key: "textarea_with_answer_single",
            test: (el) => (el.value?.trim() || "").replace(/\$\s+\$/g, "") !== "" && !el.closest(".input_wrap")?.querySelector(".example_box"),
        },
        {
            selector: ".input_wrap math-field",
            key: "textarea_with_example",
            test: (el) => (el.value?.trim() || "").replace(/\$\s+\$/g, "") !== "" && el.closest(".input_wrap")?.querySelector(".example_box"),
        },
        {
            selector: ".input_wrap math-field",
            key: "textarea_with_example_active",
            test: (el) => (el.value?.trim() || "").replace(/\$\s+\$/g, "") !== "" && el.closest(".input_wrap")?.querySelector(".example_box") && el.closest(".input_wrap")?.querySelector(".example_box").classList.contains("on"),
        },
        {
            selector: "[data-answer-single]",
            key: "check_target",
            test: (el) => {
                if (el.closest(".boolean_wrap")) {
                    return el.classList.contains("selected");
                } else if (el.closest(".custom_dropdown")) {
                    return el.selectedIndex !== 0;
                } else if (el.closest(".letCheck")) {
                    return el.classList.contains("on");
                } else if (el.closest(".figure_triangle")) {
                    return el.dataset.correction !== undefined;
                } else if (el.closest(".connect_wrap")) {
                    return el.dataset.correction !== undefined;
                }
                return el.dataset.answerSingle !== "empty_answer" && el.dataset.correction;
            },
        },
        {
            key: "reveal_btn_alone_exists", // reveal_btn만 있고 다른 정답 요소 또는 컨텐츠 없는 경우
            selector: ".reveal_btn",
            test: () => {
                const page = pagenation.activePage;
                const revealBtns = page.querySelectorAll(".reveal_btn");
                const hasOtherAnswers = page.querySelectorAll("[data-answer-single]:not(.reveal_btn)").length > 0;
                const hasOtherContent = page.querySelectorAll("canvas.draw-area").length > 0; // 그리기 내용 확인 추가
                return revealBtns.length > 0 && !hasOtherAnswers && !hasOtherContent; // 그리기 내용 없을 때만 true
            },
        },
        {
            key: "any_reveal_btn_on",
            selector: ".reveal_btn",
            test: (el) => el.classList.contains("on"),
        },
        {
            key: "all_reveal_btns_on",
            selector: ".reveal_btn",
            test: () => {
                const btns = pagenation.activePage.querySelectorAll(".reveal_btn");
                return btns.length > 0 && Array.from(btns).every((el) => el.classList.contains("on"));
            },
        },
        {
            key: "has_card_flip",
            selector: ".letCheck li",
            test: () => {
                const page = pagenation.activePage;
                return page.querySelectorAll(".letCheck li").length > 0;
            },
        },
        {
            key: "card_cover_removed",
            selector: ".letCheck li",
            test: (el) => !el.querySelector(".cover"),
        },
        {
            key: "all_card_covers_removed",
            selector: ".letCheck li",
            test: () => {
                const page = pagenation.activePage;
                const cards = page.querySelectorAll(".letCheck li");
                return Array.from(cards).every((card) => !card.querySelector(".cover"));
            },
        },
        {
            // key: "canvas_has_object", // key는 유지
            selector: 'canvas.draw-area[data-has-content="true"]', // 내용 있는 캔버스 직접 선택
            key: "canvas_has_object",
            test: () => {
                const page = pagenation.activePage;
                const canvases = page.querySelectorAll('canvas.draw-area[data-has-content="true"]');
                return canvases.length > 0;
            },
            // condition: function() { ... } // 기존 condition 함수 제거
        },
        {
            key: "letKnow_btn_alone_exists",
            selector: ".letKnow li",
            test: () => {
                const page = pagenation.activePage;
                const letKnow = page.querySelectorAll(".letKnow li");
                return letKnow.length > 0;
            },
        },
        {
            key: "any_letKnow_on",
            selector: ".letKnow li",
            test: (el) => el.classList.contains("on"),
        },
        {
            key: "all_letKnow_on",
            selector: ".letKnow li",
            test: () => {
                const btns = pagenation.activePage.querySelectorAll(".letKnow li");
                return btns.length > 0 && Array.from(btns).every((el) => el.classList.contains("on"));
            },
        },
        {
            key: "custom_reset_btn_active",
        },
        {
            key: "custom_sample_btn_active",
        },
        {
            key: "custom_check_btn_active",
        },
        {
            key: "custom_submit_btn_active",
        },
        // ✅ 활성 페이지 완료 상태 감지 규칙 추가
        {
            key: "page_completed",
            condition: () => {
                return pagenation.activePage && pagenation.activePage.classList.contains("completed");
            }
        },
        {
            selector: ".example_box", // selector는 유지해도 좋습니다.
            key: "example_box_active",
            test: () => {
                const page = pagenation.activePage;
                const exampleBoxes = page.querySelectorAll(".example_box");
                // .example_box 요소가 존재하고, 그 중 하나라도 'on' 클래스를 가지고 있으면 true를 반환합니다.
                return exampleBoxes.length > 0 && Array.from(exampleBoxes).some(el => el.classList.contains("on"));
            },
        },
    ],
    (matchedKeys) => {
        if (enableConsoleLog.buttonState) console.log("[Button State] Matched keys for activation:", matchedKeys);

        const checkBtn = document.querySelectorAll(".btn_area .btnCheck");
        const sampleBtn = document.querySelectorAll(".btn_area .btnSample");
        const submitBtn = document.querySelectorAll(".btn_area .btnSubmit");
        const resetBtn = document.querySelectorAll(".btn_area .btnReset");
        const eraseBtn = document.querySelectorAll(".btn_area .btnErase");
        const solveBtnArea = document.querySelectorAll(".buttons_solve .btnSelf");

        // ❗ 페이지 완료 상태일 때 버튼 비활성화 로직 (기존 if 문 제거)
        if (matchedKeys.includes("page_completed")) {
            resetBtn.forEach((btn) => btn.classList.add("active"));
            checkBtn.forEach((btn) => btn.classList.remove("active"));
            // sampleBtn.forEach((btn) => btn.classList.remove("active"));
            submitBtn.forEach((btn) => {
                console.log(solveBtnArea.length);
                if(solveBtnArea.length === 0){
                    console.log("solveBtnArea is not found");
                    btn.classList.remove("active");
                }else{
                    btn.classList.add("active");
                }
                btn.classList.remove("close");
            });

            // resetBtn은 page_completed 상태에서 활성화될 수 있으므로 여기서 처리하지 않음
            return; // 페이지 완료 시 다른 활성화 로직 실행 안 함
        }

        // 기존의 활성화 로직 (page_completed가 아닐 때만 실행됨)
        if(matchedKeys.includes("check_target")){
            resetBtn.forEach((btn) => btn.classList.add("active"));
        }

        if (matchedKeys.includes("check_target")) {
            checkBtn.forEach((btn) => btn.classList.add("active"));
            submitBtn.forEach((btn) => btn.classList.add("active"));
            sampleBtn.forEach((btn) => btn.classList.add("active"));
        }
        
        if (matchedKeys.includes("textarea_with_example")) {
            checkBtn.forEach((btn) => btn.classList.add("active"));
            sampleBtn.forEach((btn) => btn.classList.add("active"));
            submitBtn.forEach((btn) => btn.classList.add("active"));
            resetBtn.forEach((btn) => btn.classList.add("active"));
        }

        if (matchedKeys.includes("textarea_with_example_active")) {
            checkBtn.forEach((btn) => btn.classList.remove("active"));
            sampleBtn.forEach((btn) => btn.classList.remove("active"));
            submitBtn.forEach((btn) => btn.classList.remove("active"));
            resetBtn.forEach((btn) => btn.classList.add("active"));
            sampleBtn.forEach((btn) => btn.classList.add("close"));
        }

        if (matchedKeys.includes("reveal_btn_alone_exists") || matchedKeys.includes("any_reveal_btn_on")) {
            checkBtn.forEach((btn) => btn.classList.add("active"));
            resetBtn.forEach((btn) => btn.classList.remove("active"));
        }

        if (matchedKeys.includes("all_reveal_btns_on")) {
            resetBtn.forEach((btn) => btn.classList.add("active"));
            checkBtn.forEach((btn) => btn.classList.remove("active"));
        }

        if (matchedKeys.includes("reveal_btn_alone_exists") && matchedKeys.includes("any_reveal_btn_on")) {
            resetBtn.forEach((btn) => btn.classList.add("active"));
        }

        if (matchedKeys.includes("has_card_flip")) {
            checkBtn.forEach((btn) => btn.classList.add("active"));
        }
        if (matchedKeys.includes("all_card_covers_removed")) {
            resetBtn.forEach((btn) => btn.classList.add("active"));
            checkBtn.forEach((btn) => btn.classList.remove("active"));
        }
        if (matchedKeys.includes("card_cover_removed")) {
            resetBtn.forEach((btn) => btn.classList.add("active"));
        }

        if (matchedKeys.includes("canvas_has_object")) {
            sampleBtn.forEach((btn) => btn.classList.add("active"));
            submitBtn.forEach((btn) => btn.classList.add("active"));
            eraseBtn.forEach((btn) => btn.classList.add("active"));
        }
                
        if (matchedKeys.includes("letKnow_btn_alone_exists")) {
            checkBtn.forEach((btn) => btn.classList.add("active"));
        }
        
        if (matchedKeys.includes("any_letKnow_on")) {
            resetBtn.forEach((btn) => btn.classList.add("active"));
        }
        
        if (matchedKeys.includes("all_letKnow_on")) {
            resetBtn.forEach((btn) => btn.classList.add("active"));
            checkBtn.forEach((btn) => btn.classList.remove("active"));
        }

        if (matchedKeys.includes("custom_submit_btn_active")) {
            submitBtn.forEach((btn) => btn.classList.add("active"));
        }
        if (matchedKeys.includes("custom_check_btn_active")) {
            checkBtn.forEach((btn) => btn.classList.add("active"));
        }
        if (matchedKeys.includes("custom_sample_btn_active")) {
            sampleBtn.forEach((btn) => btn.classList.add("active"));
        }
        if (matchedKeys.includes("custom_reset_btn_active")) {
            resetBtn.forEach((btn) => btn.classList.add("active"));
        }

    },
    (matchedKeys, isEmpty) => {
        if (enableConsoleLog.buttonState) console.log("[Button State] Matched keys for deactivation:", matchedKeys, "isEmpty:", isEmpty);

        const checkBtn = document.querySelectorAll(".btn_area .btnCheck");
        const sampleBtn = document.querySelectorAll(".btn_area .btnSample");
        const submitBtn = document.querySelectorAll(".btn_area .btnSubmit");
        const resetBtn = document.querySelectorAll(".btn_area .btnReset");
        const eraseBtn = document.querySelectorAll(".btn_area .btnErase");
        const solveBtnArea = document.querySelectorAll(".buttons_solve .btnSelf");

        // ❗ 페이지 완료 상태가 해제되었을 때 버튼 활성화 로직 추가
        if (matchedKeys.includes("page_completed")) {
           // 페이지가 더 이상 완료 상태가 아닐 때, 다른 활성 조건이 있다면 버튼이 다시 활성화될 수 있도록
           // 여기서는 특별히 비활성화할 필요 없음. 아래 로직에서 처리.
        }

        // 기존 비활성화 로직 (page_completed 상태가 아닐 때 적용됨)

        if (matchedKeys.includes("check_target") && !matchedKeys.includes("page_completed")) {
            checkBtn.forEach((btn) => btn.classList.remove("active"));
            // submitBtn, sampleBtn은 check_target 조건만으로 비활성화하지 않음
        }

        if (matchedKeys.includes("textarea_with_example")) {
            // textarea_with_example 조건만 해제될 경우, 다른 조건으로 active 유지될 수 있으므로
            // checkBtn, sampleBtn, submitBtn 비활성화 로직 제거 또는 수정 필요.
            // 여기서는 다른 조건도 고려해야 하므로 일단 유지하되, 추후 검토 필요.
            sampleBtn.forEach((btn) => btn.classList.remove("close"));
            submitBtn.forEach((btn) => btn.classList.remove("close"));
        }

        if (matchedKeys.includes("textarea_with_example_active")) {
            sampleBtn.forEach((btn) => btn.classList.remove("close"));
        }

        if (isEmpty) { // ❗ isEmpty 조건은 page_completed 와 별개로 처리
            checkBtn.forEach((btn) => btn.classList.remove("active"));
            sampleBtn.forEach((btn) => btn.classList.remove("active"));
            submitBtn.forEach((btn) => btn.classList.remove("active"));
            resetBtn.forEach((btn) => btn.classList.remove("active")); // 입력 없으면 리셋도 비활성
        }

        if (matchedKeys.includes("all_reveal_btns_on") && !isEmpty) {
            checkBtn.forEach((btn) => btn.classList.add("active"));
            resetBtn.forEach((btn) => btn.classList.remove("active"));
        }

        if (!matchedKeys.includes("reveal_btn_alone_exists") && matchedKeys.includes("any_reveal_btn_on")) {
            resetBtn.forEach((btn) => btn.classList.remove("active"));
        }

        if (matchedKeys.includes("card_cover_removed")) {
            resetBtn.forEach((btn) => btn.classList.remove("active"));
        }

        if (matchedKeys.includes("canvas_has_object")) {
            sampleBtn.forEach((btn) => btn.classList.remove("active"));
            submitBtn.forEach((btn) => btn.classList.remove("active"));
            eraseBtn.forEach((btn) => btn.classList.remove("active"));
        }

        if (matchedKeys.includes("custom_submit_btn_active")) {
            submitBtn.forEach((btn) => btn.classList.remove("active"));
        }
        if (matchedKeys.includes("custom_check_btn_active")) {
            checkBtn.forEach((btn) => btn.classList.remove("active"));
        }
        if (matchedKeys.includes("custom_sample_btn_active")) {
            sampleBtn.forEach((btn) => btn.classList.remove("active"));
        }
        if (matchedKeys.includes("custom_reset_btn_active")) {
            resetBtn.forEach((btn) => btn.classList.remove("active"));
        }
    }
);

/**
 * submit 버튼 클릭 시 조건 평가 후 토스트 표시
 * @param {string} buttonSelector - 제출 버튼 셀렉터
 * @param {Array} rules - 검사할 요소 규칙 (selector + test)
 */
function validateBeforeSubmit(buttonSelector, rules) {
    document.addEventListener("click", (e) => {
        // 클릭된 요소가 buttonSelector에 해당하는 요소 또는 그 자식인지 확인
        const clickedSubmitButton = e.target.closest(buttonSelector);

        // 로그 추가: 어떤 요소가 클릭되었는지 확인
        if (enableConsoleLog.submit) console.log("[Submit Validation] Click detected on:", e.target, "Closest submit button:", clickedSubmitButton);

        // 수정된 조건: 클릭된 요소가 제출 버튼(또는 그 내부 요소)이 아니면 종료
        if (!clickedSubmitButton) return;

        const page = pagenation.activePage;
        // const submitBtn = document.querySelector(buttonSelector); // 더 이상 이 줄은 필요 없을 수 있음

        // if (!submitBtn || e.target !== submitBtn) return; // 기존 조건 제거

        if (!page) {
            if (enableConsoleLog.submit) console.log("[Submit Validation] Active page not found. Aborting.");
            return;
        }

        if (enableConsoleLog.submit) console.log("[Submit Validation] Starting validation for page:", page.id || page.classList[0]);

        // ✅ 카드 플립만 존재하는 경우: 정답 검사 대신 커버 전체 벗기기만 실행
        const cards = page.querySelectorAll(".letCheck li");
        const otherCheckTargets = page.querySelectorAll("[data-answer-single]:not(.letCheck li)");
        const hasCardFlipOnly = cards.length > 0 && otherCheckTargets.length === 0;

        if (hasCardFlipOnly) {
            if (enableConsoleLog.submit) console.log("[Submit Validation] Card flip only mode detected. Revealing cards and exiting.");
            cards.forEach((card) => {
                const cover = card.querySelector(".cover");
                if (cover) {
                    cover.classList.add("removed");
                    cover.remove();
                }
            });

            // 정답확인 버튼으로 카드가 열려도 샘버디 캐릭터 보이기
            const bubble = document.querySelector(".bubble_charactor");
            if (bubble) {
                bubble.style.display = "block";
            }

            // 리셋 버튼 활성화
            document.querySelector(".btn_area .btnReset")?.classList.add("active");

            return; // 여기서 종료 (정답 체크 안 함)
        }

        const defaultTargets = page.querySelectorAll("[data-answer-single]");
        const customTargets = typeof window.getCustomTargets === "function" ? window.getCustomTargets(page) || [] : [];

        const targetSet = new Set([...defaultTargets, ...customTargets]);
        const finalTargets = Array.from(targetSet);
        if (enableConsoleLog.submit) console.log("[Submit Validation] Found targets:", finalTargets);

        // target이 없어도 계속 진행
        let hasEmpty = false;
        let isSelfCheckMissing = false;

        // target이 있는 경우에만 체크
        if (finalTargets.length > 0) {
            if (enableConsoleLog.submit) console.log("[Submit Validation] Checking targets for emptiness...");
            finalTargets.forEach((el, index) => {
                if (enableConsoleLog.submit) console.groupCollapsed(`[Submit Validation] Checking target ${index + 1}:`, el);
                const correction = el.dataset?.correction;
                const answerValue = el.dataset?.answerSingle;

                let isEmpty = false;
                let isIncorrect = false;

                const hasCustom = typeof window.customCheckCondition === "function";

                // ✅ 커스텀 검사 우선
                if (hasCustom) {
                    if (enableConsoleLog.submit) console.log("[Submit Validation] Using custom check condition.");
                    const result = window.customCheckCondition(el);
                    if (result === "empty") isEmpty = true;
                    else if (result === false) isIncorrect = true;
                    if (enableConsoleLog.submit) console.log("[Submit Validation] Custom check result:", result, "isEmpty:", isEmpty, "isIncorrect:", isIncorrect);
                } else {
                    // ✅ 기본 검사만 적용
                    const booleanWrap = el.closest(".boolean_wrap");
                    if (booleanWrap) {
                        if (enableConsoleLog.submit) console.log("[Submit Validation] Checking boolean_wrap.");
                        const buttons = booleanWrap.querySelectorAll("button");
                        let hasSelected = false;
                        let isGroupCorrect = true;

                        buttons.forEach((button) => {
                            const isSelected = button.classList.contains("selected");
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
                        if (enableConsoleLog.submit) console.log("[Submit Validation] Boolean wrap check result:", "isEmpty:", isEmpty, "isIncorrect:", isIncorrect);
                    } else {
                        // 일반 필드 검사
                        if (enableConsoleLog.submit) console.log("[Submit Validation] Checking general field. Correction:", correction, "Answer:", answerValue);
                        if (correction === "false") {
                            isIncorrect = true;
                            if (enableConsoleLog.submit) console.log("[Submit Validation] Marked as incorrect.");
                        } else if (!correction || correction === undefined) {
                            if (answerValue !== "empty_answer") {
                                isEmpty = true;
                                if (enableConsoleLog.submit) console.log("[Submit Validation] Marked as empty (no correction and not empty_answer).");
                            } else {
                                if (enableConsoleLog.submit) console.log("[Submit Validation] Considered not empty (is empty_answer).");
                            }
                        } else {
                             if (enableConsoleLog.submit) console.log("[Submit Validation] Considered correct/filled.");
                        }
                    }
                }

                // 플래그 반영
                if (isEmpty) {
                    hasEmpty = true;
                    if (enableConsoleLog.submit) console.log("[Submit Validation] Target marked as empty. Setting hasEmpty flag.");
                    if (el.closest(".self_check")) {
                        isSelfCheckMissing = true;
                        if (enableConsoleLog.submit) console.log("[Submit Validation] Empty target is self_check. Setting isSelfCheckMissing flag.");
                    }
                }
                if (enableConsoleLog.submit) console.groupEnd();
            });

            // checkAnswers와 동일한 조건으로 수정
            if (hasEmpty) {
                if (enableConsoleLog.submit) console.log("[Submit Validation] Found empty fields. Aborting submit and showing '문제를 풀어보세요!' toast.");
                toastCheckMsg("문제를 풀어보세요!", 1, false);
                return;
            } else {
                 if (enableConsoleLog.submit) console.log("[Submit Validation] No empty fields found. Proceeding...");
            }
        } else {
             if (enableConsoleLog.submit) console.log("[Submit Validation] No targets found to check for emptiness.");
        }

        // 커스텀 제출 전 유효성 검증
        if (typeof window.customValidateBeforeSubmit === "function") {
            if (enableConsoleLog.submit) console.log("[Submit Validation] Executing customValidateBeforeSubmit...");
            const shouldSubmit = window.customValidateBeforeSubmit({
                hasEmpty,
                isSelfCheckMissing,
                rules,
            });
            if (enableConsoleLog.submit) console.log("[Submit Validation] customValidateBeforeSubmit result:", shouldSubmit);
            if (shouldSubmit === false) {
                if (enableConsoleLog.submit) console.log("[Submit Validation] customValidateBeforeSubmit returned false. Aborting submit.");
                return; // 기본 제출 확인 토스트 표시하지 않음
            }
        } else {
             if (enableConsoleLog.submit) console.log("[Submit Validation] No customValidateBeforeSubmit function found.");
        }

        if (enableConsoleLog.submit) console.log("[Submit Validation] All checks passed. Proceeding with final submit actions (hinting, disabling fields, etc.).");

        // correction 데이터가 생성되도록 강제 평가
        window.forceWatchEvaluation();

        // 힌트 발문 처리 (correction 데이터 생성 후 실행)
        const processHintClasses = (el) => {
            // 기존 클래스 모두 제거
            el.classList.remove("correct", "hint");
            
            // correction 상태에 따라 클래스 추가
            if (el.dataset.correction === "true") {
                el.classList.add("correct");
            } else if (!el.dataset.correction || el.dataset.correction === "false") {
                el.classList.add("hint");
            }
        };

        // math-field와 data-answer-single 속성을 가진 요소들 처리
        const mathFields = page.querySelectorAll("math-field");
        if (mathFields.length > 0) {
            mathFields.forEach((el) => {
                // data-answer-single이 있는 경우에만 힌트 처리
                if (el.hasAttribute("data-answer-single")) {
                    processHintClasses(el);
                }
                if (el.classList.contains("textarea")) {
                    el.setAttribute("disabled", "true");
                }
            });
        }

        // input_wrap, dropdown_wrap, drawing_area(이제 drawing_grid_area) 처리
        const wrappers = page.querySelectorAll(".input_wrap, .custom_dropdown, .drawing_grid_area"); // 선택자 수정: math-field 대신 input_wrap, dropdown_wrap 대신 custom_dropdown 선택
        if (wrappers.length > 0) {
            wrappers.forEach((wrapper) => {
                 processHintClasses(wrapper); // 모든 타입의 wrapper에 대해 processHintClasses 호출 (내부에서 data-correction 확인)
            });
        }

        // ✅ boolean 버튼 처리
        const booleanButtons = page.querySelectorAll(".boolean_wrap > button");
        if (booleanButtons.length > 0) {
            booleanButtons.forEach((button) => {
                const isTrueAnswer = button.dataset.answerSingle === "true";
                if (isTrueAnswer) {
                    processHintClasses(button);
                }
            });
        }

        const booleanCountWrap = page.querySelector(".boolean_count_wrap");
        if (booleanCountWrap) {
            applyBooleanCountSimplified();
        }

        // ✅ drag_group 정답 힌트 처리
        const dragGroups = page.querySelectorAll(".drag_group[data-answer-single]");
        if (dragGroups.length > 0) {
            dragGroups.forEach((group) => {
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
        }

        const connectWraps = page.querySelectorAll(".connect_wrap");
        if (connectWraps.length > 0) {
            connectWraps.forEach((wrap) => {
                drawAnswerConnections(wrap);
            });
        }

        const dropItems = page.querySelectorAll(".dragndrop_fraction_wrap .drop_item");
        if (dropItems.length > 0) {
            dropItems.forEach((drop) => {
                processHintClasses(drop);
            });
        }

        // 기본 예문 오픈
        const exampleBoxes = page.querySelectorAll(".example_box");
        if (exampleBoxes.length > 0) {
            exampleBoxes.forEach((el) => {
                el.classList.add("on");
            });
        }

        // 기존 제출 로직 (항상 실행)
        if (enableConsoleLog.submit) console.log("[Submit Validation] Showing '선생님께 제출되었습니다.' toast and setting completion status.");
        toastCheckMsg("선생님께 제출되었습니다.", 5, false);
        checkAndSetCompletionStatus(page);
    });
}

validateBeforeSubmit(".btnSubmit[data-submit='true']", [
    {
        selector: ".input_wrap math-field:not(.textarea), .input_wrap math-field.textarea, .custom_dropdown",
        test: (el) => {
            if (el.classList.contains("disabled") || el.hasAttribute("disabled")) return false;
            return (el.value?.trim() || "").replace(/\$\s+\$/g, "") !== "";
        },
    },
    {
        selector: ".custom_dropdown",
        test: (el) => {
            if (el.classList.contains("disabled") || el.hasAttribute("disabled")) return false;
            return el.dataset.selected !== undefined && el.dataset.selected !== "";
        },
    },
    {
        selector: ".self_check .state_wrap",
        test: (group) => {
            if (group.classList.contains("disabled") || group.hasAttribute("disabled")) return false;
            return group.querySelector("input[type='radio']:checked") !== null;
        },
    },
    {
        selector: ".boolean_wrap > button",
        test: (el) => {
            if (el.classList.contains("disabled") || el.hasAttribute("disabled")) return false;
            return el.classList.contains("selected");
        },
    },
]);

// 초기 로드 여부를 확인하는 플래그
let isInitialLoad = true;

/**
 * 요소의 입력값과 정답(single/multi)을 비교하여 data-correction 갱신
 * @param {Array} configs - 각 항목은 { selector, getValue, getAnswer, getMultiAnswer?, onUpdate? }
 */
function bindAnswerCheck(configs) {
    // updateCorrection 함수 수정: multi-answer 우선 확인
    const updateCorrection = (el, getValue, getAnswer, getMultiAnswer, onUpdate) => {
        const userValue = getValue(el);
        const answerMultiString = getMultiAnswer ? getMultiAnswer(el) : undefined;
        const answerSingle = getAnswer ? getAnswer(el) : undefined;
        const isEmptyInput = userValue === "[]" || !userValue || (Array.isArray(userValue) && userValue.length === 0);

        // 사용자 입력이 없으면 correction 속성 제거
        if (isEmptyInput) {
            delete el.dataset.correction;
            // console.groupEnd(); // console 로깅은 필요시 유지/제거
            return;
        }

        let isCorrect = null;

        // 1. Multi Answer 확인 (존재하고 유효하면 우선 처리)
        if (answerMultiString) {
            try {
                const multiAnswerData = JSON.parse(answerMultiString);
                if (multiAnswerData && Array.isArray(multiAnswerData.values)) {
                    // Multi-Answer 비교 로직은 selector 종류에 따라 다를 수 있음
                    // .connect_wrap의 경우, userValue(정규화된 문자열)와 multiAnswerData.values의 각 항목(정규화 필요) 비교
                    let normalizedUserValueStr;
                    if (el.matches('.connect_wrap')) {
                        normalizedUserValueStr = userValue; // getValue에서 이미 정규화됨
                    } else {
                         // 다른 타입 요소의 경우, 필요에 따라 userValue 정규화
                         normalizedUserValueStr = Array.isArray(userValue) ? JSON.stringify([...userValue].sort()) : String(userValue);
                    }

                    const foundMatchInMulti = multiAnswerData.values.some(ans => {
                        let normalizedAnsStr;
                        if (el.matches('.connect_wrap')) {
                            // Multi-answer 내 각 배열도 connect_wrap과 동일하게 정규화
                             try {
                                const arr = JSON.parse(JSON.stringify(ans)); // 깊은 복사
                                normalizedAnsStr = JSON.stringify(
                                    arr.map(pair => pair.slice().sort((a, b) => String(a).localeCompare(String(b))))
                                       .sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1])))
                                );
                            } catch { normalizedAnsStr = "[]"; }
                        } else {
                            // 다른 타입 요소의 경우, 필요에 따라 ans 정규화
                            normalizedAnsStr = Array.isArray(ans) ? JSON.stringify([...ans].sort()) : String(ans);
                        }
                        return normalizedUserValueStr === normalizedAnsStr;
                    });
                    if (foundMatchInMulti) isCorrect = true;

                }
            } catch (e) {
                console.warn("data-answer-multi 파싱 오류:", e);
            }
        }

        // 2. Multi Answer가 없거나 multi-answer에서 정답을 찾지 못했고, Single Answer가 있으면 확인
        if (isCorrect === null && answerSingle !== undefined) {
            if (answerSingle === "empty_answer") {
                isCorrect = isEmptyInput; // isEmptyInput은 위에서 처리했으므로 사실상 false
            } else if (!isEmptyInput) {

                // ⭐ .connect_wrap 특별 처리: 부분 정답 인정 (정답 포함 여부 확인)
                if (el.matches('.connect_wrap')) {
                    try {
                        // getValue, getAnswer는 이미 정규화된 *문자열* 반환
                        const userAnswerArray = JSON.parse(userValue);
                        const correctAnswerArray = JSON.parse(answerSingle);

                        if (Array.isArray(userAnswerArray) && Array.isArray(correctAnswerArray) && correctAnswerArray.length > 0) {
                            // 정답 배열의 모든 요소가 사용자 배열에 포함되는지 확인
                            // 각 요소는 이미 정렬된 상태이므로 문자열로 변환하여 비교 가능
                            const userSet = new Set(userAnswerArray.map(pair => JSON.stringify(pair)));
                            isCorrect = correctAnswerArray.every(correctPair => userSet.has(JSON.stringify(correctPair)));
                        } else {
                            isCorrect = false; // 배열 형식이 아니거나 정답 배열이 비어있으면 오답
                        }
                    } catch (e) {
                        console.error("connect_wrap 정답/사용자 데이터 파싱 오류:", e);
                        isCorrect = false;
                    }
                } else {
                    // 다른 타입 요소: 기존 로직 (정확히 일치해야 정답)
                    isCorrect = userValue === answerSingle;
                }

            } else {
                // Single Answer가 있고 입력이 비어있으면 오답 (empty_answer가 아닐 때)
                isCorrect = false;
            }
        }

        // 3. Correction 업데이트
        if (isCorrect === true) {
            el.dataset.correction = "true";
        } else if (isCorrect === false) {
            el.dataset.correction = "false";
        } else {
            // isCorrect가 null인 경우 (예: multi-answer, single-answer 모두 없거나 평가 불가)
            delete el.dataset.correction;
        }

        // console.groupEnd(); // console 로깅은 필요시 유지/제거
        if (onUpdate) onUpdate(el, isCorrect);
    };

    // configs.forEach 수정: getMultiAnswer 인자 추가
    configs.forEach(
        ({
            selector,
            getValue,
            getAnswer,
            getMultiAnswer = (el) => el.dataset.answerMulti, // 기본 getMultiAnswer 함수
            onUpdate,
        }) => {
            const handler = (e) => {
                const target = e.target.closest(selector);
                // target이 실제 selector와 일치하는지 확인 (하위 요소 이벤트 위임 시 중요)
                if (target && target.matches(selector)) {
                    updateCorrection(target, getValue, getAnswer, getMultiAnswer, onUpdate);
                    // boolean_count_wrap 같은 컨테이너 처리 (내부 버튼 클릭 시)
                } else if (selector === ".boolean_count_wrap" && e.target.matches("button")) {
                    const wrapper = e.target.closest(selector);
                    if (wrapper) {
                        updateCorrection(wrapper, getValue, getAnswer, getMultiAnswer, onUpdate);
                    }
                    // 다른 컨테이너 기반 로직 추가 필요 시 여기에...
                } else if (selector === ".drag_share .drag_group") {
                    const group = e.target.closest(selector);
                    if (group) {
                        updateCorrection(group, getValue, getAnswer, getMultiAnswer, onUpdate);
                    }
                } else if (selector === ".connect_wrap") {
                    const wrap = e.target.closest(selector);
                    if (wrap) {
                        updateCorrection(wrap, getValue, getAnswer, getMultiAnswer, onUpdate);
                    }
                } else if (selector === ".drawing_area") {
                    const area = e.target.closest(selector);
                    if (area) {
                        updateCorrection(area, getValue, getAnswer, getMultiAnswer, onUpdate);
                    }
                } else if (selector === ".dragndrop_fraction_wrap .drop_item") {
                    const dropItem = e.target.closest(selector);
                    if (dropItem) {
                        updateCorrection(dropItem, getValue, getAnswer, getMultiAnswer, onUpdate);
                    }
                }
            };

            // 이벤트 리스너 등록
            document.addEventListener("input", handler);
            document.addEventListener("change", handler);
            document.addEventListener("keyup", handler); // keyup도 필요한 경우 유지
            document.addEventListener("click", handler); // boolean 버튼 등
            // 드래그 완료 등 커스텀 이벤트 필요 시 추가
            document.addEventListener("dragDropComplete", handler);

            // 초기 상태도 검사
            document.querySelectorAll(selector).forEach((el) => {
                updateCorrection(el, getValue, getAnswer, getMultiAnswer, onUpdate);
            });
        }
    );

    bindInputEvents();

    // 초기 로드 완료
    isInitialLoad = false;
}

// 입력 필드 포커스 이벤트 핸들러
function handleInputFocus() {
    const activeBtn = document.querySelectorAll(".btn_area button:not(.btnType, .btnSample)");
    if (activeBtn) activeBtn.forEach((btn) => btn.classList.add("active"));
    document.querySelector(".btn_area .btnSample")?.classList.add("active");
}

// 입력 필드 블러 이벤트 핸들러
function handleInputBlur() {
    const isEmpty = !hasUserInput();
    const activeBtn = document.querySelectorAll(".btn_area button:not(.btnType, .btnSample)");

    // 최초 로드가 아닌 경우에만 active 상태 유지
    if (!isInitialLoad) {
        if (!isEmpty) {
            if (activeBtn) activeBtn.forEach((btn) => btn.classList.add("active"));
            document.querySelector(".btn_area .btnSample")?.classList.add("active");
        } else {
            if (activeBtn) activeBtn.forEach((btn) => btn.classList.remove("active"));
            document.querySelector(".btn_area .btnSample")?.classList.remove("active");
        }
    }
}

// 입력 필드 이벤트 바인딩
function bindInputEvents() {
    const inputElements = pagenation.activePage.querySelectorAll(".input_wrap math-field:not(.textarea) input, .input_wrap math-field.textarea textarea, .custom_dropdown");
    inputElements.forEach((element) => {
        element.addEventListener("focus", handleInputFocus);
        element.addEventListener("blur", handleInputBlur);
    });
}

bindAnswerCheck([
    {
        selector: ".custom_dropdown",
        getValue: (el) => el.parentElement.querySelector(".select_trigger")?.dataset.value || "",
        getAnswer: (el) => el.dataset.answerSingle,
    },
    {
        selector: ".drawing_area",
        getValue: (el) => {
            const svg = el.querySelector("svg");
            const userRaw = svg?.dataset.userConnections;
            if (!userRaw) return "[]";
            try {
                const arr = JSON.parse(userRaw);
                return JSON.stringify(arr.map((pair) => pair.sort((a, b) => a - b)).sort((a, b) => a[0] - b[0] || a[1] - b[1]));
            } catch (e) {
                return "[]";
            }
        },
        getAnswer: (el) => {
            const answerRaw = el.dataset.answerSingle;
            if (answerRaw === undefined) return undefined;
            try {
                const arr = JSON.parse(answerRaw || "[]");
                return JSON.stringify(arr.map((pair) => pair.sort((a, b) => a - b)).sort((a, b) => a[0] - b[0] || a[1] - b[1]));
            } catch (e) {
                return "[]";
            } // 파싱 실패 시 빈 배열 문자열 반환 (오답 유도)
        },
        onUpdate: (el) => {
            const svg = el.querySelector("svg");

            // userConnections가 없거나 빈 배열인 경우 correction 속성 제거
            if (!svg?.dataset.userConnections || svg.dataset.userConnections === "[]") {
                delete el.dataset.correction;
                return;
            }

            window.forceWatchEvaluation();
        },
    },
    {
        selector: ".boolean_wrap button",
        getValue: (el) => (el.classList.contains("selected") ? "true" : "false"),
        getAnswer: (el) => el.dataset.answerSingle,
    },
    {
        selector: ".boolean_count_wrap",
        getValue: (el) => el.querySelectorAll("button.selected").length,
        getAnswer: (el) => {
            const count = parseInt(el.dataset.answerSingle, 10);
            return isNaN(count) ? undefined : count;
        },
    },
    {
        selector: ".drag_share .drag_group",
        getValue: (el) => {
            try {
                return Array.from(el.querySelectorAll(".droppable"))
                    .map((d) => d.dataset.value)
                    .filter((v) => v !== undefined);
            } catch {
                return [];
            }
        },
        getAnswer: (el) => {
            const answerRaw = el.dataset.answerSingle;
            if (answerRaw === undefined) return undefined;
            try {
                return JSON.parse(answerRaw || "[]");
            } catch {
                return [];
            }
        },
    },
    {
        selector: ".connect_wrap",
        getValue: (el) => {
            const connectionsRaw = el.dataset.connections;
            if (!connectionsRaw) return "[]";
            try {
                const arr = JSON.parse(connectionsRaw);
                return JSON.stringify(arr.map((pair) => pair.slice().sort((a, b) => String(a).localeCompare(String(b)))).sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1]))));
            } catch (e) {
                return "[]";
            }
        },
        getAnswer: (el) => {
            const answerRaw = el.dataset.answerSingle;
            if (answerRaw === undefined) return undefined;
            try {
                const arr = JSON.parse(answerRaw || "[]");
                return JSON.stringify(arr.map((pair) => pair.slice().sort((a, b) => String(a).localeCompare(String(b)))).sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1]))));
            } catch (e) {
                return "[]";
            }
        },
    },
    {
        selector: ".dragndrop_fraction_wrap .drop_item",
        getValue: (el) => el.dataset.value,
        getAnswer: (el) => el.dataset.answerSingle,
    },
]);

function convertOperators(input) {
    // 입력 문자열이 문자열이 아닌 경우 문자열로 변환
    input = String(input);

    // 각 연산자를 변환
    input = input.replace(/\＋/g, "+"); // + -> ＋
    input = input.replace(/－/g, "-"); // - -> －
    input = input.replace(/÷/g, "/"); // / -> ÷
    input = input.replace(/[X*x*×]/gi, "x"); // X 또는 * 또는 x -> ×

    return input;
}

/**
 * MathField 값 또는 정답 문자열을 비교 가능한 형태로 정규화합니다.
 * (LaTeX 제거, 연산자 변환 등)
 * @param {string} value - 정규화할 문자열
 * @returns {string} - 정규화된 문자열
 */
function normalizeMathValue(value) {
    if (value === undefined || value === null) return "";
    let normalized = String(value);
    normalized = extractTextFromLatex(normalized); // LaTeX 제거 (extractTextFromLatex 함수가 있다고 가정)
    normalized = convertOperators(normalized);     // 연산자 변환
    return normalized.trim();
}

// math-field 이벤트 리스너 수정: multi-answer 우선 확인
document.querySelectorAll("math-field[data-answer-single], math-field[data-answer-multi]").forEach((mathField) => {
    // 기존 리스너 제거 (중복 방지)
    mathField.removeEventListener("input", handleMathFieldInput);
    mathField.addEventListener("input", handleMathFieldInput); // 새 핸들러 등록
});

// 분리된 math-field 핸들러
function handleMathFieldInput(event) {
    const mathField = event.target;

    // data-cross-answer 속성이 있으면 새로운 핸들러 호출하고 종료
    if (mathField.hasAttribute("data-cross-answer")) {
        handleCrossAnswerCheck(mathField);
        return;
    }

    // --- data-cross-answer가 없을 때 기존 로직 수행 ---
    let userValueRaw = (mathField.mode == 'text' ? mathField.getValue('plain-text') : mathField.getValue());
    let userValue = normalizeExpression(userValueRaw);
    console.log(`userValue - ascii: ${userValue}`);

    const answerMultiString = mathField.dataset.answerMulti;
    const answerSingle = mathField.dataset.answerSingle?.trim();

    let isCorrect = null;

    // 입력값이 비어있는 경우 correction 제거
    if (!userValueRaw || userValueRaw.trim() === "") {
        delete mathField.dataset.correction;
        window.forceWatchEvaluation(); // 빈 값 처리 후 평가 강제
        return;
    }

    // 1. Multi Answer 확인
    if (answerMultiString) {
        // Multi Answer 비교 시 정규화된 값(userValue) 사용
        isCorrect = checkMultiAnswer(userValue, answerMultiString);
    }

    // 2. Single Answer 확인
    if (isCorrect === null && answerSingle !== undefined) {
        let normalizedAnswerSingle = normalizeExpression(answerSingle);
        
        if (normalizedAnswerSingle === "empty_answer") {
            isCorrect = !userValueRaw; // empty 비교는 변환 전 raw 값으로
        } else if (userValueRaw) {
            // 입력값이 있을 때만 비교 (정규화된 값 사용)
            isCorrect = userValue === normalizedAnswerSingle;
        } else {
            isCorrect = false; // 입력 없으면 오답 (empty_answer가 아닐 때)
        }
    }

    // 3. Correction 업데이트
    if (isCorrect === true) {
        mathField.dataset.correction = "true";
    } else if (isCorrect === false) {
        mathField.dataset.correction = "false";
    } else {
        delete mathField.dataset.correction;
    }
    window.forceWatchEvaluation();
}

/**
 * 특정 셀렉터에 대해 지정한 attribute 변화 감지 시 콜백 실행
 * @param {string} selector - 대상 요소 셀렉터
 * @param {string} attributeName - 감지할 attribute 이름
 * @param {Function} callback - 변화 발생 시 실행할 함수 (triggerElement 전달됨)
 */
function observeAttributeChange(selector, attributeName, callback) {
    const observers = [];

    document.querySelectorAll(selector).forEach((target) => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === attributeName) {
                    callback(mutation.target);
                }
            });
        });

        observer.observe(target, {
            attributes: true,
            attributeFilter: [attributeName],
        });

        observers.push(observer);
    });

    return observers; // 옵저버 배열 리턴 (원할 때 disconnect 가능)
}

// 드롭다운 상태 변경 감지 - observeAttributeChange 콜백 수정
observeAttributeChange(".select_trigger", "data-value", (trigger) => {
    const select = trigger.closest(".dropdown_wrap")?.querySelector(".custom_dropdown");
    if (!select) return;

    const userValue = trigger.dataset.value;
    const answerMultiString = select.dataset.answerMulti;
    const answerSingle = select.dataset.answerSingle;

    let isCorrect = null;

    if (answerMultiString) {
        isCorrect = checkMultiAnswer(userValue, answerMultiString);
    }
    if (isCorrect === null && answerSingle !== undefined) {
        // empty_answer는 드롭다운에서 일반적으로 사용하지 않지만, 필요 시 추가
        isCorrect = userValue === answerSingle;
    }

    // Correction 업데이트
    if (isCorrect === true) {
        select.dataset.correction = "true";
    } else if (isCorrect === false) {
        select.dataset.correction = "false";
    } else {
        delete select.dataset.correction;
    }
});

// boolean 버튼 상태 변경 감지 - observeAttributeChange 콜백 수정
observeAttributeChange(".boolean_wrap button", "class", (button) => {
    // selected 클래스 변경 시 재평가
    const userValue = button.classList.contains("selected") ? "true" : "false";
    const answerMultiString = button.dataset.answerMulti;
    const answerSingle = button.dataset.answerSingle;

    let isCorrect = null;

    if (answerMultiString) {
        isCorrect = checkMultiAnswer(userValue, answerMultiString);
    }
    if (isCorrect === null && answerSingle !== undefined) {
        isCorrect = userValue === answerSingle;
    }

    // Correction 업데이트
    if (isCorrect === true) {
        button.dataset.correction = "true";
    } else if (isCorrect === false) {
        button.dataset.correction = "false";
    } else {
        delete button.dataset.correction;
    }
});

// boolean_count_wrap 버튼 class 변경 감지 시 wrapper의 correction 업데이트 필요.
// bindAnswerCheck의 핸들러가 이를 처리하므로 이 콜백은 불필요.
observeAttributeChange(".boolean_count_wrap button", "class", (button) => {
    const wrapper = button.closest(".boolean_count_wrap");
    if (!wrapper) return;

    const selectedCount = wrapper.querySelectorAll("button.selected").length;

    // 리셋 후 버튼 선택이 0개일 경우 항상 correction 제거
    if (selectedCount === 0) {
        delete wrapper.dataset.correction;
        return; // 이후 평가 로직 실행 방지
    }

    // --- 기존 평가 로직 (selectedCount > 0 인 경우에만 실행됨) ---
    const answerMultiString = wrapper.dataset.answerMulti;
    const answerSingle = wrapper.dataset.answerSingle;
    let correctCount = undefined;
    if (answerSingle !== undefined) {
        correctCount = parseInt(answerSingle, 10);
        correctCount = isNaN(correctCount) ? undefined : correctCount;
    }

    let isCorrect = null;

    if (answerMultiString) {
        isCorrect = checkMultiAnswer(selectedCount, answerMultiString);
    }
    if (isCorrect === null && correctCount !== undefined) {
        isCorrect = selectedCount === correctCount;
    }

    // Correction 업데이트
    if (isCorrect === true) {
        wrapper.dataset.correction = "true";
    } else if (isCorrect === false) {
        wrapper.dataset.correction = "false";
    } else {
        delete wrapper.dataset.correction;
    }
});

// dragndrop limit 기능에서 드래그 그룹 값 변화 감지 - observeAttributeChange 콜백 수정
observeAttributeChange(".drag_share .drag_group", "data-group-value", (groupEl) => {
    console.group("=== drag_group 상태 변경 감지 ===");
 

    // getValue 로직과 동일하게 실제 값 배열 생성
    let userValue = [];
    try {
        userValue = Array.from(groupEl.querySelectorAll(".droppable"))
            .map((d) => d.dataset.value)
            .filter((v) => v !== undefined);
        // console.log('2. 사용자 입력:', userValue);
    } catch (e) {
        console.warn("JSON 파싱 오류:", e);
    }

    // 사용자 입력이 없으면 correction 속성 제거
    if (userValue.length === 0) {
        delete groupEl.dataset.correction;
        // console.log('3. 사용자 입력 없음 - correction 제거');
        console.groupEnd();
        return;
    }

    const answerMultiString = groupEl.dataset.answerMulti;
    const answerSingle = groupEl.dataset.answerSingle;
    let answerSingleArray = undefined;
    if (answerSingle !== undefined) {
        try {
            answerSingleArray = JSON.parse(answerSingle || "[]");
        } catch {} // 파싱 실패 시 undefined 유지
    }

    let isCorrect = null;

    // Multi Answer (배열 비교)
    if (answerMultiString) {
        isCorrect = checkMultiAnswer(userValue, answerMultiString);
    }
    // Single Answer (배열 비교)
    if (isCorrect === null && Array.isArray(answerSingleArray)) {
        // checkMultiAnswer의 AND 로직과 유사하게 비교 (순서 무관)
        if (userValue.length === answerSingleArray.length) {
            const userSet = new Set(userValue.map(String));
            const answerSet = new Set(answerSingleArray.map(String));
            if (userSet.size === answerSet.size) {
                isCorrect = true;
                for (const item of userSet) {
                    if (!answerSet.has(item)) {
                        isCorrect = false;
                        break;
                    }
                }
            } else {
                isCorrect = false;
            }
        } else {
            isCorrect = false;
        }
    }

    // Correction 업데이트
    if (isCorrect === true) {
        groupEl.dataset.correction = "true";
    } else if (isCorrect === false) {
        groupEl.dataset.correction = "false";
    } else {
        delete groupEl.dataset.correction;
    }

    console.groupEnd();
});

observeAttributeChange(".letKnow li", "class", (li) => {
    window.forceWatchEvaluation();
});

/**
 * boolean 체크 선택 기능
 * 칸 선택 수 체크 기능
 */
document.querySelectorAll(".boolean_wrap > button").forEach((button) => {
    button.addEventListener("click", () => {
        // 현재 활성 페이지의 모든 버튼에서 "hint" 클래스 제거
        pagenation.activePage.querySelectorAll(".boolean_wrap > button").forEach((btn) => {
            btn.classList.remove("hint");
        });

        // 클릭한 버튼의 "selected" 클래스 토글
        button.classList.toggle("selected");
    });
});

function resetBooleanBtn() {
    const activePage = pagenation.activePage;
    if (!activePage) return; // 활성 페이지 없으면 종료

    // 현재 활성 페이지의 모든 버튼에서 "hint" 클래스 제거
    activePage.querySelectorAll(".boolean_wrap > button").forEach((button) => {
        button.classList.remove("hint");
    });

    // 현재 활성 페이지의 모든 버튼에서 "selected" 클래스 제거
    activePage.querySelectorAll(".boolean_wrap > button").forEach((button) => {
        button.classList.remove("selected");
    });
}
/** 칸 선택 수 체크 기능 */
document.querySelectorAll(".boolean_count_wrap > button").forEach((button) => {
    button.addEventListener("click", () => {
        // 현재 활성 페이지의 모든 버튼에서 "hint" 클래스 제거
        pagenation.activePage.querySelectorAll(".boolean_wrap > button").forEach((btn) => {
            btn.classList.remove("hint");
        });

        // 클릭한 버튼의 "selected" 클래스 토글
        button.classList.toggle("selected");
    });
});

function resetBooleanCount() {
    pagenation.activePage.querySelectorAll(".boolean_count_wrap").forEach((wrapper) => {
        // console.log('resetBooleanCount', wrapper);
        wrapper.classList.remove("disabled");
        wrapper.querySelectorAll("button").forEach((btn) => {
            btn.classList.remove("selected");
            btn.classList.remove("correct"); // correct 클래스 제거 추가
        });

        delete wrapper.dataset.prevSelected;
    });
}

function resetDragGroupValue() {
    pagenation.activePage.querySelectorAll(".drag_share .drag_group").forEach((group) => {
        // 그룹의 드롭 상태 초기화
        delete group.dataset.groupValue;

        // 그룹 내 드롭 요소 초기화 (선택사항)
        group.querySelectorAll(".droppable").forEach((drop) => {
            delete drop.dataset.value;
        });
    });
}

function applyBooleanCountSimplified() {
    pagenation.activePage.querySelectorAll(".boolean_count_wrap").forEach((wrapper) => {
        const allButtons = Array.from(wrapper.querySelectorAll("button"));
        const count = parseInt(wrapper.dataset.answerSingle, 10);

        // 기존 correct 클래스 제거
        allButtons.forEach((btn) => btn.classList.remove("correct"));

        // 정답 수만큼 앞에서부터 correct 부여
        if (!isNaN(count)) {
            // 유효한 숫자인 경우에만 실행
            for (let i = 0; i < count && i < allButtons.length; i++) {
                allButtons[i].classList.add("correct");
            }
        }
        // prevSelected 및 selected 클래스 관련 로직 제거됨
    });
}

function restoreBooleanCountSelection() {
    pagenation.activePage.querySelectorAll(".boolean_count_wrap").forEach((wrapper) => {
        const allButtons = Array.from(wrapper.querySelectorAll("button"));

        // 버튼들에서 correct 클래스 제거
        allButtons.forEach((btn) => {
            btn.classList.remove("correct");
        });
        // prevSelected 관련 로직 제거됨
    });
}

/****************************************************************************************************************/
/** 셀프체크 */
function resetSelfCheckRadioGroups() {
    pagenation.activePage.querySelectorAll(".self_check .state_wrap").forEach((group) => {
        // 그룹 내 선택된 라디오 버튼을 찾아 체크 해제
        group.querySelectorAll("input[type='radio']").forEach((radio) => {
            radio.checked = false;
        });
    });
}
/****************************************************************************************************************/
/** 선잇기 */

// 점선 연결 그리기 상태 변경 감지
observeAttributeChange(".drawing_area .connection_lines", "data-user-connections", (svg) => {
    const area = svg.closest(".drawing_area");
    if (!area) return;

    const normalizeConnections = (jsonStr) => {
        try {
            const arr = JSON.parse(jsonStr || "[]");
            return JSON.stringify(arr.map((pair) => pair.sort((a, b) => a - b)).sort((a, b) => a[0] - b[0] || a[1] - b[1]));
        } catch (e) {
            return "[]";
        }
    };

    const userRaw = svg.dataset.userConnections;
    const userArray = (() => {
        try {
            return JSON.parse(userRaw || "[]");
        } catch {
            return [];
        }
    })();

    const answerRaw = area.dataset.answerSingle;
    const answerArray = (() => {
        try {
            return JSON.parse(answerRaw || "[]");
        } catch {
            return [];
        }
    })();

    if (!Array.isArray(userArray) || userArray.length === 0 || userArray.length !== answerArray.length) {
        // 연결이 없거나 길이가 맞지 않으면 correction 제거
        delete area.dataset.correction;
        area.classList.remove("correct", "incorrect");
        return;
    }

    const userValue = normalizeConnections(userRaw);
    const answerValue = normalizeConnections(answerRaw);
    const isCorrect = userValue === answerValue;

    area.dataset.correction = isCorrect ? "true" : "false";
    area.classList.toggle("correct", isCorrect);
    area.classList.toggle("incorrect", !isCorrect);
});

function resetAllConnectLines() {
    const page = pagenation.activePage; // 활성 페이지 가져오기
    if (!page) { // 활성 페이지가 없으면 함수 종료
        console.warn("resetAllConnectLines: 활성 페이지를 찾을 수 없습니다.");
        return;
    }

    page.querySelectorAll('.connect_wrap').forEach(wrap => { // 활성 페이지 내에서만 선택
        const svg = wrap.querySelector('.connect_lines');
        const points = wrap.querySelectorAll('.connect_point');

        if (!svg) return;

        // 기존 선들 모두 제거
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // 연결 데이터 초기화
        wrap.dataset.connections = "[]";

        // 연결점 상태 초기화
        points.forEach(point => {
            point.classList.remove('selected', 'connected', 'dragging');
        });

        // 혹시 모를 tempLine 제거 (startDot 변수가 로컬이라 직접 접근 불가)
        const tempLine = svg.querySelector('line[stroke="#aaa"]'); // 임시 선 식별 방식 (개선 필요할 수 있음)
        if (tempLine) {
            svg.removeChild(tempLine);
        }

        // 필요한 경우, connect_wrap와 관련된 다른 상태 초기화
        // 예: 전역 변수, 특정 클래스 제거 등

        if (enableConsoleLog.connect) console.log('선긋기 리셋:', wrap.id || wrap);
    });
}

//커넥션 데이터 감지 (connect_wrap) - observeAttributeChange 콜백 수정
observeAttributeChange(".connect_wrap", "data-connections", (wrap) => {
    // getValue 로직과 동일하게 정규화된 값 생성
    let userValue = "[]";
    const connectionsRaw = wrap.dataset.connections;
    if (connectionsRaw) {
        try {
            const arr = JSON.parse(connectionsRaw);
            userValue = JSON.stringify(arr.map((pair) => pair.slice().sort((a, b) => String(a).localeCompare(String(b)))).sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1]))));
            // console.log('2. 정규화된 사용자 입력:', userValue);
        } catch (e) {
            console.warn("사용자 입력 파싱 오류:", e);
        }
    }

    const answerMultiString = wrap.dataset.answerMulti;
    const answerSingle = wrap.dataset.answerSingle; // 원시 값 가져오기
    // let answerSingleValue = undefined; // 삭제: 필요시 아래에서 파싱
    // if (answerSingle !== undefined) { // 삭제: 아래에서 처리
    //     try {
    //         answerSingleValue = JSON.parse(answerSingle || "[]"); // 삭제: 아래에서 처리
    //         // console.log('3. 정답 데이터:', {
    //         //     answerMulti: answerMultiString,
    //         //     answerSingle: answerSingleValue
    //         // });
    //     } catch (e) {
    //         console.warn("정답 데이터 파싱 오류:", e);
    //     }
    // }

    let isCorrect = null;

    // 사용자 입력이 없으면 correction 속성 제거
    if (userValue === "[]" || !userValue) {
        delete wrap.dataset.correction;
        // console.log('4. 사용자 입력 없음 - correction 제거');
        // console.groupEnd(); // 필요에 따라 로깅 유지/제거
        return;
    }

    // Multi Answer (정규화된 문자열 목록 비교 필요)
    if (answerMultiString) {
        try {
            const multiAnswerData = JSON.parse(answerMultiString);
            if (multiAnswerData && Array.isArray(multiAnswerData.values)) {
                const normalizedMultiAnswers = multiAnswerData.values.map((answer) => {
                    try {
                        // multi answer 내의 각 배열도 userValue와 동일하게 정규화
                        const arr = JSON.parse(JSON.stringify(answer)); // 깊은 복사
                        return JSON.stringify(arr.map((pair) => pair.slice().sort((a, b) => String(a).localeCompare(String(b)))).sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1]))));
                    } catch (e) {
                        return "[]"; // 파싱 오류 시 빈 배열 문자열
                    }
                });
                isCorrect = normalizedMultiAnswers.some((answer) => answer === userValue);
            }
        } catch (e) {
            console.warn("data-answer-multi 파싱 오류:", e);
        }
    }

    // Single Answer 처리
    if (isCorrect === null && answerSingle !== undefined) {
        if (answerSingle === "empty_answer") {
            // 'empty_answer' 처리: 사용자 입력이 없으면("[]") 정답
            isCorrect = (userValue === "[]");
        } else {
            // 'empty_answer'가 아니면 정답 JSON을 정규화하여 비교
            let normalizedAnswerSingleValue = "[]";
            try {
                const arr = JSON.parse(answerSingle || "[]"); // Single answer 파싱
                normalizedAnswerSingleValue = JSON.stringify(
                    arr.map((pair) => pair.slice().sort((a, b) => String(a).localeCompare(String(b))))
                       .sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1])))
                );
                isCorrect = userValue === normalizedAnswerSingleValue;
            } catch (e) {
                console.warn("Single answer JSON 파싱 또는 정규화 오류:", e, "for answer:", answerSingle);
                isCorrect = false; // 파싱/정규화 오류 시 오답 처리
            }
        }
    }

    // Correction 업데이트
    if (isCorrect === true) {
        wrap.dataset.correction = "true";
    } else if (isCorrect === false) {
        wrap.dataset.correction = "false";
    } else {
        delete wrap.dataset.correction;
    }

    // console.log('4. 최종 correction 상태:', {
    //     isCorrect,
    //     correction: wrap.dataset.correction
    // });
    console.groupEnd();
});

/****************************************************************************************************************/
/** 드래그앤드롭 수식만들기 dragndrop_fraction */

function resetDragDropFraction() {
    const activePage = pagenation.activePage; // 활성 페이지 가져오기
    if (!activePage) return; // 활성 페이지 없으면 종료

    const wrap = activePage.querySelector(".dragndrop_fraction_wrap"); // 활성 페이지 내에서 검색
    if (!wrap) return;

    // 드롭된 아이템 제거
    wrap.querySelectorAll(".drop_item .drag_item").forEach((el) => el.remove());

    // 힌트 및 정오답 속성 초기화
    wrap.querySelectorAll(".drop_item").forEach((drop) => {
        drop.classList.remove("hint");
        delete drop.dataset.value;
        delete drop.dataset.correction;
    });
}

// dragndrop_fraction 기능에서 드래그 그룹 값 변화 감지 - observeAttributeChange 콜백 수정
observeAttributeChange(".dragndrop_fraction_wrap .drop_item", "data-value", (dropEl) => {
    const dragItem = dropEl.querySelector(".drag_item");

    // 드롭된 아이템이 없으면 value와 correction 제거
    if (!dragItem) {
        delete dropEl.dataset.value;
        delete dropEl.dataset.correction;
        return;
    }

    // data-value가 설정되었을 때만 평가
    const userValue = dropEl.dataset.value;
    if (userValue === undefined) {
        delete dropEl.dataset.correction;
        return;
    }

    const answerMultiString = dropEl.dataset.answerMulti;
    const answerSingle = dropEl.dataset.answerSingle;

    let isCorrect = null;

    if (answerMultiString) {
        isCorrect = checkMultiAnswer(userValue, answerMultiString);
    }
    if (isCorrect === null && answerSingle !== undefined) {
        isCorrect = userValue === answerSingle;
    }

    // Correction 업데이트
    if (isCorrect === true) {
        dropEl.dataset.correction = "true";
    } else if (isCorrect === false) {
        dropEl.dataset.correction = "false";
    } else {
        delete dropEl.dataset.correction;
    }
});

/**
 * 캔버스 상태를 감지하는 함수
 * @returns {boolean} - 캔버스에 내용이 있으면 true, 없으면 false
 */
function checkCanvasDrawing() {
    const activePage = pagenation.activePage;
    if (!activePage) return false;

    const canvases = activePage.getElementsByTagName("canvas");
    let hasContent = false;

    Array.from(canvases).forEach((canvas) => {
        if (!window.canvasInstances) {
            console.warn("window.canvasInstances가 정의되지 않았습니다.");
            return;
        }

        const fabricCanvas = window.canvasInstances.find((c) => c.lowerCanvasEl === canvas);
        if (!fabricCanvas) return;

        // 캔버스의 모든 객체 확인
        const objects = fabricCanvas.getObjects();
        if (objects && objects.length > 0) {
            // 객체가 있는 경우
            hasContent = true;
            return;
        }

        // 캔버스의 텍스트 입력 확인
        const textInputs = canvas.closest(".drawing").querySelectorAll('input[type="text"]');
        if (textInputs && textInputs.length > 0) {
            for (let input of textInputs) {
                if (input.value && input.value.trim() !== "") {
                    hasContent = true;
                    return;
                }
            }
        }

        // 캔버스의 태그 확인
        const canvasTags = canvas.getAttribute("data-tags");
        if (canvasTags && canvasTags.trim() !== "") {
            hasContent = true;
            return;
        }
    });

    return hasContent;
}

/**
 * 캔버스 상태에 따라 UI 상태를 업데이트하는 함수
 */
function updateCanvasUIState() {
    const hasContent = checkCanvasDrawing();

    // 리셋 버튼과 샘플 버튼 찾기
    const resetButton = document.querySelector(".btnReset");
    const sampleButton = document.querySelector(".btnSample");

    if (enableConsoleLog.canvas) {
        console.log("updateCanvasUIState 실행됨");
        console.log("hasContent:", hasContent);
        console.log("resetButton:", resetButton);
        console.log("sampleButton:", sampleButton);
    }

    if (hasContent) {
        // 캔버스에 내용이 있는 경우
        if (resetButton) {
            resetButton.classList.add("active");
            resetButton.disabled = false;
        }
        if (sampleButton) {
            sampleButton.classList.add("active");
            sampleButton.disabled = false;
        }
    } else {
        // 캔버스가 비어있는 경우
        if (resetButton) {
            resetButton.classList.remove("active");
            resetButton.disabled = true;
        }
        if (sampleButton) {
            sampleButton.classList.remove("active");
            sampleButton.disabled = true;
        }
    }
}

// 페이징 이벤트 리스너 추가
document.addEventListener("DOMContentLoaded", function () {
    // 페이징 버튼 클릭 이벤트 리스너
    document.addEventListener("click", function (e) {
        if (e.target.closest(".pagination button")) {
            setTimeout(function () {
                updateCanvasUIState();
            }, 100);
        }
    });

    // 페이지 변경 이벤트 리스너
    if (pagenation) {
        const originalSetActivePage = pagenation.setActivePage;
        pagenation.setActivePage = function () {
            originalSetActivePage.apply(this, arguments);
            setTimeout(function () {
                updateCanvasUIState();
            }, 100);
        };
    }
});

// 페이지 completed 클래스 변경 감지
observeAttributeChange("#app_wrap, .page", "class", (element) => {
    if (enableConsoleLog.completionStatus) console.log("completed 클래스 변경 감지");
    const page = pagenation.activePage;
    if (page.classList.contains("completed")) {
        // 모든 버튼 비활성화
        // document.querySelectorAll(".btn_area button:not(.btnReset):not(.btnType):not(.btnSample)").forEach((btn) => {
        //     if(!btn.classList.contains("btnSelf")){
        //         btn.classList.remove("active");
        //     }
        //         btn.classList.remove("close");
        // });

        // math-field 비활성화
        page.querySelectorAll("math-field").forEach((el) => {
            el.setAttribute("disabled", "true");
        });
        // custom_dropdown 비활성화
        page.querySelectorAll(".custom_dropdown").forEach((el) => {
            el.classList.add("disabled");
        });
        // boolean 버튼 비활성화
        page.querySelectorAll(".boolean_wrap button").forEach((el) => {
            el.classList.add("disabled");
        });
        // drawing_grid_area 비활성화
        page.querySelectorAll(".drawing_grid_area").forEach((el) => {
            el.classList.add("disabled");
        });
        // drag_group 비활성화
        page.querySelectorAll(".drag_group").forEach((el) => {
            el.classList.add("disabled");
        });
        // connect_wrap 비활성화
        page.querySelectorAll(".connect_wrap").forEach((el) => {
            el.classList.add("disabled");
        });
        // dragndrop_fraction_wrap 비활성화
        page.querySelectorAll(".dragndrop_fraction_wrap").forEach((el) => {
            el.classList.add("disabled");
        });
    } else {
        // math-field 활성화
        page.querySelectorAll("math-field").forEach((el) => {
            el.removeAttribute("disabled");
        });
        // custom_dropdown 활성화
        page.querySelectorAll(".custom_dropdown").forEach((el) => {
            el.classList.remove("disabled");
        });
        // boolean 버튼 활성화
        page.querySelectorAll(".boolean_wrap button").forEach((el) => {
            el.classList.remove("disabled");
        });
        // drawing_grid_area 활성화
        page.querySelectorAll(".drawing_grid_area").forEach((el) => {
            el.classList.remove("disabled");
        });
        // drag_group 활성화
        page.querySelectorAll(".drag_group").forEach((el) => {
            el.classList.remove("disabled");
        });
        // connect_wrap 활성화
        page.querySelectorAll(".connect_wrap").forEach((el) => {
            el.classList.remove("disabled");
        });
        // dragndrop_fraction_wrap 활성화
        page.querySelectorAll(".dragndrop_fraction_wrap").forEach((el) => {
            el.classList.remove("disabled");
        });
    }
});

// 캔버스 내용 유무 (data-has-content 속성) 변경 감지 Observer
observeAttributeChange(
    "#app_wrap", // 감시 대상 상위 요소 (캔버스를 포함하는 영역)
    "attributes", // 감시할 변경 유형
    (element, mutation) => {
        // 변경이 발생한 요소가 CANVAS이고, 변경된 속성이 data-has-content 인 경우
        if (element.tagName === "CANVAS" && mutation.attributeName === "data-has-content") {
            // 활성 페이지 찾기
            let activePage;
            if (window.pagenation && window.pagenation.activePage) {
                activePage = window.pagenation.activePage;
            } else {
                activePage = document.querySelector(".page.active");
                if (!activePage) {
                    activePage = document.querySelector(".page:not(.hidden)");
                }
            }

            // 변경된 캔버스가 활성 페이지 내에 있는지 확인
            if (activePage && activePage.contains(element)) {
                // console.log(`[Observer] Active page canvas attribute 'data-has-content' changed on:`, element, 'New value:', element.getAttribute('data-has-content'));

                // watchWithCustomTest의 조건 검사를 다시 트리거 (활성 페이지 내 변경일 때만)
                if (typeof window.forceWatchEvaluation === "function") {
                    // console.log('[Observer] Triggering forceWatchEvaluation() due to active page canvas attribute change.');
                    window.forceWatchEvaluation(); // 조건 검사 다시 실행
                } else {
                    // console.warn('[Observer] forceWatchEvaluation() not found. Cannot trigger condition re-check automatically.');
                    if (enableConsoleLog.canvas) console.warn("[Observer] forceWatchEvaluation() not found. Cannot trigger condition re-check automatically.");
                }
            } else {
                // console.log(`[Observer] Inactive page canvas attribute 'data-has-content' changed. No trigger.`);
            }
        }
    },
    { attributes: true, attributeFilter: ["data-has-content"], subtree: true } // Observer 옵션: 속성 변경 감지, 특정 속성 필터링, 하위 요소 포함
);

/****************************************************************************************************************/
/**
 * 정오답 상태를 확인하고 페이지에 success, fail, fail_all 클래스 및 completed 클래스를 설정하는 함수
 * @param {Element} page - 대상 페이지 요소
 */
function checkAndSetCompletionStatus(page) {
    // 이전 상태 클래스 제거
    page.classList.remove("success", "fail", "fail_all");

    // 정오답 체크 대상 요소 선택 (다양한 유형 포함)
    const targets = page.querySelectorAll(
        "[data-answer-single]," + // 기본 입력 요소 등
            ".boolean_wrap," + // boolean 그룹
            ".boolean_count_wrap," + // boolean 개수 세기 그룹 (wrapper에 correction 있음)
            ".drawing_grid_area," + // 그리기 영역 (자체 correction 가질 수 있음)
            ".drag_group," + // 드래그 그룹 (wrapper에 correction 있음)
            ".connect_wrap," + // 선 긋기 그룹 (wrapper에 correction 있음)
            ".letCheck li," + // 카드 뒤집기 항목
            ".dragndrop_fraction_wrap .drop_item" // 분수 드래그 드롭 항목
        // 필요에 따라 다른 평가 단위 추가
    );

    let totalCorrect = 0;
    let totalIncorrect = 0;
    let evaluatedTargets = 0; // 실제 평가된 (true/false 상태가 결정된) 타겟 수

    targets.forEach((el) => {
        let isCorrect = null; // null: 미평가/미결정, true: 정답, false: 오답
        let isEvaluated = false;

        // 1. data-correction 속성 확인 (가장 일반적)
        if (el.dataset.correction === "true") {
            isCorrect = true;
            isEvaluated = true;
        } else if (el.dataset.correction === "false") {
            isCorrect = false;
            isEvaluated = true;
        }
        // 2. 특정 컨테이너/요소 타입별 예외 처리
        else if (el.matches(".boolean_wrap") && !el.dataset.correction) {
            // boolean_wrap 자체에 correction이 없을 경우 내부 버튼 확인
            let wrapCorrect = true;
            let wrapHasAnswers = false;
            let wrapIndeterminate = false; // 하나라도 미평가 버튼이 있는지

            el.querySelectorAll("button[data-answer-single]").forEach((btn) => {
                wrapHasAnswers = true;
                if (btn.dataset.correction === "false") {
                    wrapCorrect = false;
                } else if (btn.dataset.correction !== "true") {
                    // true도 false도 아니면 미결정 상태로 간주
                    wrapCorrect = false; // 하나라도 미결정/오답이면 전체는 정답 아님
                    wrapIndeterminate = true;
                }
            });

            if (wrapHasAnswers && !wrapIndeterminate) {
                isCorrect = wrapCorrect;
                isEvaluated = true;
            } else {
                // 버튼이 없거나 하나라도 미결정 상태면 평가 불가
                isEvaluated = false;
            }
        } else if (el.matches(".letCheck li")) {
            // 카드 뒤집기: 'correct' 클래스 또는 'cover' 유무로 판단
            if (el.classList.contains("correct")) {
                // 'correct' 클래스가 있으면 정답
                isCorrect = true;
                isEvaluated = true;
            } else if (!el.querySelector(".cover")) {
                // cover가 없고 'correct'가 없으면 오답으로 간주
                isCorrect = false;
                isEvaluated = true;
            } else {
                // cover가 있으면 아직 안 뒤집힌 상태 (미평가)
                isEvaluated = false;
            }
        }
        // 다른 특별한 타입의 컨테이너/요소에 대한 로직 추가 가능...

        // 평가 결과 카운트
        if (isEvaluated) {
            evaluatedTargets++;
            if (isCorrect) {
                totalCorrect++;
            } else {
                totalIncorrect++;
            }
        }
    });

    // completed 클래스는 무조건 추가
    page.classList.add("completed");

    // 최종 상태 클래스 추가 (평가된 타겟 기준)
    if (evaluatedTargets === 0) {
        // 평가된 타겟이 없으면 상태 클래스 없음 (예: 내용 없는 페이지)
    } else if (totalCorrect === evaluatedTargets) {
        page.classList.add("success"); // 모두 정답
    } else if (totalIncorrect === evaluatedTargets) {
        page.classList.add("fail_all"); // 모두 오답
    } else {
        page.classList.add("fail"); // 정답/오답 혼합 또는 일부 미평가 포함 시 (기본값: 실패)
    }

    // Call the score update function if it exists (from score.js)
    if (typeof updateTitleScoreClass === "function") {
        updateTitleScoreClass();
    } else {
        // console.warn("checkAndSetCompletionStatus: updateTitleScoreClass function not found.");
        if (enableConsoleLog.completionStatus) console.warn("checkAndSetCompletionStatus: updateTitleScoreClass function not found.");
    }
}

/* 자가 평가 스크립트 추가 (250415) */
const selfCheck = document.querySelectorAll(".self_check .state_wrap");
if (selfCheck.length > 0) {
    if (enableConsoleLog.selfCheck) console.log("자가 평가 페이지");
    const page = pagenation.activePage;

    // 리셋 버튼과 제출 버튼 찾기
    const resetButton = document.querySelector(".btnReset");
    const submitButton = document.querySelector(".btnSubmit");

    // 하나의 병아리라도 체크 시 제출 버튼 활성화
    selfCheck.forEach((self) => {
        const selfCheckInput = self.querySelectorAll("input");

        selfCheckInput.forEach((input) => {
            input.addEventListener("input", function () {
                resetButton.classList.add("active");
                submitButton.classList.add("active");
            });
        });
    });

    resetButton.addEventListener("click", function () {
        resetButton.classList.remove("active");
        submitButton.classList.remove("active");
    });

    submitButton.addEventListener("click", function () {
        let inputCheck = 0;

        selfCheck.forEach((self) => {
            const checkedSelfCheckInput = self.querySelectorAll("input:checked");
            if (checkedSelfCheckInput.length > 0) {
                inputCheck++;
            }
        });

        // 병아리가 모두 체크되었을 때
        if (inputCheck == selfCheck.length) {
            toastCheckMsg("선생님께 제출되었습니다.", 5, false);
            page.classList.add("completed");
            submitButton.classList.add("close");

            // 하나라도 체크가 되어있지 않을 때
        } else {
            toastCheckMsg("해당하는 표정을 선택해 보세요.", 1, false);
            return;
        }
    });
}

/**
 * data-cross-answer 속성을 가진 math-field 쌍(2개 이상)의 정답 여부를 교차 확인합니다.
 * 입력된 값들의 집합과 정답들의 집합이 일치하면 정답으로 처리합니다 (순서 무관).
 * @param {Element} currentField - 이벤트가 발생한 math-field 요소
 */
function handleCrossAnswerCheck(currentField) {
    const crossAnswerValue = currentField.dataset.crossAnswer;
    if (!crossAnswerValue) return; // cross-answer 속성 없으면 종료

    const activePage = pagenation.activePage;
    if (!activePage) return;

    // 활성 페이지 내에서 같은 cross-answer 값을 가진 다른 math-field 찾기
    const pairFields = Array.from(
        activePage.querySelectorAll(
            `math-field[data-cross-answer="${crossAnswerValue}"]`
        )
    );

    const n = pairFields.length;

    // 최소 2개 이상의 필드가 쌍으로 존재해야 함
    if (n < 2) {
        // 1개 이하면 로직 실행 안 함 (필요시 경고 추가)
        // console.warn(`[Cross Answer Check] Found less than 2 fields for cross-answer="${crossAnswerValue}".`);
        return;
    }

    // 각 필드의 값과 정답 가져오기
    const valueRawList = pairFields.map(field => (field.mode == 'text' ? field.getValue("plain-text") : field.getValue("")) || "");
    const answerList = pairFields.map(field => field.dataset.answerSingle);

    // 정답 정보가 하나라도 없으면 처리 중단
    if (answerList.some(answer => answer === undefined)) {
        console.warn(`[Cross Answer Check] Missing data-answer-single for one or more fields in cross-answer="${crossAnswerValue}".`);
        // 모든 필드 correction 제거하고 종료
        pairFields.forEach(field => delete field.dataset.correction);
        return;
    }

    // 필드 중 하나라도 비어있으면 correction 제거하고 종료
    if (valueRawList.some(value => value.trim() === "")) {
        pairFields.forEach(field => delete field.dataset.correction);
        window.forceWatchEvaluation(); // UI 업데이트 위해 호출
        return;
    }

    // 값과 정답 정규화
    const normalizedValueList = valueRawList.map(normalizeExpression);
    const normalizedAnswerList = answerList.map(normalizeExpression);

    // 정렬하여 순서 무관 비교 준비
    const sortedValues = [...normalizedValueList].sort();
    const sortedAnswers = [...normalizedAnswerList].sort();

    // 정렬된 값 배열과 정답 배열 비교
    const isCorrect = JSON.stringify(sortedValues) === JSON.stringify(sortedAnswers);

    // 모든 필드의 correction 상태 동시 업데이트
    pairFields.forEach(field => {
        field.dataset.correction = isCorrect ? "true" : "false";
    });

    // 디버깅 로그 (옵션)
    if (enableConsoleLog.checkAnswer) {
        console.log(`[Cross Answer Check] cross-answer="${crossAnswerValue}" (n=${n}): values=${JSON.stringify(sortedValues)}, answers=${JSON.stringify(sortedAnswers)} => isCorrect: ${isCorrect}`);
    }

    window.forceWatchEvaluation(); // 버튼 상태 등 업데이트 위해 호출
}

/**
 * 특정 셀렉터에 대해 지정한 attribute 변화 감지 시 콜백 실행
 * @param {string} selector - 대상 요소 셀렉터
 * @param {string} attributeName - 감지할 attribute 이름
 * @param {Function} callback - 변화 발생 시 실행할 함수 (triggerElement 전달됨)
 */
function observeAttributeChange(selector, attributeName, callback) {
    const observers = [];

    document.querySelectorAll(selector).forEach((target) => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === attributeName) {
                    callback(mutation.target);
                }
            });
        });

        observer.observe(target, {
            attributes: true,
            attributeFilter: [attributeName],
        });

        observers.push(observer);
    });

    return observers; // 옵저버 배열 리턴 (원할 때 disconnect 가능)
}