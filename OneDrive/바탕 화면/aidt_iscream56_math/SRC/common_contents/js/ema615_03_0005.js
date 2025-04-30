const colors = ["#CFE5B4", "#FFDFD3", "#F8CCAF", "#FFCDE6", "#FDD979"];

runAfterAppReady(function () {
    // 전역 저장소 생성
    if (!window.circleGraphs) {
        window.circleGraphs = new Map();
    }

    // CSS 스타일 추가

    // 모든 원형 그래프 초기화
    document.querySelectorAll('.circle-graph-division').forEach(graphDiv => {
        // new CircleGraph(graphDiv);
        const instance = new CircleGraph(graphDiv);
        window.circleGraphs.set(graphDiv, instance);
    });
    // console.log("werwer", window.circleGraphs);

    // 현재 그래프 인스턴스
    // const activePage = pagenation.activePage;
    const activeGraph = document.querySelector('.circle-graph-division');
    const graphInstance = window.circleGraphs.get(activeGraph);

    // 버튼 활성화 규칙 정의
    defineButtonClassRules([
        {
            selector: ".circle-graph-division",
            key: "check_target",
            test: (el) => {
                // correction 데이터 가져오기
                const correction = el.getAttribute('data-correction');
                // correction 속성이 없거나 빈 배열이면 false
                return !correction || correction === '[]' ? false : true;
            }
        }
    ]);

    window.resetCustom = function () {
        // 현재 활성화된 페이지의 원만 리셋
        const activePage = pagenation.activePage;
        if (activePage) {
            const activeGraph = activePage.querySelector('.circle-graph-division');
            if (activeGraph) {
                // 모든 선 제거
                const lines = activeGraph.querySelectorAll('.click-line');
                lines.forEach(line => line.remove());

                // 모든 점 제거
                const points = activeGraph.querySelectorAll('.click-point');
                points.forEach(point => point.remove());

                // 모든 텍스트 제거
                const texts = activeGraph.querySelectorAll('.percentage-text');
                texts.forEach(text => text.remove());

                // 부채꼴도 제거
                const arcs = activeGraph.getElementsByClassName('arc');
                while (arcs.length > 0) arcs[0].remove();

                // 초기 선과 점 생성
                const initialAngle = 270;
                const initialX = 250 + 200 * Math.cos(initialAngle * Math.PI / 180);
                const initialY = 250 + 200 * Math.sin(initialAngle * Math.PI / 180);

                // 초기 선 그리기
                const initialLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                initialLine.setAttribute("x1", "250");
                initialLine.setAttribute("y1", "250");
                initialLine.setAttribute("x2", initialX);
                initialLine.setAttribute("y2", initialY);
                initialLine.setAttribute("class", "click-line");
                activeGraph.querySelector('svg').appendChild(initialLine);

                // 초기 점 표시
                const initialPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                initialPoint.setAttribute("cx", initialX);
                initialPoint.setAttribute("cy", initialY);
                initialPoint.setAttribute("r", "6");
                initialPoint.setAttribute("class", "click-point");
                activeGraph.querySelector('svg').appendChild(initialPoint);

                // data-correction 속성 제거
                activeGraph.removeAttribute('data-correction');

                // data-connection 속성 초기화
                activeGraph.setAttribute('data-connection', JSON.stringify([]));

                // 인스턴스의 정보 제거
                graphInstance.reset();

                // 버튼 상태 업데이트
                window.forceWatchEvaluation();
            }
        }
    }

    window.getCustomTargets = function (page) {
        return $(page).find(".circle-graph-division");
    };
    let dataAnswers;
    // 커스텀 정답 조건
    window.customCheckCondition = function (el) {
        // data-correction 속성이 'true'이면 정답 처리
        console.log(el);
        const correction = el.getAttribute('data-correction');
        dataAnswers = el.getAttribute('data-single-answer');
        if (correction === 'true') {
            return true;
        }

        // data-correction 속성이 없거나 'false'이면 오답 처리
        return false;
    };

    // 두 번째 오답 시
    window.onIncorrectTwiceCustom = function () {
        graphInstance.reset();

        // 정답 선 그리기
        // console.log("werwer", dataAnswers);
        // dataAnswersParsed = JSON.parse(dataAnswers);
        dataAnswersParsed = [54, 144, 216, 252]
        dataAnswersParsed.forEach((value, index) => {
            graphInstance.forceClick(value);
        });
        // }
    };


    // 초기 40% 클릭 이벤트 발생
    // console.log("werwer graphInstance", graphInstance);
    graphInstance.forceClick(54);
    const arcs = graphInstance.svg.querySelectorAll('path.arc');
    if (arcs[0]) {
        arcs[0].setAttribute('fill', 'white');
    }
});

