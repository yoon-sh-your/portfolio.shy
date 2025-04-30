/**
 * 상태 관찰 및 버튼 관리 시스템
 * 
 * 이 파일은 애플리케이션의 상태 변화를 관찰하고, 버튼의 활성화/비활성화 상태를 관리합니다.
 * 주요 기능:
 * 1. DOM 요소의 상태 변화 감지
 * 2. 버튼 상태 관리 및 업데이트
 * 3. 이벤트 리스너 설정 및 관리
 * 4. 상태 변화에 따른 콜백 처리
 */

/**
 * 상태 관찰을 위한 전역 객체
 * 
 * @type {Object}
 * @property {Set} targets - 관찰 대상 요소들의 집합
 * @property {Object} callbacks - 상태 변화 시 실행될 콜백 함수들
 * @property {Object} executed - 콜백 실행 상태 추적
 * @property {Map} debounceTimers - 디바운스 타이머 관리
 */
const observerState = {
    targets: new Set(),
    callbacks: {
        allEmpty: new Set(),
        someValue: new Set(),
        allValue: new Set()
    },
    executed: {
        allEmpty: false,
        someValue: false,
        allValue: false
    },
    debounceTimers: new Map()
};

/**
 * 디바운스 유틸리티 함수
 * 
 * @function debounce
 * @param {Function} func - 실행할 함수
 * @param {number} wait - 대기 시간(ms)
 * @returns {Function} - 디바운스 처리된 함수
 * @description 연속된 함수 호출을 일정 시간 간격으로 제한하여 성능 최적화
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * DOM 속성 변화 관찰 함수
 * 
 * @function observeAttributeChange
 * @param {string} selector - 관찰할 요소 선택자
 * @param {string} attribute - 관찰할 속성명
 * @param {Function} callback - 속성 변화 시 실행할 콜백
 * @description 지정된 요소의 속성 변화를 감지하고 콜백을 실행
 */
function observeAttributeChange(selector, attribute, callback) {
    const config = {
        attributes: true,
        attributeFilter: [attribute]
    };

    const mutationCallback = (mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === attribute) {
                const target = mutation.target;
                
                // 1. 비활성화 상태 체크 (더 엄격하게)
                if (target.classList.contains("disabled") || 
                    target.hasAttribute("disabled") || 
                    target.closest(".disabled") || 
                    target.closest("[disabled]")) {
                    return;
                }

                // 2. 입력값이 있는 경우에만 콜백 실행
                if (target.tagName === "MATH-FIELD") {
                    if (target.value?.trim() === "") {
                        return;
                    }
                } else if (!target.dataset.correction) {
                    return;
                }

                // 3. 모든 조건을 통과한 경우에만 콜백 실행
                callback(target);
            }
        });
    };

    const observer = new MutationObserver(mutationCallback);

    function observe() {
        document.querySelectorAll(selector).forEach(element => {
            // 관찰 시작 전에도 비활성화 상태 체크
            if (!element.classList.contains("disabled") && 
                !element.hasAttribute("disabled") && 
                !element.closest(".disabled") && 
                !element.closest("[disabled]")) {
                observer.observe(element, config);
            }
        });
    }

    observe();

    const domObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                observe();
            }
        });
    });

    domObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * MathField 이벤트 초기화
 * 
 * @function initMathFieldEvents
 * @param {HTMLElement} mathField - 수학 입력 필드 요소
 * @description 수학 입력 필드의 이벤트 리스너를 설정하고 상태 변화를 감지
 */
function initMathFieldEvents(mathField) {
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const debouncedCheckState = debounce(checkState, 100, uniqueId);

    const updateCorrection = () => {
        const value = mathField.value?.trim() || "";
        const answerValue = mathField.dataset.answerSingle?.trim();
        
        if (answerValue === "empty_answer") {
            mathField.dataset.correction = value === "" ? "true" : "false";
        } else if (value === "") {
            delete mathField.dataset.correction;
        } else {
            mathField.dataset.correction = value === answerValue ? "true" : "false";
        }
        
        checkState();
    };

    // 기본 이벤트 리스너 설정
    mathField.addEventListener('change', updateCorrection);
    mathField.addEventListener('focus', e => e.target.classList.add('focused'));
    mathField.addEventListener('blur', e => {
        e.target.classList.remove('focused');
        updateCorrection();
    });
    mathField.addEventListener('keyup', updateCorrection);

    // 키패드 입력 감지 개선
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                if (window.keypadModeState.isKeypadMode) {
                    updateCorrection();
                } else {
                    debouncedCheckState();
                }
            }
        });
    });

    observer.observe(mathField, {
        attributes: true,
        attributeFilter: ['value']
    });

    addObserverTarget(mathField, uniqueId);
}

