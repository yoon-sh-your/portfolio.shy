const cardData = [
    { name: "끈", formula1: (a, b) => a === b + 1, formula2: (a, b) => b === a - 1 },
    { name: "의자", formula1: (a, b) => a === b + 1, formula2: (a, b) => b === a - 1 },
    { name: "토끼풀", formula1: (a, b) => a === b * 3, formula2: (a, b) => b === a / 3 },
    { name: "밀가루", formula1: (a, b) => a === b * 10, formula2: (a, b) => b === a / 10 },
    { name: "꼭짓점", formula1: (a, b) => a === b * 3, formula2: (a, b) => b === a / 3 },
    { name: "자동차", formula1: (a, b) => a === b * 4, formula2: (a, b) => b === a / 4 },
    { name: "기차", formula1: (a, b) => a === b * 240, formula2: (a, b) => b === a / 240 },
    { name: "물통", formula1: (a, b) => a === b * 12, formula2: (a, b) => b === a / 12 },
    { name: "도형", formula1: (a, b) => a === b * 4, formula2: (a, b) => b === a / 4 },
    { name: "털실", formula1: (a, b) => a === b * 60, formula2: (a, b) => b === a / 60 },
    { name: "꽃", formula1: (a, b) => a === b * 6, formula2: (a, b) => b === a / 6 },
    { name: "놀이기구", formula1: (a, b) => a === b * 6, formula2: (a, b) => b === a / 6 },
];

const drawBtn = document.getElementById("drawCard");
const chooseOp1 = document.getElementById("chooseOp1");
const chooseOp2 = document.getElementById("chooseOp2");
const input1 = document.getElementById("rightInput1");
const input2 = document.getElementById("rightInput2");
const checkBtn = document.getElementById("checkBtn");
const resultText = document.getElementById("result");
const rollDiceBtn = document.getElementById("rollDice");
const diceResult = document.getElementById("diceResult");
const resetBtn = document.getElementById("resetBtn");
const submitBtn = document.getElementById("btnCheck");
const scoreInputs = document.querySelectorAll(".score-table input");
const opSelector = document.getElementById("opSelector");

let remainingCards = [...cardData];
let currentCard = null;
let currentTargetInput = null;
let currentSymbolButton = null;

// 카드 뽑기
drawBtn.addEventListener("click", () => {
    if (remainingCards.length === 0) return alert("모든 카드를 뽑았습니다!");
    const randIdx = Math.floor(Math.random() * remainingCards.length);
    currentCard = remainingCards.splice(randIdx, 1)[0];

    drawBtn.dataset.card = currentCard.name;
});

// 사칙 연산 선택
document.querySelectorAll(".symbol-button").forEach((btn) => {
    btn.addEventListener("click", () => {
        currentTargetInput = btn.id === "chooseOp1" ? input1 : input2;
        currentSymbolButton = btn;

        const rect = btn.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        const absoluteTop = rect.top + scrollTop;
        const absoluteLeft = rect.left + scrollLeft;

        opSelector.style.display = "flex"; // 반드시 먼저 보여야 크기 계산 가능
        const opRect = opSelector.getBoundingClientRect();

        const centerX = absoluteLeft + rect.width / 2;
        const posX = centerX - opRect.width / 2;
        const posY = absoluteTop + rect.height + 4;

        opSelector.style.left = `${posX}px`;
        opSelector.style.top = `${posY}px`;
    });
});

// 연산 버튼 클릭 시 값 세팅
document.querySelectorAll("#opSelector button").forEach((btn) => {
    btn.addEventListener("click", () => {
        const op = btn.dataset.op;
        currentSymbolButton.dataset.op = op;
        const isFirst = currentTargetInput === input1;
        currentTargetInput.setValue((isFirst ? "□" : "△") + op);
        opSelector.style.display = "none";
    });
});

// 정답 체크
checkBtn.addEventListener("click", () => {
    const selectedName = drawBtn.dataset.card;
    if (!selectedName) return;

    const card = cardData.find((c) => c.name === selectedName);

    const value1 = input1.getValue("plain-text");
    const value2 = input2.getValue("plain-text");

    console.log("plain-text value1:", value1);
    console.log("plain-text value2:", value2);

    const parsed1 = value1.match(/(□|△)\s*([+-×*X÷\\/])\s*(\d+)/);
    const parsed2 = value2.match(/(□|△)\s*([+-×*X÷\\/])\s*(\d+)/);

    if (!parsed1 || !parsed2) {
        toastCheckMsg("식을 바르게 입력해주세요.", 2, false);
        return;
    }

    const op1 = parsed1[2];
    const num1 = parseFloat(parsed1[3]);
    const op2 = parsed2[2];
    const num2 = parseFloat(parsed2[3]);

    let a = 0,
        b = 0;
    switch (op1) {
        case "+":
            b = 5;
            a = b + num1;
            break;
        case "-":
            b = 5;
            a = b - num1;
            break;
        case "*":
            b = 5;
            a = b * num1;
            break;
        case "/":
            b = 5;
            a = b / num1;
            break;
    }

    let a2 = 5,
        b2 = 0;
    switch (op2) {
        case "+":
            b2 = a2 + num2;
            break;
        case "-":
            b2 = a2 - num2;
            break;
        case "*":
            b2 = a2 * num2;
            break;
        case "/":
            b2 = a2 / num2;
            break;
    }

    const correct = card.formula1(a, b) && card.formula2(a2, b2);
    console.log(correct);
    correct ? toastCheckMsg("정답이에요!", 4, false) : toastCheckMsg("한 번 더 생각해 보세요.", 2, false);
});

// 주사위 굴리기
rollDiceBtn.addEventListener("click", () => {
    const num = Math.floor(Math.random() * 6) + 1;
    const pointMsg = num % 2 === 0 ? "+2점" : "+1점";

    diceResult.dataset.number = num;
    diceResult.innerHTML = `<span>${pointMsg}</span>`;
});

// 리셋 버튼
resetBtn.addEventListener("click", () => {
    currentCard = null;
    remainingCards = [...cardData];

    input1.setValue("");
    input2.setValue("");
    chooseOp1.textContent = "";
    chooseOp2.textContent = "";
    resultText.textContent = "";
    diceResult.textContent = "";

    scoreInputs.forEach((input) => {
        input.value = "";
    });

    document.querySelectorAll("math-field").forEach((field) => {
        const isInsideName = field.closest(".input_wrap.name");
        if (!isInsideName) {
            field.setAttribute("readonly", "true");
        }
    });

    document.querySelectorAll("button").forEach((btn) => {
        if (btn !== resetBtn) {
            btn.disabled = true;
        }
    });
});

// 제출 버튼
submitBtn.addEventListener("click", () => {
    toastCheckMsg("제출하시겠습니까?", 5, true);

    e.stopImmediatePropagation();
});

document.querySelectorAll(".input_wrap.name math-field").forEach((field) => {
    field.addEventListener("input", () => {
        const allInputs = document.querySelectorAll(".input_wrap.name math-field");
        const hasValue = Array.from(allInputs).some((input) => input.getValue("plain-text").trim() !== "");

        if (hasValue) {
            // 모든 math-field readonly 제거
            document.querySelectorAll("math-field").forEach((f) => f.removeAttribute("readonly"));

            // 모든 버튼 disabled 해제
            document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
        }
    });
});
