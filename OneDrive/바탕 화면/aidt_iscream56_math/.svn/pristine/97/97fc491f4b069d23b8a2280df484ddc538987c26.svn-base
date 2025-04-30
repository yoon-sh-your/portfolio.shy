const cells = document.querySelectorAll(".bingo-cell");
const resetBtn = document.querySelector(".btnReset");
const submitBtn = document.querySelector(".btnSubmit");
const lines = {
    0: document.querySelector(".line-row-0"),
    1: document.querySelector(".line-row-1"),
    2: document.querySelector(".line-row-2"),
    3: document.querySelector(".line-col-0"),
    4: document.querySelector(".line-col-1"),
    5: document.querySelector(".line-col-2"),
    6: document.querySelector(".line-diag-0"),
    7: document.querySelector(".line-diag-1"),
};
const bingoLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function checkBingo() {
    let bingoCount = 0;
    bingoLines.forEach((line, i) => {
        const isBingo = line.every((idx) => cells[idx].classList.contains("checked"));
        lines[i].classList.toggle("visible", isBingo);
        if (isBingo) bingoCount++;
    });
    if (bingoCount >= 3) {
        toastCheckMsg("빙고가 완성되었습니다!", 4, false);
        submitBtn.classList.add("active");
    }
}

cells.forEach((cell) => {
    cell.addEventListener("click", () => {
        cell.classList.add("checked");
        checkBingo();
        resetBtn.classList.add("active");
    });
});

resetBtn.addEventListener("click", () => {
    cells.forEach((cell) => cell.classList.remove("checked"));
    Object.values(lines).forEach((line) => line.classList.remove("visible"));
    resetBtn.classList.remove("active");
    submitBtn.classList.remove("active");
});

submitBtn.addEventListener("click", () => {
    toastCheckMsg("선생님께 제출되었습니다.", 5, false);
});
