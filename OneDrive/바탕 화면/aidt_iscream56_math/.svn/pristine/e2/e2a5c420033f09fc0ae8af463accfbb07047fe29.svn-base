const map = document.getElementById("map");
const treasureList = document.getElementById("treasureList");
const dice1El = document.getElementById("dice1");
const dice2El = document.getElementById("dice2");
const startBtn = document.getElementById("startBtn");
const countEl = document.getElementById("count");
const limitEl = document.getElementById("limit");
const colorPopup = document.getElementById("colorPopup");
const submitBtn = document.querySelector(".btnSubmit");
const resetBtn = document.querySelector(".btnReset");

const initialTreasureHTML = treasureList.innerHTML;

const totalCols = 36;
const totalRows = 24;
const tiles = [];
let isDragging = false;
let markLimit = 0;
let currentCount = 0;
let selectedColor = null;
let currentTurnSet = new Set();
const colorStarts = {};
const markedMap = {}; // key: color, value: Set

const cornerPositions = new Set(["0,0", "0,35", "23,0", "23,35"]);

for (let i = 0; i < totalRows; i++) {
    for (let j = 0; j < totalCols; j++) {
        const tile = document.createElement("li");
        tile.className = "tile";
        tile.dataset.row = i;
        tile.dataset.col = j;

        tile.addEventListener("mousedown", (e) => {
            if (markLimit === 0) return;
            if (!selectedColor) {
                showColorPopup(e.pageX, e.pageY, tile);
            } else {
                if (!isMarkable(tile)) return;
                isDragging = true;
                markTile(tile);
            }
        });

        tile.addEventListener("mouseover", () => {
            if (!isDragging || currentCount >= markLimit || !selectedColor) return;
            if (!isMarkable(tile)) return;
            markTile(tile);
        });

        tile.addEventListener("dragover", (e) => e.preventDefault());
        tile.addEventListener("drop", (e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData("text/plain");
            if (tile.querySelector(".mini-treasure")) return;
            const mini = document.createElement("div");
            mini.className = `mini-treasure ${type}`;
            tile.appendChild(mini);

            if (map.querySelectorAll(".mini-treasure").length >= 2) {
                startBtn.disabled = false;
            }

            const target = treasureList.querySelector(`.treasure[data-type="${type}"]`);
            if (target) target.remove();
        });

        tiles.push(tile);
        map.appendChild(tile);
    }
}

function isMarkable(tile) {
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);
    const key = `${row},${col}`;
    if (!markedMap[selectedColor]) markedMap[selectedColor] = new Set();
    if (markedMap[selectedColor].has(key)) return false;
    if (currentTurnSet.size >= markLimit) return false;
    if (!colorStarts[selectedColor]) return cornerPositions.has(key);
    const neighbors = [`${row - 1},${col}`, `${row + 1},${col}`, `${row},${col - 1}`, `${row},${col + 1}`];
    return neighbors.some((n) => markedMap[selectedColor].has(n));
}

function markTile(tile) {
    const row = tile.dataset.row;
    const col = tile.dataset.col;
    const key = `${row},${col}`;
    tile.classList.add("marked");
    markedMap[selectedColor].add(key);
    currentTurnSet.add(key);
    currentCount = currentTurnSet.size;
    // countEl.textContent = currentCount;
    colorStarts[selectedColor] = true;
    updateTileBorders();

    if (!submitBtn.classList.contains("active") || !resetBtn.classList.contains("active")) {
        submitBtn.classList.add("active");
        resetBtn.classList.add("active");
    }
}

document.addEventListener("mouseup", () => {
    if (isDragging) isDragging = false;
});

function updateTileBorders() {
    tiles.forEach((tile) => {
        tile.classList.remove("border-top", "border-bottom", "border-left", "border-right");
        tile.style.borderColor = ""; // 초기화
    });

    Object.entries(markedMap).forEach(([color, set]) => {
        set.forEach((key) => {
            const [r, c] = key.split(",").map(Number);
            const tile = tiles[r * totalCols + c];

            const neighbors = {
                top: `${r - 1},${c}`,
                bottom: `${r + 1},${c}`,
                left: `${r},${c - 1}`,
                right: `${r},${c + 1}`,
            };

            if (!set.has(neighbors.top)) tile.classList.add("border-top");
            if (!set.has(neighbors.bottom)) tile.classList.add("border-bottom");
            if (!set.has(neighbors.left)) tile.classList.add("border-left");
            if (!set.has(neighbors.right)) tile.classList.add("border-right");

            tile.style.borderColor = color;
        });
    });
}

startBtn.addEventListener("click", () => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    dice1El.dataset.value = d1;
    dice2El.dataset.value = d2;
    markLimit = d1 * d2;
    currentTurnSet.clear();
    currentCount = 0;
    // countEl.textContent = 0;
    // limitEl.textContent = markLimit;
    selectedColor = null;
    colorPopup.style.display = "none";
});

function showColorPopup(_, __, tile) {
    const appWrap = document.getElementById("app_wrap");
    const scale = getComputedStyle(appWrap).transform;

    let scaleX = 1;
    if (scale && scale !== "none") {
        const match = scale.match(/matrix\(([^,]+)/);
        if (match) scaleX = parseFloat(match[1]);
    }

    const tileRect = tile.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const popupWidth = colorPopup.offsetWidth || 128;
    const popupHeight = colorPopup.offsetHeight || 83;
    const marginY = 10; // 팝업을 타일에서 10px 아래로 띄우기

    const centerX = tileRect.left + scrollX + tileRect.width / 2;
    const posX = (centerX - popupWidth / 2) / scaleX;

    const posY = (tileRect.bottom + scrollY + marginY) / scaleX;

    colorPopup.style.position = "absolute";
    colorPopup.style.left = `${posX}px`;
    colorPopup.style.top = `${posY}px`;
    colorPopup.style.display = "flex";

    colorPopup.onclick = (e) => {
        const color = e.target.dataset.color;
        if (color) {
            selectedColor = color;
            colorPopup.style.display = "none";
            if (isMarkable(tile)) {
                isDragging = true;
                markTile(tile);
            }
        }
    };
}

document.querySelectorAll(".treasure").forEach((el) => {
    el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.dataset.type);
    });
});

resetBtn.addEventListener("click", () => {
    tiles.forEach((tile) => {
        tile.className = "tile";
        tile.style.borderColor = "";
        tile.innerHTML = "";
    });

    document.querySelectorAll(".mini-treasure").forEach((el) => el.remove());
    treasureList.innerHTML = initialTreasureHTML;

    treasureList.querySelectorAll(".treasure").forEach((el) => {
        el.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.dataset.type);
        });
    });

    Object.keys(markedMap).forEach((color) => markedMap[color].clear());
    currentTurnSet.clear();
    currentCount = 0;
    markLimit = 0;
    selectedColor = null;
    colorPopup.style.display = "none";
    Object.keys(colorStarts).forEach((color) => (colorStarts[color] = false));

    dice1El.dataset.value = "";
    dice2El.dataset.value = "";

    submitBtn.classList.remove("active");
    resetBtn.classList.remove("active");
});

submitBtn.addEventListener("click", () => {
    toastCheckMsg("제출하시겠습니까?", 5, true);

    e.stopImmediatePropagation();
});