class CircleGraph {
    constructor(graphDiv) {
        this.graphDiv = graphDiv;
        this.svg = graphDiv.querySelector('#circleSvg');
        this.NS = "http://www.w3.org/2000/svg";

        // 기본 설정
        this.centerX = 250;
        this.centerY = 250;
        this.radius = 200;
        this.sections = 20;

        // 상태 관리
        this.state = {
            points: [],
            areas: []
        };

        this.init();
    }

    init() {
        // 초기 선 그리기 (270도)
        const initialAngle = 270;
        const initialX = this.centerX + this.radius * Math.cos(initialAngle * Math.PI / 180);
        const initialY = this.centerY + this.radius * Math.sin(initialAngle * Math.PI / 180);

        // 초기 선 그리기
        const initialLine = document.createElementNS(this.NS, "line");
        initialLine.setAttribute("x1", this.centerX);
        initialLine.setAttribute("y1", this.centerY);
        initialLine.setAttribute("x2", initialX);
        initialLine.setAttribute("y2", initialY);
        initialLine.setAttribute("class", "click-line");
        this.svg.appendChild(initialLine);

        // 초기 점 표시
        const initialPoint = document.createElementNS(this.NS, "circle");
        initialPoint.setAttribute("cx", initialX);
        initialPoint.setAttribute("cy", initialY);
        initialPoint.setAttribute("r", "6");
        initialPoint.setAttribute("class", "click-point");
        this.svg.appendChild(initialPoint);

        // 초기 영역 설정
        this.state.areas.push({
            start: initialAngle,
            end: initialAngle
        });

        // 초기 점 정보 저장
        this.state.points.push({
            angle: initialAngle,
            x: initialX,
            y: initialY
        });

        // 초기 영역 표시 업데이트
        this.updateAreaDisplay();

        // 초기 점들 생성
        this.createDiameterPoints();

        // 리셋 버튼 이벤트 - 버튼이 존재할 때만 이벤트 리스너 추가
        const resetButton = this.graphDiv.querySelector('.btnReset');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.reset());
        }
    }

    calculateAngle(x, y) {
        let angle = Math.atan2(y - this.centerY, x - this.centerY) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        return angle;
    }

    calculatePercentage(startAngle, endAngle) {
        let diff = endAngle - startAngle;
        if (diff < 0) diff += 360;
        return (diff / 360) * 100;
    }

    calculateTextPosition(startAngle, endAngle) {
        let midAngle = (startAngle + endAngle) / 2;
        if (endAngle < startAngle) {
            midAngle = (startAngle + endAngle + 360) / 2;
            if (midAngle >= 360) midAngle -= 360;
        }

        const labelDistance = this.radius * 0.7;
        const radian = midAngle * Math.PI / 180;
        return {
            x: this.centerX + labelDistance * Math.cos(radian),
            y: this.centerY + labelDistance * Math.sin(radian)
        };
    }

    updateAreaDisplay() {
        // 기존 퍼센테이지 텍스트 제거
        const texts = this.svg.getElementsByClassName('percentage-text');
        while (texts.length > 0) texts[0].remove();

        // 초기 상태(270도 점 하나만 남은 상태) 판별
        if (this.state.points.length === 1 && this.state.points[0].angle === 270) {
            // 초기 상태에서는 data-correction 속성 제거
            this.graphDiv.removeAttribute('data-correction');
            // 초기 상태에서는 data-connection을 빈 배열로 설정
            this.graphDiv.setAttribute('data-connection', JSON.stringify([]));
            // 버튼 상태 업데이트
            window.forceWatchEvaluation();
            return;
        }

        // 점들을 각도 기준으로 정렬 (270도부터 시계방향)
        const sortedPoints = [...this.state.points].sort((a, b) => {
            const normalizeAngle = (angle) => {
                let normalized = angle - 270;
                if (normalized < 0) normalized += 360;
                return normalized;
            };
            return normalizeAngle(a.angle) - normalizeAngle(b.angle);
        });

        const percentages = [];

        // 정렬된 점들을 순회하면서 영역 계산
        for (let i = 0; i < sortedPoints.length; i++) {
            const currentPoint = sortedPoints[i];
            const nextPoint = sortedPoints[(i + 1) % sortedPoints.length];

            // 현재 점과 다음 점 사이의 각도 차이 계산
            let angleDiff = nextPoint.angle - currentPoint.angle;
            if (angleDiff < 0) angleDiff += 360;

            // 퍼센테이지 계산
            const percentage = (angleDiff / 360) * 100;
            percentages.push(Math.round(percentage));

            // 중간 각도 계산
            const midAngle = (currentPoint.angle + nextPoint.angle) / 2;
            if (midAngle > 360) midAngle -= 360;

            // 텍스트 위치 계산
            const textPos = this.calculateTextPosition(currentPoint.angle, nextPoint.angle);

            // 텍스트 표시
            const text = document.createElementNS(this.NS, "text");
            text.setAttribute("x", textPos.x);
            text.setAttribute("y", textPos.y);
            text.setAttribute("class", "percentage-text");
            text.setAttribute("data-start-point", currentPoint.angle);
            text.setAttribute("data-end-point", nextPoint.angle);
            text.setAttribute("data-percentage", Math.round(percentage));
            text.textContent = Math.round(percentage) + " ％";
            this.svg.appendChild(text);
        }

        // connection 데이터 업데이트
        this.graphDiv.setAttribute('data-connection', JSON.stringify(percentages));

        // correction 데이터 체크
        const answerData = this.graphDiv.getAttribute('data-single-answer');

        console.log('현재 퍼센트:', percentages);
        console.log('정답 데이터:', answerData);

        if (answerData) {
            try {
                // data-single-answer 값을 JSON으로 파싱
                const answers = JSON.parse(answerData);

                console.log('파싱된 정답:', answers);

                // 배열 길이가 다르면 false
                if (percentages.length !== answers.length) {
                    console.log('배열 길이 불일치:', percentages.length, answers.length);
                    this.graphDiv.setAttribute('data-correction', 'false');
                    // 버튼 상태 업데이트
                    window.forceWatchEvaluation();
                    return;
                }

                // 각 요소를 비교
                // let isCorrect = true;
                // for (let i = 0; i < percentages.length; i++) {
                //     if (parseInt(percentages[i]) !== parseInt(answers[i])) {
                //         console.log('비교 실패:', percentages[i], answers[i]);
                //         isCorrect = false;
                //         break;
                //     }
                // }

                // 값만 비교하려면 두 배열을 정렬 후 비교
                const sortedPercentages = [...percentages].sort((a, b) => a - b);
                const sortedAnswers = [...answers].sort((a, b) => a - b);

                // 배열 값 비교
                let isCorrect = sortedPercentages.every((val, index) => parseInt(val) === parseInt(sortedAnswers[index]));

                console.log('정답 여부:', isCorrect);
                if (isCorrect) {
                    this.graphDiv.setAttribute('data-correction', 'true');
                } else {
                    this.graphDiv.setAttribute('data-correction', 'false');
                }
                // 버튼 상태 업데이트
                window.forceWatchEvaluation();
            } catch (e) {
                console.error('JSON 파싱 에러:', e);
                this.graphDiv.setAttribute('data-correction', 'false');
                // 버튼 상태 업데이트
                window.forceWatchEvaluation();
            }
        }
    }

    drawLine(x, y, angle) {
        // 이미 같은 각도에 선이 있는지 확인
        const existingLines = Array.from(this.svg.getElementsByClassName('click-line'));
        const existingPoints = Array.from(this.svg.getElementsByClassName('click-point'));

        for (let i = 0; i < existingLines.length; i++) {
            const line = existingLines[i];
            const point = existingPoints[i];
            const lineAngle = this.calculateAngle(
                parseFloat(line.getAttribute('x2')),
                parseFloat(line.getAttribute('y2'))
            );

            if (Math.abs(lineAngle - angle) < 1) {
                // 같은 각도의 선과 점을 제거
                this.svg.removeChild(line);
                this.svg.removeChild(point);

                // points 배열에서 해당 각도 제거
                this.state.points = this.state.points.filter(p => Math.abs(p.angle - angle) >= 1);

                // 모든 라벨 제거 후 새로운 라벨 생성
                this.updateAreaDisplay();
                return;
            }
        }

        // 선 그리기
        const line = document.createElementNS(this.NS, "line");
        line.setAttribute("x1", this.centerX);
        line.setAttribute("y1", this.centerY);
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
        line.setAttribute("class", "click-line");
        this.svg.appendChild(line);

        // 클릭한 원주 상의 점에만 파란점 표시
        const point = document.createElementNS(this.NS, "circle");
        point.setAttribute("cx", x);
        point.setAttribute("cy", y);
        point.setAttribute("r", "6");
        point.setAttribute("class", "click-point");
        this.svg.appendChild(point);

        // 점 정보 저장
        this.state.points.push({
            angle: angle,
            x: x,
            y: y
        });

        // 영역 표시 업데이트
        this.updateAreaDisplay();
    }

    drawAllSectors() {
        // 기존 arc 모두 제거
        this.svg.querySelectorAll('.arc').forEach(el => el.remove());

        const cx = this.centerX;
        const cy = this.centerY;
        const r = this.radius;

        let i;
        for (i = 1; i < this.state.points.length; i++) {
            const startAngle = this.state.points[i - 1].angle + 90;
            const endAngle = this.state.points[i].angle + 90;

            const d = describeSector(cx, cy, r, startAngle, endAngle);

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            path.setAttribute("fill", colors[i % colors.length]);
            path.classList.add("arc");

            const target = this.svg.querySelector('circle.circle');
            this.svg.insertBefore(path, target.nextSibling);
        }

        // 마지막 부채꼴 추가 (마지막 점과 첫 번째 점)
        if (this.state.points.length > 1) {
            const last = this.state.points[this.state.points.length - 1];
            const first = this.state.points[0];
            const startAngle = last.angle + 90;
            const endAngle = first.angle + 90;

            const d = describeSector(cx, cy, r, startAngle, endAngle);

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            // path.setAttribute("fill","#FFFFFF");
            path.setAttribute("fill", colors[(i) % colors.length]);
            path.classList.add("arc");

            const target = this.svg.querySelector('circle.circle');
            this.svg.insertBefore(path, target.nextSibling);
        }
    }

    createDiameterPoints() {
        for (let i = 0; i < this.sections; i++) {
            const angle = (i * 2 * Math.PI) / this.sections;
            const x = this.centerX + this.radius * Math.cos(angle);
            const y = this.centerY + this.radius * Math.sin(angle);

            // 클릭 영역용 큰 원
            const clickArea = document.createElementNS(this.NS, "circle");
            clickArea.setAttribute("cx", x);
            clickArea.setAttribute("cy", y);
            clickArea.setAttribute("r", "15");
            clickArea.setAttribute("class", "diameter-point-area");
            clickArea.setAttribute("data-angle", i * (360 / this.sections));
            clickArea.setAttribute("data-selected", "false");

            // 보이는 점
            const point = document.createElementNS(this.NS, "circle");
            point.setAttribute("cx", x);
            point.setAttribute("cy", y);
            point.setAttribute("r", "6");
            point.setAttribute("class", "diameter-point");
            point.setAttribute("data-angle", i * (360 / this.sections));
            point.setAttribute("data-selected", "false");

            // 초기 기준점(270도)은 선택 불가
            if (i * (360 / this.sections) === 270) {
                clickArea.setAttribute("data-selected", "true");
                point.setAttribute("data-selected", "true");
            }

            // 미리보기 선
            const previewLine = document.createElementNS(this.NS, "line");
            previewLine.setAttribute("x1", this.centerX);
            previewLine.setAttribute("y1", this.centerY);
            previewLine.setAttribute("x2", x);
            previewLine.setAttribute("y2", y);
            previewLine.setAttribute("class", "preview-line");
            previewLine.style.display = "none";
            this.svg.appendChild(previewLine);

            // 클릭 이벤트를 클릭 영역에 추가
            const handleClick = (e) => {
                e.stopPropagation();
                const currentAngle = parseFloat(clickArea.getAttribute('data-angle'));
                const isSelected = clickArea.getAttribute('data-selected') === 'true';

                if (isSelected) {
                    // 이미 선택된 점은 취소
                    const clickX = this.centerX + this.radius * Math.cos(currentAngle * Math.PI / 180);
                    const clickY = this.centerY + this.radius * Math.sin(currentAngle * Math.PI / 180);
                    this.drawLine(clickX, clickY, currentAngle);
                    clickArea.setAttribute("data-selected", "false");
                    point.setAttribute("data-selected", "false");
                } else {
                    // 새로운 점 선택
                    const clickX = this.centerX + this.radius * Math.cos(currentAngle * Math.PI / 180);
                    const clickY = this.centerY + this.radius * Math.sin(currentAngle * Math.PI / 180);
                    this.drawLine(clickX, clickY, currentAngle);
                    clickArea.setAttribute("data-selected", "true");
                    point.setAttribute("data-selected", "true");

                    // 디버깅 - 정보 출력
                    // console.log("werwer", this);
                    // console.log("werwer", this.state.points[this.state.points.length - 1].angle)
                }

                // 색 채운 부채꼴 만들기
                this.drawAllSectors();
            };

            // 마우스 오버 이벤트
            const handleMouseOver = (e) => {
                e.stopPropagation();
                const isSelected = clickArea.getAttribute('data-selected') === 'true';
                if (!isSelected) {
                    previewLine.style.display = "block";
                }
            };

            // 마우스 아웃 이벤트
            const handleMouseOut = (e) => {
                e.stopPropagation();
                previewLine.style.display = "none";
            };

            clickArea.addEventListener('click', handleClick);
            clickArea.addEventListener('mouseover', handleMouseOver);
            clickArea.addEventListener('mouseout', handleMouseOut);

            point.addEventListener('click', handleClick);
            point.addEventListener('mouseover', handleMouseOver);
            point.addEventListener('mouseout', handleMouseOut);

            this.svg.appendChild(clickArea);
            this.svg.appendChild(point);
        }
    }

    // 클릭 이벤트 발생 시키기
    forceClick(dataAngle) {
        // 클릭 이벤트 발생시켜 선 추가
        const clickPoint = document.querySelector(`circle[data-angle="${dataAngle}"]`);

        if (clickPoint) {
            // 'click' 이벤트를 강제로 발생시킴
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            clickPoint.dispatchEvent(clickEvent);
        } else {
            console.warn(`circle[data-angle="${dataAngle}"]를 찾을 수 없습니다.`);
        }
    }

    reset() {
        // 모든 선, 점, 텍스트 제거
        const lines = this.svg.getElementsByClassName('click-line');
        const points = this.svg.getElementsByClassName('click-point');
        const texts = this.svg.getElementsByClassName('percentage-text');
        // 부채꼴도 제거
        const arcs = this.svg.getElementsByClassName('arc');

        while (lines.length > 0) lines[0].remove();
        while (points.length > 0) points[0].remove();
        while (texts.length > 0) texts[0].remove();
        while (arcs.length > 0) arcs[0].remove();

        // 상태 초기화
        this.state.points = [];
        this.state.areas = [];

        // 초기 선과 점 다시 생성
        const initialAngle = 270;
        const initialX = this.centerX + this.radius * Math.cos(initialAngle * Math.PI / 180);
        const initialY = this.centerY + this.radius * Math.sin(initialAngle * Math.PI / 180);

        // 초기 선 그리기
        const initialLine = document.createElementNS(this.NS, "line");
        initialLine.setAttribute("x1", this.centerX);
        initialLine.setAttribute("y1", this.centerY);
        initialLine.setAttribute("x2", initialX);
        initialLine.setAttribute("y2", initialY);
        initialLine.setAttribute("class", "click-line");
        this.svg.appendChild(initialLine);

        // 초기 점 표시
        const initialPoint = document.createElementNS(this.NS, "circle");
        initialPoint.setAttribute("cx", initialX);
        initialPoint.setAttribute("cy", initialY);
        initialPoint.setAttribute("r", "6");
        initialPoint.setAttribute("class", "click-point");
        this.svg.appendChild(initialPoint);

        // 초기 점 정보 저장
        this.state.points.push({
            angle: initialAngle,
            x: initialX,
            y: initialY
        });

        // 초기 영역 설정
        this.state.areas.push({
            start: initialAngle,
            end: initialAngle
        });

        // data-selected=true 제거
        const selectedElements = this.svg.querySelectorAll('[data-selected="true"]');
        selectedElements.forEach(el => {
            el.setAttribute('data-selected', 'false');
        });

        // data-correction 속성 제거
        this.graphDiv.removeAttribute('data-correction');

        // 영역 표시 업데이트
        this.updateAreaDisplay();
    }
}



// 부채꼴 만들기 
function normalizeAngle(angle) {
    return (angle + 360) % 360;
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy + r * Math.sin(angleInRadians)
    };
}

function describeSector(cx, cy, r, startAngle, endAngle) {
    startAngle = normalizeAngle(startAngle);
    endAngle = normalizeAngle(endAngle);

    let deltaAngle = endAngle - startAngle;
    if (deltaAngle < 0) deltaAngle += 360;

    const largeArcFlag = deltaAngle > 180 ? "1" : "0";
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);

    return [
        `M ${cx} ${cy}`,
        `L ${start.x} ${start.y}`,
        `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
        "Z"
    ].join(" ");
}