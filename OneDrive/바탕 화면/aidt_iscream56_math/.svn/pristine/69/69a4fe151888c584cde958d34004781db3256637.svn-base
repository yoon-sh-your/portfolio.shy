const problems = {
    1: "3 ÷ 11",
    2: "1/6 ÷ 5",
    3: "1 1/9 ÷ 6",
    4: "7 ÷ 3",
    5: "6 3/5 ÷ 11",
    6: "9/11 ÷ 5",
    7: "4 ÷ 6",
    8: "1 1/3 ÷ 5",
    9: "18 ÷ 5",
    10: "2/9 ÷ 4",
    11: "8/13 ÷ 16",
    12: "1/4 ÷ 3",
    13: "8 1/5 ÷ 4",
    14: "6/13 ÷ 3",
    15: "8 ÷ 7",
    16: "6/7 ÷ 2",
};

const correctAnswers = {
    1: ["3/11"],
    2: ["1/30"],
    3: ["10/54", "5/27"],
    4: ["7/3"],
    5: ["33/55", "6 3/5 ÷ 11"],
    6: ["9/55"],
    7: ["2/3", "4/6", "6/9"],
    8: ["4/15"],
    9: ["18/5"],
    10: ["2/36", "1/18"],
    11: ["8/208", "1/26"],
    12: ["1/12", "2/24"],
    13: ["41/20"],
    14: ["6/39", "2/13"],
    15: ["8/7"],
    16: ["6/14", "3/7"],
};

const randomState = Math.floor(Math.random() * 16) + 1;
const currentProblem = problems[randomState];
const [leftVal, rightVal] = currentProblem.split("÷").map((str) => str.trim());

const cardEl = document.getElementById("card");
const cardInput1 = document.querySelector("#cardInput1 math-field");
const cardInput2 = document.querySelector("#cardInput2 math-field");
const answerInput = document.querySelector("#answer math-field");
const toggleCardBtn = document.getElementById("toggleCardBtn");
const mathCheckBtn = document.getElementById("mathCheckBtn");
const mathResetBtn = document.getElementById("mathResetBtn");
const minuteInput = document.getElementById("minute");
const secondInput = document.getElementById("second");
const startBtn = document.getElementById("startBtn");
const totalResetBtn = document.getElementById("totalReset");
const scoreInputs = document.querySelectorAll(".score-input");
const totalScoreEl = document.getElementById("totalScore");

cardEl.textContent = currentProblem;

toggleCardBtn.addEventListener("click", (event) => {
    const mathFields = document.querySelectorAll(".math-input-wrap math-field");
    mathFields.forEach((field) => {
        field.removeAttribute("disabled");
    });
    const isHidden = cardEl.classList.contains("hidden");
    cardEl.classList.toggle("hidden", !isHidden);
    cardEl.classList.toggle("visible", isHidden);
    event.target.textContent = isHidden ? "가리기" : "보기";
});

function latexToText(latex) {
    if (!latex) return "";
    return latex
        .replace(/\\text\s*{([^}]*)}/g, "$1")
        .replace(/\\text([a-zA-Z0-9]+)/g, "$1")
        .replace(/\\frac\s*{([^}]*)}\s*{([^}]*)}/g, "($1)/($2)")
        .replace(/\\times|⋅|·/g, "*")
        .replace(/\\div/g, "÷")
        .replace(/[{}]/g, "")
        .replace(/\\ /g, "")
        .trim();
}

function parseFraction(str) {
    str = String(str).replace(/\s+/g, "").replace(/[()]/g, "").replace(/×|⋅|·/g, "*");
    if (!str) return NaN;
    if (str.includes("÷")) {
        const [a, b] = str.split("÷");
        return parseFraction(a) / parseFraction(b);
    }
    if (str.includes("*")) {
        return str.split("*").reduce((acc, val) => acc * parseFraction(val), 1);
    }
    if (/^\d+[\s*]\d+\/\d+$/.test(str)) {
        const match = str.match(/^(\d+)[\s*](\d+)\/(\d+)$/);
        if (match) {
            return parseInt(match[1]) + parseInt(match[2]) / parseInt(match[3]);
        }
    }
    if (/^\d+\/\d+$/.test(str)) {
        const [n, d] = str.split("/");
        return parseFloat(n) / parseFloat(d);
    }
    return parseFloat(str);
}

