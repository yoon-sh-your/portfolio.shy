const players = 3;
let currentPlayer = 1;
let flippedCards = [];
const tabs = document.querySelectorAll(".tab");
const storageItems = document.querySelectorAll(".storage li");
const cardGrid = document.getElementById("cardGrid");
const submitBtn = document.querySelector(".btnSubmit");
const resetBtn = document.querySelector(".btnReset");

function isFraction(value) {
    return /^\d+\/\d+$/.test(value);
}

function toLatex(value) {
    if (isFraction(value)) {
        const [n, d] = value.split("/");
        return `\\frac{${n}}{${d}}`;
    }
    return value;
}

function updateTabCounter(playerId, count) {
    const tab = document.querySelector(`.tab[data-player="${playerId}"]`);
    tab.querySelector(".badge")?.remove();
    if (count > 0) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = `${count}개`;
        tab.appendChild(badge);
    }
}

function changeTurn() {
    currentPlayer++;
    if (currentPlayer > players) currentPlayer = 1;

    tabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.player == currentPlayer);
    });

    storageItems.forEach((item) => {
        item.classList.toggle("active", item.dataset.player == currentPlayer);
    });
}

function clearStorage() {
    storageItems.forEach((item) => {
        item.innerHTML = "";
    });
    tabs.forEach((tab) => tab.querySelector(".badge")?.remove());
}

function setupTabs() {
    tabs.forEach((tab, index) => {
        const playerId = tab.dataset.player;

        if (index < players) {
            tab.classList.remove("disabled");
        } else {
            tab.classList.add("disabled");
        }

        tab.addEventListener("click", () => {
            if (tab.classList.contains("disabled")) return;

            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            storageItems.forEach((item) => {
                item.classList.toggle("active", item.dataset.player === playerId);
            });
        });
    });
}

const cardGroups = [
    ["3:10", "3/10", "0.3", "30 %"],
    ["2:5", "2/5", "0.4", "40 %"],
    ["3:4", "3/4", "0.75", "75 %"],
    ["1:4", "1/4", "0.25", "25 %"],
    ["3:5", "3/5", "0.6", "60 %"],
    ["8:25", "8/25", "0.32", "32 %"],
];

function shuffle(array) {
    return array
        .map((item) => ({ ...item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((item) => ({ pairId: item.pairId, value: item.value }));
}

function renderCards() {
    cardGrid.innerHTML = "";

    const allCards = cardGroups.flatMap((group, index) =>
        group.map((value) => ({
            pairId: index + 1,
            value,
        }))
    );

    const shuffledCards = shuffle(allCards);

    shuffledCards.forEach((card) => {
        const div = document.createElement("div");
        div.className = "card";
        div.dataset.pairId = card.pairId;
        div.dataset.value = card.value;
        div.dataset.revealed = "false";
        cardGrid.appendChild(div);
    });

    attachCardEvents();
}

function attachCardEvents() {
    const allCardEls = document.querySelectorAll(".card");

    allCardEls.forEach((cardEl) => {
        cardEl.addEventListener("click", () => {
            const revealed = cardEl.dataset.revealed === "true";
            if (revealed || flippedCards.includes(cardEl)) return;

            cardEl.classList.add("revealed");
            cardEl.innerHTML = "";

            const value = cardEl.dataset.value;

            if (isFraction(value)) {
                const [numerator, denominator] = value.split("/");
                const fractionBox = document.createElement("div");
                fractionBox.className = "fraction_box";
                const top = document.createElement("span");
                top.className = "numerator";
                top.textContent = numerator;
                const bottom = document.createElement("span");
                bottom.className = "denominator";
                bottom.textContent = denominator;
                fractionBox.appendChild(top);
                fractionBox.appendChild(bottom);
                cardEl.appendChild(fractionBox);
            } else {
                cardEl.textContent = value;
            }

            flippedCards.push(cardEl);

            resetBtn.classList.add("active");

            if (flippedCards.length === 2) {
                const [first, second] = flippedCards;

                if (first.dataset.pairId === second.dataset.pairId) {
                    first.dataset.revealed = "true";
                    second.dataset.revealed = "true";

                    const storage = document.querySelector(`.storage li[data-player="${currentPlayer}"]`);

                    [first, second].forEach((card) => {
                        const wrapper = document.createElement("div");
                        wrapper.classList.add("card-wrapper");
                        const val = card.dataset.value;

                        if (isFraction(val)) {
                            const [numerator, denominator] = val.split("/");
                            const fractionBox = document.createElement("div");
                            fractionBox.className = "fraction_box";
                            const top = document.createElement("span");
                            top.className = "numerator";
                            top.textContent = numerator;
                            const bottom = document.createElement("span");
                            bottom.className = "denominator";
                            bottom.textContent = denominator;
                            fractionBox.appendChild(top);
                            fractionBox.appendChild(bottom);
                            wrapper.appendChild(fractionBox);
                        } else {
                            wrapper.textContent = val;
                        }

                        storage.appendChild(wrapper);
                    });

                    const count = storage.querySelectorAll(".card-wrapper").length;
                    updateTabCounter(currentPlayer, count);

                    flippedCards = [];

                    const allRevealed = [...document.querySelectorAll(".card")].every((card) => card.dataset.revealed === "true");

                    if (allRevealed) {
                        submitBtn.classList.add("active");
                        let winner = null;
                        let maxCards = 0;

                        for (let i = 1; i <= players; i++) {
                            const storage = document.querySelector(`.storage li[data-player="${i}"]`);
                            const count = storage.querySelectorAll("math-field, div").length;

                            if (count > maxCards) {
                                maxCards = count;
                                winner = i;
                            }
                        }

                        if (winner) {
                            toastCheckMsg(`${winner}번이 이겼습니다`, 4, false);

                            tabs.forEach((tab) => {
                                tab.classList.toggle("active", tab.dataset.player == winner);
                            });

                            storageItems.forEach((item) => {
                                item.classList.toggle("active", item.dataset.player == winner);
                            });
                        }
                    }
                } else {
                    setTimeout(() => {
                        flippedCards.forEach((card) => {
                            card.classList.remove("revealed");
                            card.innerHTML = "";
                        });
                        flippedCards = [];
                        changeTurn();
                    }, 1000);
                }
            }
        });
    });
}

resetBtn.addEventListener("click", () => {
    currentPlayer = 1;
    flippedCards = [];
    tabs.forEach((tab) => tab.classList.remove("active"));
    tabs[0].classList.add("active");
    storageItems.forEach((item) => item.classList.remove("active"));
    storageItems[0].classList.add("active");
    clearStorage();
    renderCards();
    submitBtn.classList.remove("active");
    resetBtn.classList.remove("active");
});

submitBtn.addEventListener("click", () => {
    toastCheckMsg("선생님께 제출되었습니다.", 5, false);
});

setupTabs();
renderCards();