document.querySelectorAll('math-field').forEach(initMathFieldEvents);

const mathFieldObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.tagName === 'MATH-FIELD') {
                        initMathFieldEvents(node);
                    }
                    node.querySelectorAll('math-field').forEach(initMathFieldEvents);
                }
            });
        }
    });
});

mathFieldObserver.observe(document.body, {
    childList: true,
    subtree: true
});

function checkState() {
    const context = createButtonContext();
    evaluateButtonStates(context);
}

// 상태 관리 함수들
function addObserverTarget(target, id) {
    if (!observerState.targets.has(target)) {
        observerState.targets.add(target);
        const debouncedCheck = debounce(checkState, 100, id);
        target.addEventListener('input', debouncedCheck);
        target.addEventListener('change', debouncedCheck);
    }
}

function addStateCallback(type, callback) {
    if (observerState.callbacks[type]) {
        observerState.callbacks[type].add(callback);
    }
}

/**
 * 버튼 상태 관리 클래스
 * 
 * @class ButtonStateManager
 * @description 버튼의 활성화/비활성화 상태를 관리하고 UI 업데이트를 처리
 */
class ButtonStateManager {
    constructor(configMap) {
        this.states = {};
        this.initializeStates(configMap);
    }

    /**
     * 상태 초기화
     * 
     * @method initializeStates
     * @param {Object} configMap - 버튼 설정 정보
     * @private
     */
    initializeStates(configMap) {
        Object.entries(configMap).forEach(([key, config]) => {
            const { element, toggleClass } = config;
            if (!element) return;

            const [get, set, subscribe] = this.#createState(false);
            const [getClose, setClose, subscribeClose] = this.#createState(false);

            this.states[key] = { element, toggleClass, get, set, subscribe, getClose, setClose, subscribeClose };

            subscribe(isActive => element.classList.toggle(toggleClass, isActive));
            subscribeClose(isClose => element.classList.toggle("close", isClose));
        });
    }

    #createState(initialValue) {
        let value = initialValue;
        const listeners = new Set();

        return [
            () => value,
            (newValue) => {
                if (value !== newValue) {
                    value = newValue;
                    listeners.forEach(fn => fn(value));
                }
            },
            (callback) => {
                listeners.add(callback);
                return () => listeners.delete(callback);
            }
        ];
    }

    set(key, value, isClose = false) {
        if (!this.states[key]) return;
        isClose ? this.states[key].setClose(value) : this.states[key].set(value);
    }

    get(key, isClose = false) {
        if (!this.states[key]) return false;
        return isClose ? this.states[key].getClose() : this.states[key].get();
    }

    toggle(key, isClose = false) {
        if (!this.states[key]) return;
        const current = this.get(key, isClose);
        this.set(key, !current, isClose);
    }

    onChange(key, callback) {
        if (!this.states[key]) return () => {};
        return this.states[key].subscribe(callback);
    }

    setAll(state) {
        Object.keys(this.states).forEach(key => this.set(key, state));
    }

    resetAll() {
        this.setAll(false);
    }
}

const btnManager = new ButtonStateManager({
    key: { element: document.querySelector(".btnType.key"), toggleClass: "keypad" },
    reset: { element: document.querySelector(".btnReset"), toggleClass: "active" },
    check: { element: document.querySelector(".btnCheck"), toggleClass: "active" },
    submit: { element: document.querySelector(".btnSubmit"), toggleClass: "active" },
    sample: { element: document.querySelector(".btnSample"), toggleClass: "active" }
});

// 버튼 클릭 이벤트 리스너 설정
if (btnManager.states.key?.element) {
    btnManager.states.key.element.addEventListener("click", () => {
        toggleKeypadMode(btnManager.states.key.element);
    });
}