mathCheckBtn.addEventListener("click", () => {
    const userLeft = latexToText(cardInput1.getValue("latex-expanded"));
    const userRight = latexToText(cardInput2.getValue("latex-expanded"));
    const userAnswer = latexToText(answerInput.getValue("latex-expanded"));

    const parsedUserLeft = parseFraction(userLeft);
    const parsedUserRight = parseFraction(userRight);
    const parsedLeftVal = parseFraction(leftVal);
    const parsedRightVal = parseFraction(rightVal);

    const isLeftCorrect = Math.abs(parsedUserLeft - parsedLeftVal) < 0.0001;
    const isRightCorrect = Math.abs(parsedUserRight - parsedRightVal) < 0.0001;

    const answerCandidates = correctAnswers[randomState];
    const parsedAnswer = parseFraction(userAnswer);
    const isAnswerCorrect = answerCandidates.some((ans) => Math.abs(parseFraction(ans) - parsedAnswer) < 0.0001);

    if (isLeftCorrect && isRightCorrect && isAnswerCorrect) {
        toastCheckMsg("정답이에요!", 4, false);
    } else {
        toastCheckMsg("한 번 더 생각해 보세요.", 2, false);
    }
});

mathResetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    cardInput1.setValue("");
    cardInput2.setValue("");
    answerInput.setValue("");
});

startBtn.addEventListener("click", (e) => {
    if (startBtn.textContent === "확인") {
        const min = parseInt(minuteInput.value) || 0;
        const sec = parseInt(secondInput.value) || 0;
        let remainingTime = min * 60 + sec;

        if (remainingTime <= 0) return;

        startBtn.textContent = "리셋";
        startBtn.classList.remove("btnCheck");
        startBtn.classList.add("btnReset");

        minuteInput.disabled = true;
        secondInput.disabled = true;

        toggleCardBtn.disabled = false;

        timerInterval = setInterval(() => {
            remainingTime--;
            const m = String(Math.floor(remainingTime / 60)).padStart(2, "0");
            const s = String(remainingTime % 60).padStart(2, "0");
            minuteInput.value = parseInt(m);
            secondInput.value = parseInt(s);

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                startBtn.textContent = "확인";
                startBtn.classList.remove("btnReset");
                startBtn.classList.add("btnCheck");
                minuteInput.disabled = false;
                secondInput.disabled = false;
                minuteInput.value = 0;
                secondInput.value = 0;
            }
        }, 1000);
    } else {
        e.preventDefault();
        e.stopImmediatePropagation();

        clearInterval(timerInterval);
        startBtn.textContent = "확인";
        startBtn.classList.remove("btnReset");
        startBtn.classList.add("btnCheck");
        minuteInput.disabled = false;
        secondInput.disabled = false;
        minuteInput.value = 0;
        secondInput.value = 0;
    }
});

function updateTotalScore() {
    let total = 0;
    scoreInputs.forEach((input) => {
        const val = parseFloat(input.value);
        if (!isNaN(val)) total += val;
    });
    totalScoreEl.textContent = total;
}

scoreInputs.forEach((input) => {
    input.addEventListener("input", updateTotalScore);
});

totalResetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    location.reload();
});

function checkTimerInput() {
    const min = parseInt(minuteInput.value) || 0;
    const sec = parseInt(secondInput.value) || 0;

    const isReady = min > 0 || sec > 0;
    console.log(isReady);
    if (startBtn.classList.contains("btnCheck")) {
        startBtn.disabled = !isReady;
    }
}

minuteInput.addEventListener("input", checkTimerInput);
secondInput.addEventListener("input", checkTimerInput);
