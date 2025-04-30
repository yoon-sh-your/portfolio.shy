const bingoGrid = document.querySelectorAll(".btn_grid li");
const startBtn = document.querySelector(".ready");
const resetBtn = document.querySelector(".btnReset");
const btnSubmit = document.querySelector(".btnSubmit");
const drawBtn = document.querySelector(".card_back");
const cardContainer = document.querySelector(".card_num_wrap");
const formulaInputs = document.querySelectorAll(".input_area .input_wrap math-field:not(.textarea)");
const checkBtn = document.querySelector(".calc-check");
const calcResetBtn = document.querySelector(".calc-reset");
const toggleSwitch = document.getElementById("toggleSwitch");
const tutorialStep = document.querySelector(".tutorial-steps");

let drawnNumbers = [];
let prevBingoCount = 0;

// 튜토리얼 클릭 시 닫기
if (tutorialStep) {
    tutorialStep.addEventListener("click", () => {
        tutorialStep.style.display = "none";
    });
}

// 빙고판 input 생성 및 이벤트 연결
bingoGrid.forEach((li) => {
    li.innerHTML = ""; // 기존 내용 제거

    // reveal_btn 생성
    const revealBtn = document.createElement("button");
    revealBtn.classList.add("reveal_btn");
    revealBtn.setAttribute("aria-label", "빙고판 숫자 보기");

    // input 생성
    const input = document.createElement("input");
    input.type = "number";
    input.min = 1;
    input.max = 25;
    input.classList.add("bingo_input", "num");

    // 초기에 토글 상태에 따라 보이기 설정
    if (toggleSwitch.checked) {
        revealBtn.style.display = "block";
        input.style.display = "none";
        input.classList.remove("num");
    } else {
        revealBtn.style.display = "none";
        input.style.display = "block";
        input.classList.add("num");
    }

    li.appendChild(revealBtn);
    li.appendChild(input);

    // reveal_btn 클릭 시 버튼 숨기고 input 보이기
    revealBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // 부모 클릭 이벤트 막기
        revealBtn.style.display = "none";
        input.style.display = "block";
        input.classList.add("num"); // ✨ num 클래스 추가
    });

    // input 이벤트
    input.addEventListener("keyup", validateInputs);
    input.addEventListener("change", validateInputs);
    input.addEventListener("input", () => {
        if (parseInt(input.value, 10) > 25) input.value = 25;
    });

    // 마킹 이벤트
    li.addEventListener("click", () => {
        if (!input.readOnly || !input.value) return;
        if (!li.classList.contains("marked")) {
            li.classList.add("marked");
            checkBingo();
        }
    });
});

// 토글 스위치 이벤트 (전체 reveal_btn / input display 전환)
toggleSwitch.addEventListener("change", () => {
    const isChecked = toggleSwitch.checked;

    document.querySelectorAll(".bingo_input").forEach((input) => {
        input.style.display = isChecked ? "none" : "block";
        input.classList.toggle("num", !isChecked); // ✨ num 클래스 토글
    });

    document.querySelectorAll(".reveal_btn").forEach((btn) => {
        btn.style.display = isChecked ? "block" : "none";
    });
});

function validateInputs() {
    const inputs = document.querySelectorAll(".bingo_input");
    let validCount = 0;
    for (let input of inputs) {
        const val = parseInt(input.value, 10);
        if (!isNaN(val) && val >= 1 && val <= 25) validCount++;
    }
    startBtn.disabled = validCount !== 16;
}

startBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".bingo_input");
    const values = [];

    for (let input of inputs) {
        const val = parseInt(input.value, 10);
        if (isNaN(val) || val < 1 || val > 25) {
            toastCheckMsg("1~25 사이 숫자를 입력해주세요.", 2, false);
            return;
        }
        values.push(val);
    }

    const unique = new Set(values);
    if (unique.size !== 16) {
        toastCheckMsg("중복된 숫자가 있어요.", 2, false);
        return;
    }

    inputs.forEach((input) => {
        input.readOnly = true;
        input.style.display = "none";
        input.classList.remove("num");
    });

    document.querySelectorAll(".reveal_btn").forEach((btn) => {
        btn.style.display = "block";
    });

    formulaInputs.forEach((mathField) => {
        mathField.removeAttribute("readonly");
    });

    toggleSwitch.checked = true;
    toggleSwitch.setAttribute("aria-checked", "true");

    drawBtn.disabled = false;
    startBtn.disabled = true;
    toastCheckMsg(`빙고판 설정 완료! <br />이제 게임을 시작할 수 있어요.`, 4, false);
});

