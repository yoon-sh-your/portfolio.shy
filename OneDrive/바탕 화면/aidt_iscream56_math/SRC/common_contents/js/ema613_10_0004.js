const minuteInput = document.getElementById("minute");
const secondInput = document.getElementById("second");
const startBtn = document.getElementById("startBtn");
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");
const modal3 = document.getElementById("modal3");
const modals = [modal1, modal2, modal3];
const resetBtn = document.querySelector(".btnReset");
const submitBtn = document.querySelector(".btnSubmit");

let lastSelected = null;
let currentTargetTd = null;

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

function updateScore() {
    const yellowCount = document.querySelectorAll("td.yellow").length;
    const blueCount = document.querySelectorAll("td.blue").length;
    document.getElementById("score1").textContent = yellowCount;
    document.getElementById("score2").textContent = blueCount;
}

document.querySelectorAll("td").forEach((td) => {
    td.addEventListener("click", (e) => {
        console.log(e);
        if ((lastSelected && lastSelected.classList.contains("bonus")) || (currentTargetTd && currentTargetTd.classList.contains("bonus"))) {
            if (!td.classList.contains("yellow") && !td.classList.contains("blue") && !td.classList.contains("bonus") && !td.classList.contains("launch") && !td.classList.contains("stay")) {
                const tr = td.closest("tr");
                const trIndex = Array.from(tr.parentNode.children).indexOf(tr);
                const showAbove = trIndex >= 3;

                const appWrap = document.getElementById("app_wrap");
                const appRect = appWrap.getBoundingClientRect();
                const scaleX = appRect.width / appWrap.offsetWidth;
                const scaleY = appRect.height / appWrap.offsetHeight;

                const rect = td.getBoundingClientRect();
                const tdLeft = (rect.left - appRect.left) / scaleX;
                const tdTop = (rect.top - appRect.top) / scaleY;
                const tdCenterX = tdLeft + rect.width / (2 * scaleX);

                const modalHeight = modal3.offsetHeight;
                const modalWidth = modal3.offsetWidth;
                const topPosition = showAbove ? tdTop - modalHeight : tdTop + rect.height / scaleY;
                const leftPosition = tdCenterX - modalWidth / 2;

                modal3.style.top = `${topPosition}px`;
                modal3.style.left = `${leftPosition}px`;
                modal3.style.display = "block";
                modal3.style.visibility = "visible";
                modal3.classList.add("show");

                const targetTd = td;

                modal3.querySelectorAll(".color").forEach((btn) => {
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                });

                let once = false;
                modal3.querySelectorAll(".color").forEach((btn) => {
                    btn.disabled = false;
                    btn.addEventListener("click", () => {
                        if (once) return;
                        targetTd.classList.add(btn.classList.contains("yellow") ? "yellow" : "blue");
                        updateScore();
                        btn.disabled = true;
                        once = true;
                        currentTargetTd = null;
                        modal3.classList.remove("show");
                        modal3.style.display = "none";
                        modal3.style.visibility = "hidden";

                        if (lastSelected && lastSelected.classList.contains("bonus")) {
                            lastSelected.classList.remove("yellow", "blue");
                        }
                    });
                });

                return;
            }
        }

        if (!currentTargetTd || td !== currentTargetTd || td.classList.contains("yellow") || td.classList.contains("blue")) return;

        if (lastSelected) lastSelected.classList.remove("selected");
        td.classList.add("selected");
        lastSelected = td;

        const rect = td.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const scrollLeft = window.scrollX;
        const tdTop = rect.top + scrollTop;
        const tdLeft = rect.left + scrollLeft;
        const tdCenterX = tdLeft + rect.width / 2;

        const tr = td.closest("tr");
        const trIndex = Array.from(tr.parentNode.children).indexOf(tr);
        const showAbove = trIndex >= 3;

        let targetModal = null;
        if (td.classList.contains("calc")) {
            targetModal = modal2;
        } else if (td.classList.contains("bonus")) {
            return;
        } else if (!td.classList.contains("stay") && !td.classList.contains("launch")) {
            targetModal = modal1;
        }

        modals.forEach((modal) => {
            modal.classList.remove("show");
            modal.style.visibility = "hidden";
            modal.style.display = "block";
        });

        if (targetModal) {
            const appWrap = document.getElementById("app_wrap");
            const appRect = appWrap.getBoundingClientRect();
            const scaleX = appRect.width / appWrap.offsetWidth;
            const scaleY = appRect.height / appWrap.offsetHeight;

            const rect = td.getBoundingClientRect();
            const tdLeft = (rect.left - appRect.left) / scaleX;
            const tdTop = (rect.top - appRect.top) / scaleY;
            const tdCenterX = tdLeft + rect.width / (2 * scaleX);

            const modalHeight = targetModal.offsetHeight;
            const modalWidth = targetModal.offsetWidth;
            const topPosition = showAbove ? tdTop - modalHeight : tdTop + rect.height / scaleY;
            const leftPosition = tdCenterX - modalWidth / 2;

            targetModal.style.top = `${topPosition}px`;
            targetModal.style.left = `${leftPosition}px`;
            if (targetModal !== modal3) {
                targetModal.querySelector(".number").textContent = td.textContent.replace(/^계산기/, "").trim();
            }
            targetModal.style.visibility = "visible";
            targetModal.classList.add("show");
        }

        modals.forEach((modal) => {
            if (modal !== targetModal) modal.style.display = "none";
        });
    });
});

