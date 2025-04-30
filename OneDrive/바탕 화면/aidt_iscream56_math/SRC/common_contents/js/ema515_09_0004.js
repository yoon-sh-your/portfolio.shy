const board = document.getElementById("board");
const rollDiceBtn = document.getElementById("rollDiceBtn");
const diceResult = document.getElementById("diceResult");
const routeChoice = document.getElementById("routeChoice");
const shortcutBtn = document.getElementById("shortcutBtn");
const normalBtn = document.getElementById("normalBtn");
const checkBtn = document.querySelector(".btnCheck");
const submitBtn = document.querySelector(".btnSubmit");
const resetBtn = document.querySelector(".btnReset");

const numberedTiles = {
    "4,5": 1,
    "3,5": 2,
    "2,5": 3,
    "1,5": 4,
    "0,5": 5,
    "0,4": 6,
    "0,3": 7,
    "0,2": 8,
    "0,1": 9,
    "0,0": 10,
    "1,0": 11,
    "2,0": 12,
    "3,0": 13,
    "4,0": 14,
    "5,0": 15,
    "5,1": 16,
    "5,2": 17,
    "5,3": 18,
    "5,4": 19,
    "5,5": 20,
};

const fractionData = {
    1: ["7/15", "7/15"],
    2: ["1/12", "1/12"],
    3: ["1 1/8", "9/8"],
    4: ["4/5", "4/5"],
    5: ["3 2/9", "29/9"],
    6: ["3/7", "3/7"],
    7: ["4/9", "4/9"],
    8: ["5 1/5", "26/5"],
    9: ["1/5", "1/5"],
    10: ["1 5/7", "12/7"],
    11: ["5/12", "5/12"],
    12: ["2 2/15", "32/15"],
    13: ["2/9", "2/9"],
    14: ["5 3/8", "43/8"],
    15: ["2 11/12", "35/12"],
    16: ["3 2/5", "17/5"],
    17: ["5/18", "5/18"],
    18: ["1 7/8", "15/8"],
    19: ["1/7", "1/7"],
    20: [null, null],
    "5-1": ["5/8", "5/8"],
    "5-2": ["3 7/12", "43/12"],
    "5-3": ["4/15", "4/15"],
    "5-4": ["4 2/7", "30/7"],
    "5-5": ["11/18", "11/18"],
    "10-1": ["7/9", "7/9"],
    "10-2": ["4 3/5", "23/5"],
    "10-3": ["4/15", "4/15"],
    "10-4": ["2 5/9", "23/9"],
    "10-5": ["1/6", "1/6"],
};

const shortcutIndexes = ["5-1", "5-2", "5-3", "5-4", "5-5", "10-1", "10-2", "10-3", "10-4", "10-5"];

const shortcutPaths = {
    shortcut5: ["5-1", "5-2", "5-3", "5-4", "5-5", 15, 16, 17, 18, 19, 20],
    shortcut10: ["10-1", "10-2", "10-3", "10-4", "10-5", 20],
    normal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
};

for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
        const key = `${row},${col}`;
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (key in numberedTiles) {
            const index = numberedTiles[key];
            cell.dataset.index = index;
            cell.textContent = index;
            if (fractionData[index]) {
                cell.dataset.fraction = fractionData[index][0];
                cell.dataset.improper = fractionData[index][1];
            }
        } else {
            cell.classList.add("empty");
        }
        board.appendChild(cell);
    }
}

const shortcuts = [
    { class: "s-5-1", label: "5-1" },
    { class: "s-5-2", label: "5-2" },
    { class: "s-5-3", label: "5-3" },
    { class: "s-5-4", label: "5-4" },
    { class: "s-5-5", label: "5-5" },
    { class: "s-10-1", label: "10-1" },
    { class: "s-10-2", label: "10-2" },
    { class: "s-10-3", label: "10-3" },
    { class: "s-10-4", label: "10-4" },
    { class: "s-10-5", label: "10-5" },
];

shortcuts.forEach((s) => {
    const shortcut = document.createElement("div");
    shortcut.classList.add("shortcut", s.class);
    shortcut.textContent = s.label;
    shortcut.dataset.index = s.label;
    if (fractionData[s.label]) {
        shortcut.dataset.fraction = fractionData[s.label][0];
        shortcut.dataset.improper = fractionData[s.label][1];
    }
    board.appendChild(shortcut);
});

const stones = document.querySelectorAll(".stone");
let currentTurn = "black";
let diceValue = 0;
let waitingForRoute = null;
const pendingRoutes = {};

