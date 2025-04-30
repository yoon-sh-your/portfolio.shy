document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gridCanvas");
    const ctx = canvas.getContext("2d");
    const scale = 1;
    const points = [{
            x: 140,
            y: 85
        }, // 첫 번째 점
        {
            x: 248,
            y: 234
        }, // 두 번째 점
        {
            x: 385,
            y: 218
        }, // 세 번째 점
        {
            x: 472,
            y: 370
        }, // 네 번째 점
        {
            x: 614,
            y: 253
        } // 다섯 번째 점
    ];

    const lines = [];
    let currentStart = null;
    let selectedLineIndex = null;

    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    }

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

    function isNearPoint(p1, p2, radius = 20) {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y) <= radius;
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
    }

    function findSelectableLine(x, y) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const dist = distanceToLine(x, y, line.start, line.end);
            if (dist < 6 && !isNearPoint({
                    x,
                    y
                }, line.start) && !isNearPoint({
                    x,
                    y
                }, line.end)) {
                return i;
            }
        }
        return null;
    }

    // 캔버스를 그리기 위한 함수
    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 점 그리기
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x / scale, p.y / scale, 25, 0, Math.PI * 2); // 점 크기 4
            ctx.fillStyle = 'rgba(255, 255, 255, 0)'; // 흰색 반투명 점 색상
            ctx.fill();
        });

        // 선 그리기
        lines.forEach((line, i) => {
            ctx.beginPath();
            ctx.setLineDash(line.style === 'dotted' ? [5, 5] : []);
            ctx.strokeStyle = (i === selectedLineIndex) ? '#CC468E' : ''; // 선 색상 / 기본 검정, 선택 파랑
            ctx.lineWidth = 4; // 선 굵기
            ctx.moveTo(line.start.x / scale, line.start.y / scale);
            ctx.lineTo(line.end.x / scale, line.end.y / scale);
            ctx.stroke();
            ctx.setLineDash([]); // 점선 해제
        });

        // 현재 선택된 점 표시
        if (currentStart) {
            ctx.beginPath();
            ctx.arc(currentStart.x / scale, currentStart.y / scale, 20, 0, Math.PI * 2); // 선택한 점 크기 5
            ctx.fillStyle = ''; // 선택한 점 색상
            ctx.fill();
        }
    }
    // 클릭 이벤트 처리
    function handleInput(e) {
        e.preventDefault();
        const {
            x,
            y
        } = getInputPosition(e);
        const clickedPoint = points.find(p => isNearPoint(p, {
            x,
            y
        }));

        if (clickedPoint) {
            if (!currentStart) {
                // 첫 번째 점을 선택
                currentStart = clickedPoint;
                selectedLineIndex = null;
            } else {
                // 두 번째 점을 클릭하면 선을 추가하고, 시작점을 다음 점으로 이동
                lines.push({
                    start: currentStart,
                    end: clickedPoint,
                    style: 'solid'
                });
                selectedLineIndex = lines.length - 1;

                // 클릭된 점을 새로운 시작점으로 설정
                currentStart = clickedPoint;
            }
        }

        drawCanvas();
    }

    function resetCanvas() {
        lines.length = 0;
        selectedLineIndex = null;
        currentStart = null;
        drawCanvas();
    }

    // 리셋 버튼 이벤트
    document.querySelector(".btnReset").addEventListener("click", () => {
        document.querySelector(".solve_area").classList.remove("active");
        document.querySelector(".answer_img").classList.remove("on");
        document.querySelector("#gridCanvas").classList.remove("on");
        resetCanvas();
    });

    // 클릭 이벤트 추가
    canvas.addEventListener("click", handleInput);
    canvas.addEventListener("touchstart", handleInput, {
        passive: false
    });

    drawCanvas();

});

// 정답일 때
function onCorrectCustom() {
    $(".answer_img").addClass("on");
    $("#gridCanvas").addClass("on");

}


// 첫번째 틀렸을 때 - 해설숨김
function onIncorrectCustom() {
    $('.solve_area').removeClass('active');
}


// 빈값 - 해설 숨김
function onEmptyCustom() {
    $('.solve_area').removeClass('active');
}