document.querySelectorAll("td.launch").forEach((launchBtn) => {
    launchBtn.addEventListener("click", () => {
        const allTd = Array.from(document.querySelectorAll("td"));
        const excludeTd = allTd.filter((td) => td.classList.contains("launch"));
        const availableTd = allTd.filter((td) => !td.classList.contains("launch"));

        const randomTd = availableTd[Math.floor(Math.random() * availableTd.length)];
        currentTargetTd = randomTd;

        resetBtn.classList.add("active");
        submitBtn.classList.add("active");

        modals.forEach((modal) => {
            modal.classList.remove("show");
            modal.style.display = "none";
            modal.style.visibility = "hidden";

            const input = modal.querySelector("input[type='number']");
            if (input) input.value = "";
        });
        document.querySelectorAll(".color").forEach((btn) => {
            btn.disabled = true;
        });
        allTd.forEach((td) => td.classList.remove("target"));
        randomTd.classList.add("target");

        const clip = document.querySelector(".clip");
        const appWrap = document.getElementById("app_wrap");
        const appRect = appWrap.getBoundingClientRect();
        const scaleX = appRect.width / appWrap.offsetWidth;
        const scaleY = appRect.height / appWrap.offsetHeight;

        const launchRect = excludeTd[0].getBoundingClientRect();
        const targetRect = randomTd.getBoundingClientRect();

        // 이동 거리 조정값
        const adjustX = 20;
        const adjustY = 20;

        const startX = (launchRect.left - appRect.left) / scaleX + launchRect.width / 2 - clip.offsetWidth / 2 - adjustX;
        const startY = (launchRect.top - appRect.top) / scaleY + launchRect.height / 2 - clip.offsetHeight / 2 - adjustY;
        const targetX = (targetRect.left - appRect.left) / scaleX + targetRect.width / 2 - clip.offsetWidth / 2 - adjustX;
        const targetY = (targetRect.top - appRect.top) / scaleY + targetRect.height / 2 - clip.offsetHeight / 2 - adjustY;

        clip.style.position = "absolute";
        clip.style.transition = "none";
        clip.style.left = `${startX}px`;
        clip.style.top = `${startY}px`;
        clip.style.transform = `rotate(0deg)`;

        void clip.offsetWidth;

        const angle = Math.floor(Math.random() * 360);
        clip.style.transition = "transform 1s ease-in-out, top 1s ease-in-out, left 1s ease-in-out";
        clip.style.left = `${targetX}px`;
        clip.style.top = `${targetY}px`;
        clip.style.transform = `rotate(${angle}deg)`;

        if (randomTd.classList.contains("stay")) return;

        if (randomTd.classList.contains("bonus")) {
            const noColorTd = allTd.filter((td) => !td.classList.contains("yellow") && !td.classList.contains("blue"));
            if (noColorTd.length > 0) {
                const pick = noColorTd[Math.floor(Math.random() * noColorTd.length)];
                const pickRect = pick.getBoundingClientRect();
                const pickTop = pickRect.top + scrollTop + pickRect.height;
                const pickLeft = pickRect.left + scrollLeft + pickRect.width / 2 - modal3.offsetWidth / 2;

                modal3.style.top = `${pickTop}px`;
                modal3.style.left = `${pickLeft}px`;
                modal3.style.display = "block";
                modal3.classList.add("show");
            }
        }
    });
});

document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const modal = btn.closest(".modal");
        modal.classList.remove("show");
        modal.style.display = "none";
        modal.style.visibility = "hidden";
    });
});

document.querySelectorAll(".check").forEach((btn) => {
    btn.addEventListener("click", () => {
        const modal = btn.closest(".modal");
        const expression = modal.querySelector(".number").textContent;
        const inputVal = parseFloat(modal.querySelector("input").value);
        try {
            const result = eval(expression.replace(/÷/g, "/"));
            if (Math.abs(result - inputVal) < 0.0001) {
                toastCheckMsg("정답이에요!", 4, false);
            } else {
                toastCheckMsg("오답입니다!", 2, false);
            }
        } catch (err) {
            toastCheckMsg("수식을 확인해주세요.", 2, false);
        }
    });
});

document.querySelectorAll(".circle.ok").forEach((btn) => {
    btn.addEventListener("click", () => {
        const modal = btn.closest(".modal");
        modal.querySelectorAll(".color").forEach((colorBtn) => {
            colorBtn.removeAttribute("disabled");
        });
    });
});

document.querySelectorAll(".circle.no").forEach((btn) => {
    btn.addEventListener("click", () => {
        const modal = btn.closest(".modal");
        modal.querySelectorAll(".color").forEach((colorBtn) => {
            colorBtn.setAttribute("disabled", "disabled");
        });
    });
});

document.querySelectorAll(".color").forEach((btn) => {
    btn.addEventListener("click", () => {
        if (lastSelected) {
            lastSelected.classList.remove("yellow", "blue");
            lastSelected.classList.add(btn.classList.contains("yellow") ? "yellow" : "blue");
            updateScore();
            currentTargetTd = null;
        }
    });
});

resetBtn.addEventListener("click", () => {
    document.querySelectorAll("td").forEach((td) => {
        td.classList.remove("yellow", "blue", "selected", "target");
    });

    modals.forEach((modal) => {
        modal.classList.remove("show");
        modal.style.display = "none";
        modal.style.visibility = "hidden";
    });

    document.querySelectorAll(".color").forEach((btn) => {
        btn.disabled = true;
    });

    updateScore();

    lastSelected = null;
    currentTargetTd = null;
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

submitBtn.addEventListener("click", () => {
    toastCheckMsg("선생님께 제출되었습니다.", 5, false);
});
