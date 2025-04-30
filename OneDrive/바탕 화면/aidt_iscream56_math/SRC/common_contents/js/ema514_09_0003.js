const fullDeck = [
    "1/2",
    "1/3",
    "2/3",
    "1/4",
    "2/4",
    "3/4",
    "1/5",
    "2/5",
    "3/5",
    "4/5",
    "1/6",
    "2/6",
    "3/6",
    "4/6",
    "5/6",
    "1/7",
    "2/7",
    "3/7",
    "4/7",
    "5/7",
    "6/7",
    "1/8",
    "2/8",
    "3/8",
    "4/8",
    "5/8",
    "6/8",
    "7/8",
    "1/9",
    "2/9",
    "3/9",
    "4/9",
    "5/9",
    "6/9",
    "7/9",
    "8/9",
    "0.1",
    "0.2",
    "0.3",
    "0.4",
    "0.5",
    "0.6",
    "0.7",
    "0.8",
    "0.9",
    ...Array.from({ length: 99 }, (_, i) => (0.01 * (i + 1)).toFixed(2)),
];

let drawnCards = [];
let currentIndex = 0;

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

const drawCardsBtn = document.getElementById("drawCards");
const submitBtn = document.querySelector(".btnSubmit");
const resetBtn = document.querySelector(".btnReset");
const cardEls = document.querySelectorAll(".card");
const foldBtns = document.querySelectorAll(".fold-btn");
const handEls = document.querySelectorAll(".hand");

if (isTeacher || document.getElementById("app_wrap").classList.contains("teacher")) {
    drawCardsBtn.setAttribute("disabled", "true");

    const mathFields = document.querySelectorAll("math-field");
    for (let i = 0; i < mathFields.length; i++) {
        if (mathFields[i].getValue("plain-text").length > 0) {
            drawCardsBtn.setAttribute("disabled", "false");
            break;
        }
    }
}

function updateSubmitButton() {
    const allHandsFolded = [...handEls].every((hand) => parseInt(hand.dataset.count, 10) === 0);

    if (currentIndex === 6 || allHandsFolded) {
        submitBtn.classList.add("active");
    } else {
        submitBtn.classList.remove("active");
    }
}

function updateResetButton() {
    const anyHandFolded = [...handEls].some((hand) => parseInt(hand.dataset.count, 10) < 5);
    const anyCardDrawn = currentIndex > 0;

    if (anyCardDrawn || anyHandFolded) {
        resetBtn.classList.add("active");
    } else {
        resetBtn.classList.remove("active");
    }
}

// 카드 뽑기
drawCardsBtn.addEventListener("click", () => {
    if (currentIndex >= 6) return;

    if (currentIndex === 0) {
        drawnCards = shuffle([...fullDeck]).slice(0, 24);
    }

    for (let i = 0; i < 4; i++) {
        const card = drawnCards[currentIndex * 4 + i];
        if (cardEls[i]) {
            if (card.includes("/")) {
                cardEls[i].innerHTML = `<math-field read-only></math-field>`;
                const mf = cardEls[i].querySelector("math-field");
                mf.setValue(`\\frac{${card.split("/")[0]}}{${card.split("/")[1]}}`);
            } else {
                cardEls[i].textContent = card;
            }
        }
    }

    currentIndex++;

    // ✅ 카드 6번 뽑았으면 비활성화
    if (currentIndex >= 6) {
        drawCardsBtn.disabled = true;
    }

    updateSubmitButton();
    updateResetButton();
});

// 손가락 접기
foldBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const player = btn.closest(".player");
        const hand = player.querySelector(".hand");

        let count = parseInt(hand.dataset.count, 10);
        if (count > 0) {
            count--;
            hand.dataset.count = count;
        }

        updateSubmitButton();
        updateResetButton();
    });
});

// 리셋 버튼
resetBtn.addEventListener("click", () => {
    currentIndex = 0;
    drawnCards = [];
    cardEls.forEach((el) => (el.textContent = ""));

    handEls.forEach((hand) => {
        hand.dataset.count = 5;
    });

    submitBtn.classList.remove("active");
    resetBtn.classList.remove("active");

    drawCardsBtn.disabled = false;
});