if (btnManager.states.reset?.element) {
    btnManager.states.reset.element.addEventListener("click", () => {
        resetFields();
        btnManager.states.reset.element.classList.remove("active");
        
        // 모든 버튼의 active 상태 제거
        btnManager.setAll(false);
        
        // 모든 버튼의 close 상태 제거
        document.querySelectorAll(".btn_area button").forEach(btn => {
            btn.classList.remove("close");
        });
    });
}

if (btnManager.states.check?.element) {
    btnManager.states.check.element.addEventListener("click", () => {
        checkAnswerFields(btnManager.states.check.element);
    });
}

if (btnManager.states.sample?.element) {
    btnManager.states.sample.element.addEventListener("click", () => {
        showExampleFields(btnManager.states.sample.element);
    });
}

if (btnManager.states.submit?.element) {
    btnManager.states.submit.element.addEventListener("click", () => {
        submitFields(btnManager.states.submit.element);
    });
}

const actions = document.querySelector(".btn_area");
const hasTypeBtn = !!btnManager.states.key?.element;
const hasResetBtn = !!btnManager.states.reset?.element;
const hasCheckBtn = !!btnManager.states.check?.element;
const hasSampleBtn = !!btnManager.states.sample?.element;
const hasSubmitBtn = !!btnManager.states.submit?.element;

/**
 * 버튼 상태 평가 함수들
 * 
 * @function evaluateButtonStates
 * @param {Object} context - 버튼 상태 평가를 위한 컨텍스트
 * @description 각 버튼의 활성화/비활성화 상태를 평가하고 업데이트
 */
function evaluateButtonStates(context) {
    const { isResetActive, isCheckActive, isCheckClose, isSampleActive, isSampleClose, isSubmitActive, isSubmitClose } = context;

    setResetButton(isResetActive, false);
    setCheckButton(isCheckActive, isCheckClose);
    setSampleButton(isSampleActive, isSampleClose);
    setSubmitButton(isSubmitActive, isSubmitClose);
}

function setResetButton(isActive, isClose = false) {
    if (!hasResetBtn) return;
    btnManager.set("reset", isActive, isClose);
}

function setCheckButton(isActive, isClose = false) {
    if (!hasCheckBtn) return;
    btnManager.set("check", isActive, isClose);
}

function setSampleButton(isActive, isClose = false) {
    if (!hasSampleBtn) return;
    btnManager.set("sample", isActive, isClose);
}

function setSubmitButton(isActive, isClose = false) {
    if (!hasSubmitBtn) return;
    btnManager.set("submit", isActive, isClose);
}

// 전역 상태 초기화
window.createButtonContext = function() {
    return {
        isResetActive: typeof window.isResetActive === 'function' && window.isResetActive(),
        isCheckActive: typeof window.isCheckActive === 'function' && window.isCheckActive(),
        isCheckClose: typeof window.isCheckClose === 'function' && window.isCheckClose(),
        isSampleActive: typeof window.isSampleActive === 'function' && window.isSampleActive(),
        isSampleClose: typeof window.isSampleClose === 'function' && window.isSampleClose(),
        isSubmitActive: typeof window.isSubmitActive === 'function' && window.isSubmitActive(),
        isSubmitClose: typeof window.isSubmitClose === 'function' && window.isSubmitClose(),
    };
};