function moveStoneToTile(stone, tileIndex) {
    const target = document.querySelector(`[data-index="${tileIndex}"]`);
    if (!target) return;

    const sameSpotStones = [...document.querySelectorAll(`.stone[data-index='${tileIndex}']`)].filter((s) => s !== stone);

    sameSpotStones.forEach((other) => {
        if (!stone.classList.contains("selectable")) return;
        const isDifferentColor = other.classList.contains("black") !== stone.classList.contains("black");
        if (isDifferentColor) {
            other.dataset.index = "0";
            document.getElementById("bench").appendChild(other);
            other.style.position = "static";
            other.style.left = null;
            other.style.top = null;
            other.style.zIndex = null;
            other.dataset.done = "false";
            other.innerText = "";
            delete pendingRoutes[other.id];
        }
    });

    const stacked = [...document.querySelectorAll(`.stone[data-index='${stone.dataset.index}']`)].filter((s) => s !== stone && s.className === stone.className && stone.innerText === "2");
    const toMove = [stone, ...stacked];

    toMove.forEach((s) => {
        s.dataset.index = tileIndex;

        const tileRect = target.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        const offsetX = tileRect.left - boardRect.left;
        const offsetY = tileRect.top - boardRect.top;

        s.style.position = "absolute";
        s.style.left = `${offsetX}px`;
        s.style.top = `${offsetY}px`;
        s.style.zIndex = "99";
        board.appendChild(s);
    });

    const sameColorStack = [...document.querySelectorAll(`.stone[data-index='${tileIndex}']`)].filter((s) => s.className === stone.className);
    sameColorStack.forEach((s) => (s.innerText = sameColorStack.length > 1 ? `${sameColorStack.length}` : ""));
}

rollDiceBtn.addEventListener("click", () => {
    if (waitingForRoute) return toastCheckMsg("경로 선택 중입니다.", 2, false);

    diceValue = Math.floor(Math.random() * 6) + 1;
    diceResult.dataset.value = diceValue;

    resetBtn.classList.add("active");

    stones.forEach((s) => s.classList.remove("selectable"));
    stones.forEach((s) => {
        if (s.classList.contains(currentTurn) && s.dataset.done !== "true") {
            s.classList.add("selectable");
        }
    });
});

stones.forEach((stone) => {
    stone.addEventListener("click", () => {
        if (!stone.classList.contains("selectable") || diceValue === 0) return;
        const id = stone.id;

        const isSameTeam = (a, b) => a.classList.contains("black") === b.classList.contains("black");
        const currentIdx = stone.dataset.index;

        let group = [stone];
        if (stone.innerText === "2") {
            group = [stone, ...[...document.querySelectorAll(`.stone[data-index='${currentIdx}']`)].filter((s) => s !== stone && isSameTeam(s, stone))];
        }

        if (pendingRoutes[id]) {
            const routeKey = pendingRoutes[id];
            const path = shortcutPaths[routeKey];
            const indexKey = shortcutIndexes.includes(currentIdx) ? currentIdx : parseInt(currentIdx, 10);
            const idx = path.indexOf(indexKey);
            const next = path[idx + diceValue];

            if (!next) {
                group.forEach((s) => {
                    s.dataset.done = "true";
                    s.remove();
                });
            } else {
                group.forEach((s) => {
                    s.dataset.index = next;
                    moveStoneToTile(s, next);
                });
                if (!routeKey.startsWith("shortcut")) delete pendingRoutes[id];
            }

            endTurn();
            return;
        }

        let nextIndex = parseInt(currentIdx, 10) + diceValue;

        if (nextIndex >= 21) {
            group.forEach((s) => {
                s.dataset.done = "true";
                s.remove();
            });
            endTurn();
            return;
        }

        if (nextIndex === 5) {
            group.forEach((s) => {
                s.dataset.index = 5;
                moveStoneToTile(s, 5);
            });
            waitingForRoute = { stone: group[0], routeKey: "shortcut5" };

            routeChoice.classList.remove("position-10");
            routeChoice.classList.add("position-5");
            routeChoice.style.display = "flex";
            return;
        }

        if (nextIndex === 10) {
            group.forEach((s) => {
                s.dataset.index = 10;
                moveStoneToTile(s, 10);
            });
            waitingForRoute = { stone: group[0], routeKey: "shortcut10" };

            routeChoice.classList.remove("position-5");
            routeChoice.classList.add("position-10");
            routeChoice.style.display = "flex";
            return;
        }

        group.forEach((s) => {
            s.dataset.index = nextIndex;
            moveStoneToTile(s, nextIndex);
        });
        endTurn();
    });
});

