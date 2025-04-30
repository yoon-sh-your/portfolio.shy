const tabs = document.querySelectorAll(".tab");
const storageItems = document.querySelectorAll(".storage li");
const submitBtn = document.querySelector(".btnSubmit");
const resetBtn = document.querySelector(".btnReset");

const playerCorrectCount = {
    1: 0,
    2: 0,
};

function updateTabBadge(playerId) {
    const tab = document.querySelector(`.tab[data-player="${playerId}"]`);
    tab.querySelector(".badge")?.remove();

    const count = playerCorrectCount[playerId];
    if (count > 0) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = `${count}개`;
        tab.appendChild(badge);
    }
}

document.querySelectorAll(".check").forEach((btn) => {
    btn.addEventListener("click", () => {
        const box = btn.closest(".box");
        const w = parseFloat(box.querySelector(".w").value);
        const l = parseFloat(box.querySelector(".l").value);
        const h = parseFloat(box.querySelector(".h").value);
        const volumeInput = box.querySelector(".volume");
        const userVolume = parseFloat(volumeInput.value);
        const boxInner = box.querySelector(".box-inner");

        if (isNaN(w) || isNaN(l) || isNaN(h) || isNaN(userVolume)) {
            return;
        }

        const correctVolume = w * l * h;
        const isCorrect = Math.abs(correctVolume - userVolume) < 0.01;

        volumeInput.classList.remove("correct", "wrong");
        volumeInput.classList.add(isCorrect ? "correct" : "wrong");

        if (isCorrect) {
            toastCheckMsg("정답이에요!", 4, false);
            boxInner.classList.add("correct-box");

            const parentStorage = box.closest("li[data-player]");
            const playerId = parentStorage.dataset.player;

            if (!volumeInput.dataset.answered) {
                playerCorrectCount[playerId]++;
                updateTabBadge(playerId);
                volumeInput.dataset.answered = "true";
            }
        } else {
            toastCheckMsg("한 번 더 생각해 보세요.", 2, false);
        }
    });
});

document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
        resetBtn.classList.add("active");
        submitBtn.classList.add("active");
    });
});

const inputCache = {
    1: [],
    2: [],
};

document.querySelectorAll(".storage li").forEach((storage) => {
    const playerId = storage.dataset.player;
    storage.querySelectorAll(".box").forEach((box, boxIdx) => {
        box.querySelectorAll(".w, .l, .h").forEach((input) => {
            input.addEventListener("input", () => {
                if (!inputCache[playerId]) inputCache[playerId] = [];
                if (!inputCache[playerId][boxIdx]) inputCache[playerId][boxIdx] = { w: "", l: "", h: "" };
                inputCache[playerId][boxIdx][input.className] = input.value;
            });
        });
    });
});

resetBtn.addEventListener("click", () => {
    document.querySelectorAll("input").forEach((input) => {
        input.value = "";
        input.classList.remove("correct", "wrong");
        delete input.dataset.answered;
        input.removeAttribute("disabled");
        input.classList.remove("disabled-box");
        if (input.classList.contains("volume")) input.setAttribute("readonly", true);
    });

    document.querySelectorAll(".box-inner").forEach((box) => {
        box.classList.remove("correct-box");
        box.classList.remove("disabled-box");
    });

    document.querySelectorAll(".check").forEach((btn) => btn.setAttribute("disabled", true));

    playerCorrectCount[1] = 0;
    playerCorrectCount[2] = 0;
    updateTabBadge(1);
    updateTabBadge(2);

    inputCache[1] = [];
    inputCache[2] = [];

    resetBtn.classList.remove("active");
    submitBtn.classList.remove("active");
});

let currentPlayer = 1;

function isAllInputsFilled(playerId) {
    return inputCache[playerId]?.length === 3 && inputCache[playerId].every((b) => b.w && b.l && b.h);
}

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        if (tab.classList.contains("disabled")) return;

        const selectedPlayerId = parseInt(tab.dataset.player);
        const opponentId = selectedPlayerId === 1 ? 2 : 1;

        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        storageItems.forEach((item) => {
            item.classList.toggle("active", item.dataset.player == selectedPlayerId);
        });

        const myStorage = document.querySelector(`.storage li[data-player="${selectedPlayerId}"]`);
        const opponentStorage = document.querySelector(`.storage li[data-player="${opponentId}"]`);

        if (isAllInputsFilled(1) && isAllInputsFilled(2)) {
            const boxes = myStorage.querySelectorAll(".box");
            const showData = inputCache[opponentId];

            boxes.forEach((box, idx) => {
                const val = showData[idx];
                box.querySelector(".w").value = val.w;
                box.querySelector(".l").value = val.l;
                box.querySelector(".h").value = val.h;

                box.querySelector(".box-inner").classList.add("disabled-box");
                box.querySelectorAll(".w, .l, .h").forEach((input) => {
                    input.setAttribute("disabled", true);
                    input.classList.add("disabled-box");
                });
                box.querySelector(".volume").removeAttribute("readonly");
                box.querySelector(".check").removeAttribute("disabled");
            });
        } else {
            myStorage.querySelectorAll(".box").forEach((box, idx) => {
                const cached = inputCache[selectedPlayerId]?.[idx];
                box.querySelector(".w").value = cached?.w || "";
                box.querySelector(".l").value = cached?.l || "";
                box.querySelector(".h").value = cached?.h || "";

                box.querySelectorAll(".w, .l, .h").forEach((input) => {
                    input.removeAttribute("disabled");
                    input.classList.remove("disabled-box");
                });
                box.querySelector(".box-inner").classList.remove("disabled-box");
                box.querySelector(".volume").setAttribute("readonly", true);
                box.querySelector(".check").setAttribute("disabled", true);
            });
        }

        opponentStorage.querySelectorAll(".box").forEach((box) => {
            box.querySelectorAll(".w, .l, .h").forEach((input) => {
                input.setAttribute("disabled", true);
                input.classList.add("disabled-box");
            });
            box.querySelector(".box-inner").classList.add("disabled-box");
            box.querySelector(".volume").setAttribute("readonly", true);
            box.querySelector(".check").setAttribute("disabled", true);
        });
    });
});

submitBtn.addEventListener("click", () => {
    toastCheckMsg("선생님께 제출되었습니다.", 5, false);
});