drawBtn.addEventListener("click", () => {
    cardContainer.innerHTML = "";
    drawnNumbers = [];

    // ✅ 1~9로 범위 변경
    const candidates = Array.from({ length: 9 }, (_, i) => i + 1);
    shuffle(candidates);
    drawnNumbers = candidates.slice(0, 3);

    drawnNumbers.forEach((num) => {
        const li = document.createElement("li");
        li.className = "card_num";
        li.innerHTML = `<span lang="y">${num}</span>`;
        cardContainer.appendChild(li);
    });
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

checkBtn.addEventListener("click", (e) => {
    const formula = convertOperators(formulaInputs[0].getValue("plain-text")); // 공통으로 쓰는 사칙연산 문자로 변경
    const userAnswerInput = formulaInputs[1];
    const userAnswer = parseInt(userAnswerInput.getValue("plain-text"), 10);

    // 수식 미입력
    if (!formula) {
        e.stopImmediatePropagation();
        return toastCheckMsg("식을 먼저 작성해주세요.", 2, false);
    }

    // 정답 미입력
    if (!userAnswerInput.value) {
        e.stopImmediatePropagation();
        return toastCheckMsg("문제를 풀어보세요!", 2, false);
    }

    // 뽑은 숫자 유효성 검사
    const usedNumbers = formula.match(/\d+/g)?.map(Number) || [];
    const valid = usedNumbers.every((n) => drawnNumbers.includes(n));
    if (!valid) {
        e.stopImmediatePropagation();
        return toastCheckMsg("뽑은 카드 숫자만 사용해야 합니다.", 2, false);
    }

    // 수식 계산
    let result;
    try {
        result = eval(formula);
    } catch {
        e.stopImmediatePropagation();
        return toastCheckMsg("유효하지 않은 수식입니다.", 2, false);
    }

    // 정답 불일치
    if (result !== userAnswer) {
        e.stopImmediatePropagation();
        return toastCheckMsg("한 번 더 생각해 보세요.", 2, false);
    }

    // 빙고판 숫자와 일치하는 경우 마킹
    const inputs = document.querySelectorAll(".bingo_input");
    let matched = false;
    inputs.forEach((input) => {
        if (parseInt(input.value, 10) === result) {
            input.parentElement.classList.add("marked");
            matched = true;
        }
    });

    toastCheckMsg("정답이에요!", 4, false);

    e.stopImmediatePropagation();
    checkBingo();
});

function checkBingo() {
    const tiles = [...document.querySelectorAll(".btn_grid li")];
    const isMarked = (idx) => tiles[idx].classList.contains("marked");
    const bingoLines = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [0, 5, 10, 15],
        [3, 6, 9, 12],
    ];
    let bingoCount = 0;
    bingoLines.forEach((line) => {
        if (line.every(isMarked)) bingoCount++;
    });
    if (bingoCount > prevBingoCount) {
        prevBingoCount = bingoCount;
        if (bingoCount === 3) return toastCheckMsg("빙고가 완성되었습니다!", 4, false);
        toastCheckMsg(`현재 ${bingoCount}줄 완성됐어요!`, 4, false);
    }
}

calcResetBtn.addEventListener("click", () => {
    formulaInputs.forEach((input) => (input.value = ""));

    checkBtn.classList.remove("active");
    calcResetBtn.classList.remove("active");
});

formulaInputs[0].addEventListener("input", () => {
    const formula = formulaInputs[0].getValue("plain-text");
    formulaInputs[0].setAttribute("data-answer-single", formula);
});

formulaInputs[0].addEventListener("input", () => {
    const formula = formulaInputs[0].getValue("plain-text");
    formulaInputs[0].setAttribute("data-answer-single", formula);

    let result;
    try {
        result = eval(formula);
        if (!isNaN(result)) {
            formulaInputs[1].setAttribute("data-answer-single", result);
        } else {
            formulaInputs[1].removeAttribute("data-answer-single");
        }
    } catch {
        formulaInputs[1].removeAttribute("data-answer-single");
    }
});

// 토글 스위치 연동 기능
toggleSwitch.addEventListener("change", () => {
    const isChecked = toggleSwitch.checked;
    const revealBtns = document.querySelectorAll(".reveal_btn");

    revealBtns.forEach((btn) => {
        btn.style.display = isChecked ? "block" : "none";
    });
});

function checkResetActive() {
    const inputs = document.querySelectorAll(".bingo_input");
    const hasValue = Array.from(inputs).some((input) => input.value.trim() !== "");
    resetBtn.classList.toggle("active", hasValue);
}

document.querySelectorAll(".bingo_input").forEach((input) => {
    input.addEventListener("input", checkResetActive);
    input.addEventListener("change", checkResetActive);
});

function checkCalcBtnsActive() {
    const hasValue = Array.from(formulaInputs).some((input) => input.getValue("plain-text").trim() !== "");

    checkBtn.classList.toggle("active", hasValue);
    calcResetBtn.classList.toggle("active", hasValue);
    function keepButtonActiveForever(button) {
        const observer = new MutationObserver(() => {
            if (!button.classList.contains("active")) {
                button.classList.add("active");
            }
        });

        observer.observe(button, {
            attributes: true,
            attributeFilter: ["class"],
        });
    }

    keepButtonActiveForever(btnSubmit);
    keepButtonActiveForever(resetBtn);
}

formulaInputs.forEach((input) => {
    input.addEventListener("input", checkCalcBtnsActive);
});

calcResetBtn.addEventListener("click", () => {
    formulaInputs.forEach((input) => (input.value = ""));

    checkBtn.classList.remove("active");
    calcResetBtn.classList.remove("active");
});

resetBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".bingo_input");
    inputs.forEach((input) => {
        input.value = "";
        input.readOnly = false;
        input.style.display = "block";
        input.classList.add("num");
    });

    document.querySelectorAll(".btn_grid li").forEach((li) => {
        li.classList.remove("marked");
    });

    document.querySelectorAll(".reveal_btn").forEach((btn) => {
        btn.style.display = "none";
    });

    formulaInputs.forEach((input) => {
        input.value = "";
        input.setAttribute("readonly", "readonly");
    });

    toggleSwitch.checked = false;
    toggleSwitch.setAttribute("aria-checked", "false");

    drawnNumbers = [];
    prevBingoCount = 0;
    drawBtn.disabled = true;
    startBtn.disabled = true;
    cardContainer.innerHTML = "";

    resetBtn.classList.remove("active");
    submitBtn.classList.remove("active");
});