// 공통 조건 체크 함수
function hasUserInteraction(page) {
    if (!page) return false;

    // math-field 입력값 확인
    const mathFields = page.querySelectorAll(".input_wrap math-field");
    if (Array.from(mathFields).some(el => el.value?.trim() !== "")) return true;

    // drawing_area 연결 확인
    const drawingArea = page.querySelector(".drawing_area");
    if (drawingArea) {
        const svg = drawingArea.querySelector("svg");
        if (svg) {
            try {
                const userConnections = JSON.parse(svg.dataset.userConnections || "[]");
                if (userConnections.length > 0) return true;
            } catch (e) {}
        }
    }

    // connect_wrap 연결 확인
    const connectWrap = page.querySelector(".connect_wrap");
    if (connectWrap && connectWrap.dataset.connections !== "[]") return true;

    // boolean_wrap 선택 확인
    const booleanWrap = page.querySelector(".boolean_wrap");
    if (booleanWrap && booleanWrap.querySelectorAll("button.selected").length > 0) return true;

    // boolean_count_wrap 선택 확인
    const booleanCountWrap = page.querySelector(".boolean_count_wrap");
    if (booleanCountWrap && booleanCountWrap.querySelectorAll("button.selected").length > 0) return true;

    // drag_share 그룹값 확인
    const dragShare = page.querySelector(".drag_share .drag_group");
    if (dragShare && dragShare.dataset.groupValue !== undefined) return true;

    // self_check 라디오 선택 확인
    const selfCheck = page.querySelector(".self_check .state_wrap");
    if (selfCheck && selfCheck.querySelector("input[type='radio']:checked") !== null) return true;

    // dragndrop_fraction_wrap 값 확인
    const dragndropFractionWrap = page.querySelector(".dragndrop_fraction_wrap .drop_item");
    if (dragndropFractionWrap && dragndropFractionWrap.dataset.value !== undefined && dragndropFractionWrap.dataset.value !== "") return true;

    // 드롭다운 값 선택 확인
    const customDropdowns = page.querySelectorAll(".custom_dropdown");
    if (customDropdowns.length > 0) {
        const hasSelectedValue = Array.from(customDropdowns).some(dropdown => {
            const trigger = dropdown.nextElementSibling?.querySelector('.select_trigger');
            return trigger?.dataset.value !== undefined;
        });
        if (hasSelectedValue) return true;
    }

    return false;
}

// 버튼 상태 검사 유틸리티
const ButtonStateUtils = {
    // 예제 관련 상태 검사
    hasExampleBox(page) {
        const exampleBox = page.querySelector(".example_box");
        return {
            element: exampleBox,
            isOn: exampleBox?.classList.contains("on") || false
        };
    },

    // 수학 필드 관련 상태 검사
    hasMathFieldValue(page) {
        const mathFields = page.querySelectorAll(".input_wrap math-field");
        return Array.from(mathFields).some(el => el.value?.trim() !== "");
    },

    // 드롭다운 관련 상태 검사
    hasDropdownValue(page) {
        const customDropdowns = page.querySelectorAll(".custom_dropdown");
        return Array.from(customDropdowns).some(dropdown => {
            const trigger = dropdown.nextElementSibling?.querySelector('.select_trigger');
            return trigger?.dataset.value !== undefined;
        });
    },

    // 불리언 버튼 관련 상태 검사
    hasBooleanSelection(page) {
        const booleanWrap = page.querySelector(".boolean_wrap");
        return booleanWrap?.querySelectorAll("button.selected").length > 0 || false;
    },

    // 불리언 카운트 관련 상태 검사
    hasBooleanCountSelection(page) {
        const booleanCountWrap = page.querySelector(".boolean_count_wrap");
        return {
            element: booleanCountWrap,
            hasSelection: booleanCountWrap?.querySelectorAll("button.selected").length > 0 || false,
            hasPrevSelected: booleanCountWrap?.hasAttribute("data-prev-selected") || false
        };
    },

    // 입력 필드 상태 검사
    checkInputFields(page) {
        const inputs = page.querySelectorAll("math-field, [data-answer-single]");
        if (inputs.length === 0) return false;

        return Array.from(inputs).every(input => {
            if (input.tagName === "MATH-FIELD") {
                return input.value?.trim() !== "";
            } else {
                return input.dataset.correction !== undefined;
            }
        });
    }
};

// 기본 버튼 상태 함수들
window.isResetActive = function() {
    const page = pagenation.activePage;
    if (!page) return false;

    // 기본 사용자 상호작용 체크
    if (hasUserInteraction(page)) return true;

    // 추가 리셋 조건
    const { element: exampleBox, isOn } = ButtonStateUtils.hasExampleBox(page);
    if (exampleBox && isOn) return true;

    return false;
};

window.isCheckActive = function() {
    const page = pagenation.activePage;
    if (!page) return false;

    // 기본 사용자 상호작용 체크
    if (hasUserInteraction(page)) return true;

    // reveal 버튼만 있는 경우 체크
    const revealBtns = page.querySelectorAll(".reveal_btn");
    const hasOnlyReveal = revealBtns.length > 0 && page.querySelectorAll("[data-answer-single]:not(.reveal_btn)").length === 0;
    
    if (hasOnlyReveal && !Array.from(revealBtns).every(el => el.classList.contains("on"))) {
        return true;
    }

    return false;
};