function endTurn() {
    stones.forEach((s) => s.classList.remove("selectable"));
    currentTurn = currentTurn === "black" ? "white" : "black";
    // diceResult.textContent += ` → ${currentTurn.toUpperCase()} 턴`;
    diceValue = 0;
}

shortcutBtn.addEventListener("click", () => {
    if (!waitingForRoute) return;
    pendingRoutes[waitingForRoute.stone.id] = waitingForRoute.routeKey;
    waitingForRoute = null;
    routeChoice.style.display = "none";
    endTurn();
});

normalBtn.addEventListener("click", () => {
    if (!waitingForRoute) return;
    pendingRoutes[waitingForRoute.stone.id] = "normal";
    waitingForRoute = null;
    routeChoice.style.display = "none";
    endTurn();
});

const ce = new ComputeEngine.ComputeEngine();
window.onload = () => {
    const mathField = document.querySelector("#diceNumber math-field");
    if (mathField) {
        mathField.mode = "latex";
    }
    stones.forEach((stone) => {
        if (stone.dataset.index !== "0") {
            moveStoneToTile(stone, stone.dataset.index);
        }
    });
};
const diceNumber = document.getElementById("diceNumber");
function updateFractionDisplay(tileIndex) {
    const target = document.querySelector(`[data-index="${tileIndex}"]`);
    if (!target) return;

    const improper = target.dataset.improper;
    const latex = convertToLatexFraction(improper);
    const diceField = diceNumber.querySelector("math-field");
    if (diceField) {
        diceField.setValue(latex || "");
    }
}

const originalMoveStoneToTile = moveStoneToTile;
moveStoneToTile = function (stone, tileIndex) {
    const target = document.querySelector(`[data-index="${tileIndex}"]`);
    if (!target) return;

    const isSameTeam = (a, b) => a.classList.contains("black") === b.classList.contains("black");

    const prevIndex = stone.dataset.index;
    const group = [stone, ...[...document.querySelectorAll(`.stone[data-index='${prevIndex}']`)].filter((s) => s !== stone && isSameTeam(s, stone))];

    const stonesOnTile = [...document.querySelectorAll(`.stone[data-index='${tileIndex}']`)];
    stonesOnTile.forEach((s) => {
        if (!group.includes(s) && !isSameTeam(s, stone)) {
            s.dataset.index = "0";
            s.dataset.done = "false";
            delete pendingRoutes[s.id];
            s.innerText = "";
            s.style.position = "static";
            s.style.left = null;
            s.style.top = null;
            s.style.zIndex = null;
            document.getElementById("bench").appendChild(s);
        }
    });

    group.forEach((s) => {
        s.dataset.index = tileIndex;

        const tileRect = target.getBoundingClientRect();
        const offsetX = tileRect.left;
        const offsetY = tileRect.top;

        s.style.position = "fixed";
        s.style.left = `${offsetX}px`;
        s.style.top = `${offsetY}px`;
        s.style.zIndex = "99";
        document.body.appendChild(s);
    });

    const sameColorStack = [...document.querySelectorAll(`.stone[data-index='${tileIndex}']`)].filter((s) => isSameTeam(s, stone));
    sameColorStack.forEach((s) => (s.innerText = sameColorStack.length > 1 ? `${sameColorStack.length}` : ""));

    updateFractionDisplay(tileIndex);
};

const rollOperatorBtn = document.getElementById("rollOperatorBtn");
const operator = document.getElementById("operator");
const operatorNumber = document.getElementById("operatorNumber");
const operatorDiceNumber = document.getElementById("operatorDiceNumber");

const operatorDiceMap = {
    1: { op: null, fraction: null },
    2: { op: "-", fraction: "2 3/10" },
    3: { op: "-", fraction: "1/3" },
    4: { op: "+", fraction: "3/4" },
    5: { op: "+", fraction: "4 5/6" },
    6: { op: "+", fraction: "2 1/2" },
};

function rollOperatorDice() {
    const value = Math.floor(Math.random() * 6) + 1;
    const data = operatorDiceMap[value];

    operator.textContent = data.op ?? "";

    const operatorField = operatorNumber.querySelector("math-field");
    if (operatorField) {
        operatorField.setValue(convertToLatexFraction(data.fraction ?? ""));
    }

    operatorDiceNumber.dataset.value = value;
    resetBtn.classList.add("active");
}

rollOperatorBtn.addEventListener("click", rollOperatorDice);

