const startNumInput = document.getElementById("startNum");
const endNumInput = document.getElementById("endNum");
const confirmBtn = document.getElementById("confirmBtn");
const getCardBtn = document.getElementById("getCardBtn");
const players = document.querySelectorAll(".player");
const startNumDisplay = document.getElementById("startNumber");
const resetAllBtn = document.querySelector(".btnReset");
const cardValues = [6, 4, -2, 8, 9, 8, 15, -2, -6, 4, 1, 7, -4, 5, 10, 7];
let remainingCards = [...cardValues];

let currentPlayerIndex = 0;
let prevAnswer = null;
let waitingForCard = false;

const btnSubmit = document.querySelector(".btnSubmit");

btnSubmit.addEventListener("click", () => {
    toastCheckMsg("선생님께 제출되었습니다.", 5, false);
});

function getNextPlayerIndex() {
    let i = currentPlayerIndex;
    const len = players.length;
    do {
        i = (i + 1) % len;
    } while (players[i].classList.contains("disabled"));
    return i;
}

function setTurn(playerIndex) {
    players.forEach((p, i) => {
        if (i === playerIndex) {
            p.classList.add("on-turn");
            p.classList.remove("off-turn");
        } else {
            p.classList.remove("on-turn");
            p.classList.add("off-turn");
        }
        const input = p.querySelector("input");
        input.value = "";
        input.readOnly = true;
    });
    startNumDisplay.textContent = prevAnswer !== null ? prevAnswer : startNumInput.value;
}

function goToNextTurn() {
    currentPlayerIndex = getNextPlayerIndex();
    setTurn(currentPlayerIndex);
}