window.isCheckClose = function() {
    const page = pagenation.activePage;
    if (!page) return false;

    // reveal_btn이 단독으로 있고 모두 on 상태인 경우
    const revealBtns = page.querySelectorAll(".reveal_btn");
    if (revealBtns.length > 0) {
        const hasOtherAnswers = page.querySelectorAll("[data-answer-single]:not(.reveal_btn)").length === 0;
        if (hasOtherAnswers && Array.from(revealBtns).every(el => el.classList.contains("on"))) return true;
    }

    // example_box가 on 상태인 경우
    const exampleBox = page.querySelector(".example_box");
    if (exampleBox && exampleBox.classList.contains("on")) return true;

    return false;
};

window.isSampleActive = function() {
    const page = pagenation.activePage;
    if (!page) return false;

    // textarea_with_example 조건 확인
    const textareaWithExample = page.querySelector(".input_wrap math-field.textarea");
    if (textareaWithExample) {
        const filled = textareaWithExample.value?.trim() !== "";
        const hasExample = !!textareaWithExample.closest(".input_wrap")?.querySelector(".example_box");
        if (filled && hasExample) return true;
    }

    // boolean_count_wrap이 있는 경우
    const { element: booleanCountWrap } = ButtonStateUtils.hasBooleanCountSelection(page);
    if (booleanCountWrap) return true;

    // example_box가 on 상태가 아닌 경우
    const { element: exampleBox, isOn } = ButtonStateUtils.hasExampleBox(page);
    if (exampleBox && !isOn) {
        // example_box와 형제 관계에 있는 math-field 찾기
        const mathField = exampleBox.parentElement.querySelector("math-field");
        if (mathField && mathField.value?.trim() !== "") return true;
    }

    return false;
};

window.isSampleClose = function() {
    const page = pagenation.activePage;
    if (!page) return false;

    // example_box 상태 확인
    const { element: exampleBox, isOn } = ButtonStateUtils.hasExampleBox(page);
    if (exampleBox && isOn) return true;

    // boolean_count_wrap 상태 확인
    const { element: booleanCountWrap, hasPrevSelected } = ButtonStateUtils.hasBooleanCountSelection(page);
    if (booleanCountWrap && hasPrevSelected) return true;

    return false;
};

window.isSubmitActive = function() {
    const page = pagenation.activePage;
    if (!page) return false;
    return ButtonStateUtils.checkInputFields(page);
};

window.isSubmitClose = function() {
    const page = pagenation.activePage;
    if (!page) return false;

    const submitBtn = document.querySelector(".btnSubmit");
    return submitBtn && submitBtn.classList.contains("close");
};

function isCheckActive(page) {
    // 커스텀 타겟이 있는지 확인
    if (typeof window.getCustomTargets === "function") {
        const customTargets = window.getCustomTargets(page);
        if (customTargets && customTargets.length > 0) {
            // 커스텀 검사 조건이 있는 경우
            if (typeof window.customCheckCondition === "function") {
                for (const target of customTargets) {
                    const result = window.customCheckCondition(target);
                    if (result === true) return true;
                }
            }
            // 커스텀 검사 조건이 없는 경우 기본 검사
            for (const target of customTargets) {
                const val = $(target).val();
                if (val && val !== "") return true;
            }
        }
    }

    // 기본 검사 로직
    const hasDrawingArea = page.querySelector(".drawing_area");
    if (hasDrawingArea) {
        const svg = hasDrawingArea.querySelector("svg");
        if (svg) {
            const userConnections = svg.querySelectorAll(".user_connection");
            if (userConnections.length > 0) return true;
        }
    }

    const connectWrap = page.querySelector(".connect_wrap");
    if (connectWrap) {
        const connections = connectWrap.dataset.connections;
        if (connections && connections !== "[]") return true;
    }

    const booleanWrap = page.querySelector(".boolean_wrap");
    if (booleanWrap) {
        const selectedButtons = booleanWrap.querySelectorAll("button.selected");
        if (selectedButtons.length > 0) return true;
    }

    const booleanCountWrap = page.querySelector(".boolean_count_wrap");
    if (booleanCountWrap) {
        const selectedButtons = booleanCountWrap.querySelectorAll("button.selected");
        if (selectedButtons.length > 0) return true;
    }

    const dragShare = page.querySelector(".drag_share");
    if (dragShare) {
        const groupValue = dragShare.dataset.groupValue;
        if (groupValue !== undefined) return true;
    }

    const selfCheck = page.querySelector(".self_check");
    if (selfCheck) {
        const checkedRadios = selfCheck.querySelectorAll("input[type='radio']:checked");
        if (checkedRadios.length > 0) return true;
    }

    const dragndropFractionWrap = page.querySelector(".dragndrop_fraction_wrap");
    if (dragndropFractionWrap) {
        const value = dragndropFractionWrap.dataset.value;
        if (value !== undefined && value !== "") return true;
    }

    return false;
}