function convertToLatexFraction(value) {
    if (!value) return "";

    const mixedMatch = value.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
        const [, whole, num, denom] = mixedMatch;
        return `${whole}\\frac{${num}}{${denom}}`;
    }

    const improperMatch = value.match(/^(\d+)\/(\d+)$/);
    if (improperMatch) {
        const [_, numStr, denomStr] = improperMatch;
        const numerator = parseInt(numStr, 10);
        const denominator = parseInt(denomStr, 10);
        if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return value;

        const whole = Math.floor(numerator / denominator);
        const remainder = numerator % denominator;

        if (whole === 0) return `\\frac{${numerator}}{${denominator}}`;
        if (remainder === 0) return `${whole}`;
        return `${whole}\\frac{${remainder}}{${denominator}}`;
    }

    return value; // 숫자만 있을 경우
}

resetBtn.addEventListener("click", () => {
    // 말 전부 벤치로 초기화
    stones.forEach((s) => {
        s.dataset.index = "0";
        s.dataset.done = "false";
        s.innerText = "";
        s.style.position = "static";
        s.style.left = null;
        s.style.top = null;
        s.style.zIndex = null;
        document.getElementById("bench").appendChild(s);
    });

    // 지름길 선택 UI 닫기
    routeChoice.style.display = "none";
    routeChoice.classList.remove("position-5", "position-10");

    // 주사위 값 초기화
    diceResult.dataset.value = "";
    operatorDiceNumber.dataset.value = "";

    operator.textContent = "";

    const operatorField = operatorNumber.querySelector("math-field");
    if (operatorField) operatorField.value = "";

    const diceField = diceNumber.querySelector("math-field");
    if (diceField) diceField.value = "";

    // 선택 가능 표시 제거
    stones.forEach((s) => s.classList.remove("selectable"));

    // 내부 상태 리셋
    diceValue = 0;
    waitingForRoute = null;
    currentTurn = "black";
    Object.keys(pendingRoutes).forEach((k) => delete pendingRoutes[k]);

    // 클래스 제거
    resetBtn.classList.remove("active");
});

// 정답 math-field 요소
const answerField = document.querySelector("#answer math-field");

// 답안 입력 시 버튼 활성화
answerField?.addEventListener("input", () => {
    const val = answerField.getValue().trim();
    if (val) {
        submitBtn.classList.add("active");
    } else {
        submitBtn.classList.remove("active");
    }
});

// LaTeX 수식 → 소수로 변환
function latexToDecimal(latex) {
    // 혼합분수: 2\frac{1}{4}
    const mixedMatch = latex.match(/^(\d+)\\frac{(\d+)}{(\d+)}$/);
    if (mixedMatch) {
        const [, whole, num, denom] = mixedMatch.map(Number);
        return whole + num / denom;
    }

    // 일반분수: \frac{3}{4}
    const fracMatch = latex.match(/^\\frac{(\d+)}{(\d+)}$/);
    if (fracMatch) {
        const [, num, denom] = fracMatch.map(Number);
        return num / denom;
    }

    // 정수 혹은 기타 입력
    const asNumber = Number(latex);
    return isNaN(asNumber) ? null : asNumber;
}

// 정답 체크
checkBtn.addEventListener("click", () => {
    if (!checkBtn.classList.contains("active")) return;

    const diceField = document.querySelector("#diceNumber math-field");
    const operatorField = document.querySelector("#operatorNumber math-field");
    const operatorSymbol = operator.textContent.trim();
    const answer = answerField.getValue().trim();

    const leftVal = eval(ce.parse(diceField?.getValue?.()).evaluate().toString());
    const rightVal = eval(ce.parse(operatorField?.getValue?.()).evaluate().toString());
    const userVal = eval(ce.parse(answer).evaluate().toString());

    // const leftVal = latexToDecimal(diceField?.getValue?.() ?? "");
    // const rightVal = latexToDecimal(operatorField?.getValue?.() ?? "");
    // const userVal = latexToDecimal(answer);

    if (leftVal == null || rightVal == null || userVal == null || !operatorSymbol) {
        toastCheckMsg("계산 또는 입력값 오류입니다.", 2, false);
        return;
    }

    let expected;
    if (operatorSymbol === "+") expected = leftVal + rightVal;
    else if (operatorSymbol === "-") expected = leftVal - rightVal;
    else return toastCheckMsg("연산자가 없습니다.", 2, false);

    const isCorrect = Math.abs(userVal - expected) < 0.001;

    if (isCorrect) {
        toastCheckMsg("정답이에요!", 4, false);
        diceField?.setValue?.("");
        operatorField?.setValue?.("");
        answerField?.setValue?.("");
        operator.textContent = "";
        submitBtn.classList.remove("active");
    } else {
        toastCheckMsg("한 번 더 생각해 보세요.", 2, false);
    }
});