function validateInputs() {
    const startVal = parseInt(startNumInput.value, 10);
    const endVal = parseInt(endNumInput.value, 10);
    confirmBtn.disabled = !(startVal >= 8 && startVal <= 10 && endVal >= 40 && endVal <= 50);

    if (startNumInput.value.trim() !== "" || endNumInput.value.trim() !== "") {
        resetAllBtn.classList.add("active");
    } else {
        resetAllBtn.classList.remove("active");
    }
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function updatePagination(wrap, pagination, currentIndex = 0) {
    const dots = pagination.querySelectorAll(".dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
}

function updateSlideUI(wrap, pagination, btnPrev, btnNext, currentIndex = 0) {
    wrap.style.transform = `translateX(-${100 * currentIndex}%)`;
    updatePagination(wrap, pagination, currentIndex);

    const total = wrap.querySelectorAll(".card").length;
    btnPrev.style.display = total <= 1 || currentIndex === 0 ? "none" : "flex";
    btnNext.style.display = total <= 1 || currentIndex === total - 1 ? "none" : "flex";
}

function assignInitialCards() {
    players.forEach((player) => {
        const wrap = player.querySelector(".card-wrap");
        const pagination = player.querySelector(".pagination");
        const btnPrev = player.querySelector(".card-nav.left");
        const btnNext = player.querySelector(".card-nav.right");
        const input = player.querySelector("input");
        const checkBtn = player.querySelector(".input-check");
        const resetBtn = player.querySelector(".input-reset");

        wrap.innerHTML = "";
        pagination.innerHTML = "";

        const picked = shuffle(remainingCards).slice(0, 3);
        picked.forEach((value, i) => {
            const li = document.createElement("li");
            li.className = "card";
            li.textContent = value;
            li.dataset.value = value;
            const originIndex = cardValues.indexOf(value);
            li.dataset.index = originIndex;
            wrap.appendChild(li);
            remainingCards.splice(remainingCards.indexOf(value), 1);

            const dot = document.createElement("div");
            dot.className = "dot";
            if (i === 0) dot.classList.add("active");
            pagination.appendChild(dot);
        });

        let currentIndex = 0;

        const updateSlide = () => updateSlideUI(wrap, pagination, btnPrev, btnNext, currentIndex);

        btnPrev.onclick = () => {
            if (currentIndex > 0) currentIndex--;
            updateSlide();
        };
        btnNext.onclick = () => {
            if (currentIndex < wrap.querySelectorAll(".card").length - 1) currentIndex++;
            updateSlide();
        };

        input.addEventListener("input", () => {
            const hasValue = input.value.trim().length > 0;
            checkBtn.disabled = !hasValue;
            resetBtn.disabled = !hasValue;
        });

        resetBtn.addEventListener("click", () => {
            input.value = "";
            checkBtn.disabled = true;
            resetBtn.disabled = true;
        });

        wrap.querySelectorAll(".card").forEach((card) => {
            card.addEventListener("click", () => {
                if (players[currentPlayerIndex] !== player) return;

                wrap.querySelectorAll(".card").forEach((c) => c.classList.remove("select"));
                card.classList.add("select");

                input.readOnly = false;
                btnPrev.style.display = "none";
                btnNext.style.display = "none";
            });
        });
        checkBtn.addEventListener("click", () => {
            if (players[currentPlayerIndex] !== player || waitingForCard) return;

            const selected = wrap.querySelector(".card.select");
            const userVal = parseInt(input.value, 10);
            const cardVal = parseInt(selected?.dataset.value);
            const startVal = parseInt(startNumInput.value);
            const endVal = parseInt(endNumInput.value);
            if (!selected || isNaN(userVal)) return;

            const base = prevAnswer === null ? startVal : prevAnswer;
            const answer = base + cardVal;

            prevAnswer = answer;
            startNumDisplay.textContent = answer;

            if (userVal !== answer) {
                selected.remove();
                pagination.removeChild(pagination.querySelector(".dot"));
                updateSlideUI(wrap, pagination, btnPrev, btnNext, 0);

                if (wrap.querySelectorAll(".card").length === 0) {
                    player.classList.add("disabled");
                }

                if (remainingCards.length === 0) {
                    toastCheckMsg("카드를 다 소진했습니다. 제출해주세요.", 4, false);
                    document.querySelector(".btnSubmit")?.classList.add("active");
                }

                const alive = Array.from(players).filter((p) => !p.classList.contains("disabled"));
                if (alive.length === 1) {
                    const winnerIndex = Array.from(players).indexOf(alive[0]) + 1;
                    toastCheckMsg(`${winnerIndex}번 플레이어가 승리하셨습니다!`, 4, false);
                    document.querySelector(".btnSubmit")?.classList.add("active");
                }

                goToNextTurn();
            } else {
                if (answer < endVal) {
                    toastCheckMsg("정답이에요! 카드를 가져오세요.", 4, false);
                    waitingForCard = true;
                    getCardBtn.disabled = false;
                } else {
                    toastCheckMsg("끝 수 이상입니다. 다음턴으로 넘어갑니다.", 2, false);
                    selected.remove();
                    pagination.removeChild(pagination.querySelector(".dot"));
                    updateSlideUI(wrap, pagination, btnPrev, btnNext, 0);

                    if (wrap.querySelectorAll(".card").length === 0) {
                        player.classList.add("disabled");
                    }

                    if (remainingCards.length === 0) {
                        toastCheckMsg("카드를 다 소진했습니다. 제출해주세요.", 4, false);
                        document.querySelector(".btnSubmit")?.classList.add("active");
                    }

                    const alive = Array.from(players).filter((p) => !p.classList.contains("disabled"));
                    if (alive.length === 1) {
                        const winnerIndex = Array.from(players).indexOf(alive[0]) + 1;
                        toastCheckMsg(`${winnerIndex}번 플레이어가 승리하셨습니다!`, 4, false);
                        document.querySelector(".btnSubmit")?.classList.add("active");
                    }

                    goToNextTurn();
                }
            }

            input.value = "";
            input.readOnly = true;
            checkBtn.disabled = true;
            resetBtn.disabled = true;
        });

        updateSlide();
    });
}

getCardBtn.addEventListener("click", () => {
    const player = players[currentPlayerIndex];
    const wrap = player.querySelector(".card-wrap");
    const pagination = player.querySelector(".pagination");
    const btnPrev = player.querySelector(".card-nav.left");
    const btnNext = player.querySelector(".card-nav.right");

    if (remainingCards.length === 0) return;

    shuffle(remainingCards);
    const newCardVal = remainingCards.shift();
    if (newCardVal === undefined) return;

    const li = document.createElement("li");
    li.className = "card";
    li.textContent = newCardVal;
    li.dataset.value = newCardVal;
    const originIndex = cardValues.indexOf(newCardVal);
    li.dataset.index = originIndex;

    wrap.querySelectorAll(".card").forEach((c) => c.classList.remove("select"));
    wrap.insertBefore(li, wrap.firstChild);

    li.addEventListener("click", () => {
        wrap.querySelectorAll(".card").forEach((c) => c.classList.remove("select"));
        li.classList.add("select");
        if (players[currentPlayerIndex] === player) {
            const input = player.querySelector("input");
            input.readOnly = false;
        }
        btnPrev.style.display = "none";
        btnNext.style.display = "none";
    });

    const dot = document.createElement("div");
    dot.className = "dot";
    pagination.insertBefore(dot, pagination.firstChild);

    updateSlideUI(wrap, pagination, btnPrev, btnNext, 0);

    getCardBtn.disabled = true;
    waitingForCard = false;

    if (remainingCards.length === 0) {
        toastCheckMsg("카드를 다 소진했습니다. 제출해주세요.", 4, false);
        document.querySelector(".btnSubmit")?.classList.add("active");
    }

    goToNextTurn();
});
startNumInput.addEventListener("input", validateInputs);
endNumInput.addEventListener("input", validateInputs);

confirmBtn.addEventListener("click", () => {
    startNumInput.readOnly = true;
    endNumInput.readOnly = true;
    confirmBtn.disabled = true;
    assignInitialCards();
    setTurn(currentPlayerIndex);
});

resetAllBtn.addEventListener("click", () => {
    startNumInput.value = "";
    endNumInput.value = "";
    startNumInput.readOnly = false;
    endNumInput.readOnly = false;
    startNumDisplay.textContent = "";
    confirmBtn.disabled = true;
    getCardBtn.disabled = true;
    resetAllBtn.classList.remove("active");
    document.querySelector(".btnSubmit")?.classList.remove("active");

    remainingCards = [...cardValues];
    currentPlayerIndex = 0;
    prevAnswer = null;
    waitingForCard = false;

    players.forEach((player) => {
        player.classList.remove("on-turn", "disabled");
        const input = player.querySelector("input");
        const wrap = player.querySelector(".card-wrap");
        const pagination = player.querySelector(".pagination");
        const resetBtn = player.querySelector(".input-reset");
        const checkBtn = player.querySelector(".input-check");

        input.value = "";
        input.readOnly = true;
        checkBtn.disabled = true;
        resetBtn.disabled = true;
        wrap.innerHTML = "";
        pagination.innerHTML = "";
    });
});