function isResetActive(page) {
    // 커스텀 타겟이 있는지 확인
    if (typeof window.getCustomTargets === "function") {
        const customTargets = window.getCustomTargets(page);
        if (customTargets && customTargets.length > 0) {
            for (const target of customTargets) {
                const val = $(target).val();
                if (val && val !== "") return true;
            }
        }
    }

    // 기본 검사 로직
    const hasDrawingArea = page.querySelector(".drawing_area");
    if (hasDrawingArea) {
        const svg = hasDrawingArea.querySelector("svg");
        if (svg) {
            const userConnections = svg.querySelectorAll(".user_connection");
            if (userConnections.length > 0) return true;
        }
    }

    const connectWrap = page.querySelector(".connect_wrap");
    if (connectWrap) {
        const connections = connectWrap.dataset.connections;
        if (connections && connections !== "[]") return true;
    }

    const booleanWrap = page.querySelector(".boolean_wrap");
    if (booleanWrap) {
        const selectedButtons = booleanWrap.querySelectorAll("button.selected");
        if (selectedButtons.length > 0) return true;
    }

    const booleanCountWrap = page.querySelector(".boolean_count_wrap");
    if (booleanCountWrap) {
        const selectedButtons = booleanCountWrap.querySelectorAll("button.selected");
        if (selectedButtons.length > 0) return true;
    }

    const dragShare = page.querySelector(".drag_share");
    if (dragShare) {
        const groupValue = dragShare.dataset.groupValue;
        if (groupValue !== undefined) return true;
    }

    const selfCheck = page.querySelector(".self_check");
    if (selfCheck) {
        const checkedRadios = selfCheck.querySelectorAll("input[type='radio']:checked");
        if (checkedRadios.length > 0) return true;
    }

    const dragndropFractionWrap = page.querySelector(".dragndrop_fraction_wrap");
    if (dragndropFractionWrap) {
        const value = dragndropFractionWrap.dataset.value;
        if (value !== undefined && value !== "") return true;
    }

    return false;
}


/***** 상태감지 구문들 *******/
// 드롭다운 상태 변경 감지
observeAttributeChange(".select_trigger", "data-value", (trigger) => {
    const select = trigger.closest(".dropdown_wrap")?.querySelector(".custom_dropdown");
    if (!select) return;

    const userValue = trigger.dataset.value;
    const answerValue = select.dataset.answerSingle;
    const isCorrect = userValue === answerValue;

    select.dataset.correction = isCorrect ? "true" : "false";
    checkState(); // 상태 변경 감지 후 버튼 상태 업데이트
});


// boolean 버튼 상태 변경 감지
observeAttributeChange(".boolean_wrap button", "class", (button) => {
    const userValue = button.classList.contains("selected") ? "true" : "false";
    const answerValue = button.dataset.answerSingle;
    const isCorrect = userValue === answerValue;

    button.dataset.correction = isCorrect ? "true" : "false";
});

// boolean_count_wrap 상태 변경 감지
observeAttributeChange(".boolean_count_wrap button", "class", (button) => {
    const wrapper = button.closest(".boolean_count_wrap");
    if (!wrapper) return;

    const selectedCount = wrapper.querySelectorAll("button.selected").length;
    const correctCount = parseInt(wrapper.dataset.answerSingle, 10);
    const isCorrect = selectedCount === correctCount;

    wrapper.dataset.correction = isCorrect ? "true" : "false";
    checkState();
});

