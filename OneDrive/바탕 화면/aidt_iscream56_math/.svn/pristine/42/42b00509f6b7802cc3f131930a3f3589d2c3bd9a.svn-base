runAfterAppReady(() => {
    let isEvenlyDistributed = false;
    const checkBtn = document.querySelector(".btnCheck");
    const resetBtn = document.querySelector(".btnReset");

    const initialPositions = {};

    // 최초 진입 시 한 번만 저장
    const originalState = [];
    document.querySelectorAll(".dnd_zone .line").forEach((line) => {
        const blocks = [];
        line.querySelectorAll("img").forEach((img) => {
            blocks.push({
                src: img.src,
                alt: img.alt,
                // id, draggable 등 필요한 속성도 복사
            });
        });
        originalState.push(blocks);
    });
    window._originalDndState = originalState; // 전역에 저장

    function checkEvenDistribution() {
        const lines = Array.from(document.querySelectorAll(".dnd_zone .line")).slice(0, 10);
        const counts = lines.map((line) => line.querySelectorAll("img").length);
        isEvenlyDistributed = counts.length > 0 && counts.every((count) => count === counts[0]);
        console.log("isEvenlyDistributed:", isEvenlyDistributed);
    }

    const lines = Array.from(document.querySelectorAll(".dnd_zone .line")).slice(0, 10);

    document.querySelectorAll(".line img").forEach((el, i) => {
        el.style.zIndex = i + 1;
        el.style.position = "relative";
    });

    const imgs = document.querySelectorAll(".dnd_zone .line img");
    imgs.forEach((img, idx) => {
        img.id = "block" + (idx + 1);
        img.setAttribute("draggable", "true");
        img.style.zIndex = 1;

        initialPositions[img.id] = img.parentNode;
    });

    let hasDragged = false;

    imgs.forEach(function (img) {
        img.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("text/plain", e.target.id);
        });
    });

    lines.forEach(function (line) {
        line.addEventListener("dragover", function (e) {
            e.preventDefault();
        });
        line.addEventListener("drop", function (e) {
            e.preventDefault();

            if (line.querySelectorAll("img").length >= 10) {
                toastCheckMsg("이 줄에는 최대 10개까지만 쌓을 수 있어요.", 2, false);
                return;
            }

            const imgId = e.dataTransfer.getData("text/plain");
            const img = document.getElementById(imgId);
            line.appendChild(img);

            const allImgs = document.querySelectorAll(".dnd_zone .line img");
            let maxZ = 1;
            allImgs.forEach((el) => {
                const z = parseInt(window.getComputedStyle(el).zIndex) || 1;
                if (z > maxZ) maxZ = z;
            });
            img.style.zIndex = maxZ + 1;
            if (!hasDragged) {
                hasDragged = true;
            }
            checkEvenDistribution();
            resetBtn.classList.remove("active");
        });
    });

    resetBtn.addEventListener("click", function () {
        // 1. 기존 블록 모두 제거
        document.querySelectorAll(".dnd_zone .line").forEach((line) => {
            while (line.firstChild) line.removeChild(line.firstChild);
        });

        // 2. originalState를 이용해 복원
        const originalState = window._originalDndState || [];
        document.querySelectorAll(".dnd_zone .line").forEach((line, lineIdx) => {
            const blocks = originalState[lineIdx] || [];
            blocks.forEach((block, blockIdx) => {
                const img = document.createElement("img");
                img.src = block.src;
                img.alt = block.alt;
                img.id = `block${lineIdx + 1}_${blockIdx + 1}`;
                img.setAttribute("draggable", "true");
                img.style.zIndex = 1;
                img.style.position = "relative";
                line.appendChild(img);
            });
        });

        // 3. 초기 위치 정보 갱신
        window.initialPositions = {};
        let blockIdx = 1;
        document.querySelectorAll(".dnd_zone .line").forEach((line) => {
            line.querySelectorAll("img").forEach((img) => {
                img.id = `block${blockIdx++}`;
                window.initialPositions[img.id] = line;
            });
        });

        // 4. 드래그 이벤트 재등록
        document.querySelectorAll(".dnd_zone .line img").forEach((img) => {
            img.addEventListener("dragstart", function (e) {
                e.dataTransfer.setData("text/plain", e.target.id);
            });
        });

        hasDragged = false;
        checkBtn.classList.remove("active");
        resetBtn.classList.remove("active");
        checkEvenDistribution();
    });

    document.querySelectorAll(".dnd_zone .line img").forEach((img) => {
        initialPositions[img.id] = img.parentNode;
    });

    defineButtonClassRules([
        {
            selector: ".dnd_zone",
            key: "custom_check_btn_active",
            test: (el) => {
                const imgs = el.querySelectorAll("img");
                for (let img of imgs) {
                    if (img.id && initialPositions[img.id] && img.parentNode !== initialPositions[img.id]) {
                        return true;
                    }
                }
                return false;
            },
        },
    ]);

    window.customCheckCondition = function () {
        return isEvenlyDistributed;
    };

    window.onIncorrectTwiceCustom = function () {
        const firstBlock = document.querySelector(".dnd_zone .line img");
        if (!firstBlock) return;

        const blockSrcs = [];
        document.querySelectorAll(".dnd_zone .line1 img").forEach((img) => {
            if (!blockSrcs.includes(img.src)) blockSrcs.push(img.src);
        });

        document.querySelectorAll(".dnd_zone .line").forEach((line, idx) => {
            while (line.firstChild) line.removeChild(line.firstChild);

            for (let i = 0; i < 8; i++) {
                const img = document.createElement("img");
                img.src = blockSrcs[i % blockSrcs.length];
                img.alt = "";
                img.id = `block${idx * 8 + i + 1}`;
                img.setAttribute("draggable", "true");
                img.style.zIndex = 1;
                img.style.position = "relative";
                line.appendChild(img);
            }
        });

        const initialPositions = window.initialPositions || {};
        let blockIdx = 1;
        document.querySelectorAll(".dnd_zone .line").forEach((line) => {
            line.querySelectorAll("img").forEach((img) => {
                img.id = `block${blockIdx++}`;
                initialPositions[img.id] = line;
            });
        });
        window.initialPositions = initialPositions;

        document.querySelectorAll(".dnd_zone .line img").forEach((img) => {
            img.addEventListener("dragstart", function (e) {
                e.dataTransfer.setData("text/plain", e.target.id);
            });
        });
    };
});
