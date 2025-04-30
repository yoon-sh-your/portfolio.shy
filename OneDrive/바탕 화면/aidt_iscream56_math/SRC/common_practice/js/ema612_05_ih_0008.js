document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gridCanvas");
    const ctx = canvas.getContext("2d");
    const gridSize = 14.2; // 넓이 높이값을 30으로 나눠서 표시 / 예) 600 / 30 = 20 (가로세로 20칸)
    const lines = [];
    let currentStart = null;
    let selectedLineIndex = null;

    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    }
    const savedLines = [
        {
            "start": { "x": 42.6, "y": 85.2 },
            "end": { "x": 85.2, "y": 85.2 },
            "style": "solid"
        },
        {
            "start": { "x": 85.2, "y": 85.2 },
            "end": { "x": 142, "y": 85.2 },
            "style": "solid"
        },
        {
            "start": { "x": 142, "y": 85.2 },
            "end": { "x": 142, "y": 28.4 },
            "style": "solid"
        },
        {
            "start": { "x": 142, "y": 28.4 },
            "end": { "x": 184.6, "y": 28.4 },
            "style": "solid"
        },
        {
            "start": { "x": 184.6, "y": 28.4 },
            "end": { "x": 227.2, "y": 85.2 },
            "style": "solid"
        },
        {
            "start": { "x": 227.2, "y": 85.2 },
            "end": { "x": 298.2, "y": 85.2 },
            "style": "solid"
        },
        {
            "start": { "x": 298.2, "y": 85.2 },
            "end": { "x": 298.2, "y": 142 },
            "style": "solid"
        },
        {
            "start": { "x": 298.2, "y": 142 },
            "end": { "x": 227.2, "y": 142 },
            "style": "solid"
        },
        {
            "start": { "x": 227.2, "y": 142 },
            "end": { "x": 184.6, "y": 198.8 },
            "style": "solid"
        },
        {
            "start": { "x": 184.6, "y": 198.8 },
            "end": { "x": 142, "y": 198.8 },
            "style": "solid"
        },
        {
            "start": { "x": 142, "y": 198.8 },
            "end": { "x": 142, "y": 142 },
            "style": "solid"
        },
        {
            "start": { "x": 142, "y": 142 },
            "end": { "x": 42.6, "y": 142 },
            "style": "solid"
        },
        {
            "start": { "x": 42.6, "y": 142 },
            "end": { "x": 42.6, "y": 85.2 },
            "style": "solid"
        },
        {
            "start": { "x": 85.2, "y": 85.2 },
            "end": { "x": 85.2, "y": 142 },
            "style": "dotted"
        },
        {
            "start": { "x": 142, "y": 85.2 },
            "end": { "x": 142, "y": 142 },
            "style": "dotted"
        },
        {
            "start": { "x": 227.2, "y": 85.2 },
            "end": { "x": 142, "y": 85.2 },
            "style": "solid"
        },
        {
            "start": { "x": 227.2, "y": 85.2 },
            "end": { "x": 227.2, "y": 142 },
            "style": "dotted"
        },
        {
            "start": { "x": 227.2, "y": 142 },
            "end": { "x": 142, "y": 142 },
            "style": "solid"
        },
        {
            "start": { "x": 284, "y": 454.4 },
            "end": { "x": 241.4, "y": 454.4 },
            "style": "solid"
        },
        {
            "start": { "x": 241.4, "y": 454.4 },
            "end": { "x": 198.8, "y": 397.6 },
            "style": "solid"
        },
        {
            "start": { "x": 198.8, "y": 397.6 },
            "end": { "x": 127.8, "y": 397.6 },
            "style": "solid"
        },
        {
            "start": { "x": 127.8, "y": 397.6 },
            "end": { "x": 85.2, "y": 397.6 },
            "style": "solid"
        },
        {
            "start": { "x": 85.2, "y": 397.6 },
            "end": { "x": 28.4, "y": 397.6 },
            "style": "solid"
        },
        {
            "start": { "x": 28.4, "y": 397.6 },
            "end": { "x": 28.4, "y": 340.8 },
            "style": "solid"
        },
        {
            "start": { "x": 28.4, "y": 340.8 },
            "end": { "x": 85.2, "y": 340.8 },
            "style": "solid"
        },
        {
            "start": { "x": 85.2, "y": 340.8 },
            "end": { "x": 85.2, "y": 284 },
            "style": "solid"
        },
        {
            "start": { "x": 85.2, "y": 284 },
            "end": { "x": 170.4, "y": 284 },
            "style": "solid"
        },
        {
            "start": { "x": 170.4, "y": 284 },
            "end": { "x": 127.8, "y": 340.8 },
            "style": "solid"
        },
        {
            "start": { "x": 127.8, "y": 340.8 },
            "end": { "x": 284, "y": 340.8 },
            "style": "solid"
        },
        {
            "start": { "x": 284, "y": 340.8 },
            "end": { "x": 284, "y": 454.4 },
            "style": "solid"
        },
        {
            "start": { "x": 198.8, "y": 397.6 },
            "end": { "x": 284, "y": 397.6 },
            "style": "dotted"
        },
        {
            "start": { "x": 198.8, "y": 397.6 },
            "end": { "x": 198.8, "y": 340.8 },
            "style": "dotted"
        },
        {
            "start": { "x": 85.2, "y": 340.8 },
            "end": { "x": 127.8, "y": 340.8 },
            "style": "dotted"
        },
        {
            "start": { "x": 85.2, "y": 340.8 },
            "end": { "x": 85.2, "y": 397.6 },
            "style": "dotted"
        },
        {
            "start": { "x": 127.8, "y": 340.8 },
            "end": { "x": 127.8, "y": 397.6 },
            "style": "dotted"
        }
    ];
    function getInputPosition(e) {
        const rect = canvas.getBoundingClientRect();
        const isTouch = e.type.startsWith("touch");
        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;

        // 스케일 보정
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    }

    function isNearPoint(p1, p2, radius = 6) {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y) <= radius;
    }

    function snapToGrid(x, y) {
        return {
            x: Math.round(x / gridSize) * gridSize,
            y: Math.round(y / gridSize) * gridSize,
        };
    }

    function distanceToLine(px, py, a, b) {
        const A = px - a.x;
        const B = py - a.y;
        const C = b.x - a.x;
        const D = b.y - a.y;
        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        const param = len_sq !== 0 ? dot / len_sq : -1;
        let xx, yy;
        if (param < 0) {
            xx = a.x;
            yy = a.y;
        } else if (param > 1) {
            xx = b.x;
            yy = b.y;
        } else {
            xx = a.x + param * C;
            yy = a.y + param * D;
        }
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);

        console.log("distanctToLine");
    }

    function findSelectableLine(x, y) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const dist = distanceToLine(x, y, line.start, line.end);
            if (dist < 6 && !isNearPoint({ x, y }, line.start) && !isNearPoint({ x, y }, line.end)) {
                return i;
            }
        }
        return null;
    }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 그리드
        ctx.strokeStyle = "#00a0e9";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2.5, 2.5]);
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // 선
        lines.forEach((line, i) => {
            ctx.beginPath();
            ctx.setLineDash(line.style === "dotted" ? [5, 5] : []);
            ctx.strokeStyle = i === selectedLineIndex ? "#FF0000" : "black";
            ctx.lineWidth = 2;
            ctx.moveTo(line.start.x, line.start.y);
            ctx.lineTo(line.end.x, line.end.y);
            ctx.stroke();
            ctx.setLineDash([]);
        });
        if (currentStart) {
            ctx.beginPath();
            ctx.arc(currentStart.x, currentStart.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "red";
            ctx.fill();
        }
    }

    function showLayerAt(point) {
        const layer = document.getElementById("lineSelectLayer");
        const rect = canvas.getBoundingClientRect();
        // 실제 브라우저 화면 위치로 변환
        let offsetX, offsetY;
        let middleX = (point.x - currentStart.x) / 2;
        let middleX2 = (currentStart.x - point.x) / 2;

        if (currentStart.x < point.x && currentStart.y == point.y) {
            offsetX = point.x - middleX - 53;
            offsetY = point.y + 40;
        }
        else if (currentStart.x > point.x && currentStart.y == point.y) {
            offsetX = currentStart.x - middleX2 - 53;
            offsetY = point.y + 40;
        }
        else {
            offsetX = point.x - 52;
            offsetY = point.y + 40;
        }
        layer.style.left = `${offsetX}px`;
        layer.style.top = `${offsetY}px`;
        layer.style.display = "block";
    }

    function hideLayer() {
        const layer = document.getElementById("lineSelectLayer");
        layer.style.display = "none";
    }
    function handleInput(e) {
        e.preventDefault();
        const { x, y } = getInputPosition(e);
        const snapped = snapToGrid(x, y);
        const radius = isMobileDevice() ? 12 : 6;

        let snappedPoint = snapped;

        for (const line of lines) {
            if (isNearPoint(snapped, line.start, radius)) {
                snappedPoint = line.start;
                break;
            }
            if (isNearPoint(snapped, line.end, radius)) {
                snappedPoint = line.end;
                break;
            }
        }

        if (!currentStart) {
            currentStart = snappedPoint;
            selectedLineIndex = null;
            hideLayer(); // 초기 클릭시 숨김
        } else {
            lines.push({ start: currentStart, end: snappedPoint, style: "solid" });
            selectedLineIndex = lines.length - 1; // 방금 그린 선을 선택 상태로!
            showLayerAt(snappedPoint); // 레이어 표시
        }

        const lineIndex = findSelectableLine(x, y);
        if (lineIndex !== null) {
            selectedLineIndex = lineIndex;
            currentStart = null;
            // hideLayer(); // 선 선택 시는 숨김
        }

        drawGrid();
        document.querySelectorAll(".btn_area .btnReset, .btn_area .btnSubmit").forEach(function (btn) {
            btn.classList.add("active");
        });
    }

    function setStyle(style) {
        if (selectedLineIndex !== null) {
            lines[selectedLineIndex].style = style;
            drawGrid();
        }

        // 상태 초기화
        selectedLineIndex = null;
        currentStart = null;
    }

    function showCurrentLines() {
        const json = JSON.stringify(
            lines.map((line) => ({
                start: line.start,
                end: line.end,
                style: line.style,
            })),
            null,
            2,
        );
        document.getElementById("jsonArea").value = json;
    }

    function loadLines() {
        lines.length = 0;
        for (const line of savedLines) {
            lines.push({ start: line.start, end: line.end, style: line.style });
        }
        selectedLineIndex = null;
        currentStart = null;
        drawGrid();
    }

    function resetCanvas() {
        lines.length = 0;
        selectedLineIndex = null;
        currentStart = null;
        // document.getElementById("jsonArea").value = "";
        drawGrid();
        hideLayer();
        document.querySelector("#app_wrap").classList.remove("answered");
        document.querySelector(".btn_area .btnReset").classList.remove("active");
        document.querySelector(".btn_area .btnSubmit").classList.remove("active");
    }

    document.querySelector(".to_solid").addEventListener("click", () => {
        setStyle("solid");
        hideLayer(); // 스타일 설정 후 레이어 숨기기
    });

    document.querySelector(".to_dotted").addEventListener("click", () => {
        setStyle("dotted");
        hideLayer(); // 스타일 설정 후 레이어 숨기기
    });

    document.querySelector(".btnReset").addEventListener("click", () => {
        resetCanvas();
    });

    canvas.addEventListener("click", handleInput);
    canvas.addEventListener("touchstart", handleInput, { passive: false });

    drawGrid();

    document.querySelector(".btnSubmit").addEventListener("click", () => {
        const wrap = document.querySelector("#app_wrap");

        toastCheckMsg("선생님께 제출되었습니다.", 5, false);
        loadLines();
        if (wrap.classList.contains("answered")) {
            wrap.classList.remove("answered");
        } else {
            wrap.classList.add("answered");
        }
    });
});
runAfterAppReady(() => {
    $('.btnSubmit').click(function () {
        $('.solve_area').addClass('active');
    });
    $('.btnReset').click(function () {
        $('.solve_area').removeClass('active');
    });
});

// function addResult() {
// 	let booleanWraps = document.querySelectorAll(".boolean_wrap");

// 	booleanWraps.forEach(function (booleanWrap) {
// 		booleanWrap.classList.add("result");
// 	});
// }

// function removeResult() {
// 	let booleanWraps = document.querySelectorAll(".boolean_wrap");

// 	booleanWraps.forEach(function (booleanWrap) {
// 		booleanWrap.classList.remove("result");
// 	});
// }

// // 정답일 때
// function onCorrectCustom() {
// 	addResult();
// }

// // 리셋일 떄
// function resetCustom() {
// 	removeResult();
// }

// // 첫번째 틀렸을 때
// function onIncorrectCustom() {
// 	removeResult();
// }

// // 두번째 틀렸을 때
// function onIncorrectTwiceCustom() {
// 	addResult();
// }

// // 빈칸일 때
// function onEmptyCustom() {
// 	removeResult();
// }