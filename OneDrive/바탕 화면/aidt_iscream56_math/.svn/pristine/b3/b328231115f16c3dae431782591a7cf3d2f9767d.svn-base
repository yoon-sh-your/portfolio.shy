const board = document.getElementById("board");
const submitBtn = document.querySelector(".btnSubmit");
const resetBtn = document.querySelector(".btnReset");

const popup = document.createElement("div");
popup.className = "popup";
document.body.appendChild(popup);
popup.style.display = "none";

let currentTarget = null;

// 숫자 배열
const numbers = [
    1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 11, 12, 12, 13, 14, 15, 16, 17, 18, 18, 19, 20, 20, 21, 22, 23, 24, 24, 25, 26, 27, 28, 29, 30, 30, 31, 32, 33, 34, 35, 36, 36, 37, 38, 39, 40, 40, 41, 41, 42, 43, 44, 45, 46,
    47, 48, 49, 50,
];

// 숫자판 생성
numbers.forEach((num) => {
    const cell = document.createElement("li");
    cell.className = "cell";
    cell.textContent = num;
    board.appendChild(cell);
});

// 클릭 시 팝업 출력
board.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell")) return;

    const cell = e.target;
    currentTarget = cell;
    popup.innerHTML = "";

    const rect = cell.getBoundingClientRect();
    popup.style.top = `${window.scrollY + rect.bottom - 20}px`;

    setTimeout(() => {
        const popupWidth = popup.offsetWidth;
        popup.style.left = `${window.scrollX + rect.left + rect.width / 2 - popupWidth / 2}px`;
    }, 0);

    const isMarked = cell.classList.contains("marked-red") || cell.classList.contains("marked-purple") || cell.classList.contains("marked-green");

    if (isMarked) {
        const del = document.createElement("button");
        del.textContent = "삭제";
        del.className = "delete-btn";
        del.onclick = () => {
            cell.classList.remove("marked-red", "marked-purple", "marked-green");
            popup.style.display = "none";
            checkAllMarked();
        };
        popup.appendChild(del);
    } else {
        ["red", "purple", "green"].forEach((color) => {
            const btn = document.createElement("button");
            btn.className = color;
            btn.onclick = () => {
                cell.classList.add(`marked-${color}`);
                popup.style.display = "none";
                checkAllMarked();
            };
            popup.appendChild(btn);
        });
    }

    popup.style.display = "flex";
});

// 외부 클릭 시 팝업 제거
document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && !e.target.classList.contains("cell")) {
        popup.style.display = "none";
    }
});

// 모든 셀이 마킹되었는지 + 리셋 조건 확인
function checkAllMarked() {
    const cells = document.querySelectorAll(".cell");

    const markedCells = [...cells].filter((cell) => cell.classList.contains("marked-red") || cell.classList.contains("marked-purple") || cell.classList.contains("marked-green"));

    const allMarked = markedCells.length === cells.length;

    // 제출 버튼 처리
    submitBtn.classList.toggle("active", allMarked);

    // 리셋 버튼 처리
    resetBtn.classList.toggle("active", markedCells.length > 0);
}

// 전체 리셋
resetBtn.addEventListener("click", () => {
    document.querySelectorAll(".cell").forEach((cell) => {
        cell.classList.remove("marked-red", "marked-purple", "marked-green");
    });
    popup.style.display = "none";

    // 버튼 클래스 제거
    submitBtn.classList.remove("active");
    resetBtn.classList.remove("active");
});