// self_check 라디오 버튼 상태 변경 감지
observeAttributeChange(".self_check input[type='radio']", "checked", (radio) => {
    const wrapper = radio.closest(".self_check");
    if (!wrapper) return;

    const selectedRadio = wrapper.querySelector("input[type='radio']:checked");
    const isCorrect = selectedRadio?.value === wrapper.dataset.answerSingle;

    wrapper.dataset.correction = isCorrect ? "true" : "false";
    checkState();
});

// drag_share 그룹 상태 변경 감지
observeAttributeChange(".drag_share .drag_group", "data-group-value", (groupEl) => {
    const groupValue = groupEl.dataset.groupValue;
    const answerValue = groupEl.dataset.answerSingle;

    let userArray = [];
    let answerArray = [];

    try {
        userArray = JSON.parse(groupValue || "[]");
        answerArray = JSON.parse(answerValue || "[]");
    } catch (e) {
        console.warn("JSON 파싱 오류:", e);
    }

    const isCorrect = (() => {
        if (!Array.isArray(userArray) || !Array.isArray(answerArray)) return false;
        if (userArray.length !== answerArray.length) return false;

        const sortedUser = [...userArray].sort();
        const sortedAnswer = [...answerArray].sort();

        return sortedUser.every((v, i) => v === sortedAnswer[i]);
    })();

    groupEl.dataset.correction = isCorrect ? "true" : "false";
    checkState();
});

// 점선 연결 그리기 상태 변경 감지
observeAttributeChange(".drawing_area .connection_lines", "data-user-connections", (svg) => {
    const area = svg.closest(".drawing_area");
    if (!area) return;

    const normalizeConnections = (jsonStr) => {
        try {
            const arr = JSON.parse(jsonStr || "[]");
            return JSON.stringify(
                arr.map(pair => pair.sort((a, b) => a - b))
                .sort((a, b) => a[0] - b[0] || a[1] - b[1])
            );
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

    if (!Array.isArray(userArray) || userArray.length === 0) {
        delete area.dataset.correction;
        area.classList.remove("correct", "incorrect");
        return;
    }

    const userValue = normalizeConnections(userRaw);
    const answerValue = normalizeConnections(area.dataset.answerSingle);
    const isCorrect = userValue === answerValue;

    area.dataset.correction = isCorrect ? "true" : "false";
    area.classList.toggle("correct", isCorrect);
    area.classList.toggle("incorrect", !isCorrect);
});

function resetAllConnectLines() {
    document.querySelectorAll('.connect_wrap').forEach(wrap => {
        const svg = wrap.querySelector('.connect_lines');

        // 모든 선 제거
        svg.querySelectorAll('line').forEach(line => line.remove());

        // 연결 상태 초기화
        wrap.dataset.connections = "[]";

        // 연결 관련 클래스 제거
        wrap.querySelectorAll('.connect_point').forEach(point => {
            point.classList.remove('connected', 'selected', 'dragging');
        });
    });
}

//커넥션 데이터 감지
observeAttributeChange(".connect_wrap", "data-connections", (wrap) => {
    const normalizeConnections = (jsonStr) => {
        try {
            const arr = JSON.parse(jsonStr || "[]");
            return JSON.stringify(
                arr.map(pair => pair.slice().sort())
                .sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]))
            );
        } catch (e) {
            return "[]";
        }
    };

    const userValue = normalizeConnections(wrap.dataset.connections);
    const answerValue = normalizeConnections(wrap.dataset.answerSingle); // ✅ 여기 주의
    const isCorrect = userValue === answerValue;

    wrap.dataset.correction = isCorrect ? "true" : "false";
});

// dragndrop_fraction 기능에서 드래그 그룹 값 변화 감지
observeAttributeChange(".dragndrop_fraction_wrap .drop_item", "data-value", (dropEl) => {
    const dragItem = dropEl.querySelector(".drag_item");

    if (!dragItem) {
        delete dropEl.dataset.value;
        delete dropEl.dataset.correction;
        return;
    }

    const userValue = dropEl.dataset.value;
    const answerValue = dropEl.dataset.answerSingle;
    const isCorrect = userValue === answerValue;

    dropEl.dataset.correction = isCorrect ? "true" : "false";
});

// 정오답 체크 상태 감지
observeAttributeChange("[data-answer-single]", "data-correction", (element) => {
    checkState();
});
