runAfterAppReady(function () {
    // 전역 저장소 생성
    if (!window.barGraphs) {
        window.barGraphs = new Map();
    }

    // 모든 바 그래프 초기화
    document.querySelectorAll('.bar-graph-division').forEach(graphDiv => {
        // new barGraphs(graphDiv);
        console.log(".bar-graph-division", document.querySelectorAll('.bar-graph-division'))
        console.log("graphDiv", graphDiv);
        const barSvg = graphDiv.querySelector('#barSvg');
        console.log("barSvg", barSvg);
        const barRect = barSvg.querySelector('rect.bar');
        console.log("barRect", barRect);
        // const barWidth = barRect.getAttribute('width');
        // const barHeight = barRect.getAttribute('height');
        // const barStartX = barRect.getAttribute('x');
        // const barStartY = barRect.getAttribute('y');
        const instance = new barGraphs(graphDiv);
        window.barGraphs.set(graphDiv, instance);
    });
    console.log("window.barGraphs", window.barGraphs);

    // 현재 그래프 인스턴스
    const activePage = pagenation.activePage;
    const activeGraph = activePage.querySelector('.bar-graph-division');
    const graphInstance = window.barGraphs.get(activeGraph);

    // 버튼 활성화 규칙 정의
    defineButtonClassRules([
        {
            selector: ".bar-graph-division",
            test: (el) => {
                // correction 데이터 가져오기
                const correction = el.getAttribute('data-correction');
                // correction 속성이 없거나 빈 배열이면 false
                return !correction || correction === '[]' ? false : true;
            },
            setClass: [
                { target: ".btnReset", class: "active" },
                { target: ".btnCheck", class: "active" }
            ]
        }
    ]);

    window.resetCustom = function () {
        // 현재 활성화된 페이지의 바만 리셋
        const activePage = pagenation.activePage;
        if (activePage) {
            const activeGraph = activePage.querySelector('.bar-graph-division');
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
        return $(page).find(".bar-graph-division");
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
        alert("🚨 정답 공개됩니다!");

        graphInstance.reset();

        // 정답 선 그리기
        // console.log("werwer", dataAnswers);
        // dataAnswersParsed = JSON.parse(dataAnswers);

        dataAnswersParsed = [40, 65, 85, 95];
        dataAnswersParsed.forEach((value, index) => {
            graphInstance.forceClick(value);
        });
        // }
    };


    // // 초기 40% 클릭 이벤트 발생
    // console.log("werwer graphInstance", graphInstance);
    // graphInstance.forceClick(40);
    // const rect = graphInstance.svg.querySelectorAll('rect.percentage-bg');
    // if (rect[0]) {
    //     rect[0].setAttribute('fill', 'white');
    // }
});

class barGraphs {
    constructor(graphDiv, basePercent = 1, width = 1232, height = 95, barHeight = 75) {
        this.graphDiv = graphDiv;
        this.svg = graphDiv.querySelector('#barSvg');
        this.NS = "http://www.w3.org/2000/svg";

        // 기본 설정
        this.svgHeight = Number(this.svg.getAttribute('height'));
        this.svgWidth = Number(this.svg.getAttribute('width'));

        this.barRect = this.svg.querySelector('rect.bar'); // 혹시 안 했다면
        if (!this.barRect) {
            console.error('❌ rect.bar not found!');
            return;
          }
        this.barWidth = Number(this.barRect.getAttribute('width'));
        this.barHeight = Number(this.barRect.getAttribute('height'));
        this.barStartX = Number(this.barRect.getAttribute('x'));
        this.barStartY = Number(this.barRect.getAttribute('y'));

        const container = document.querySelector('.bar-graph-division');
        this.basePercent = Number(container.dataset.basePercent); // 20
        // this.basePercent = basePercent;

        this.updateSections(); // 섹션 수, px 계산 자동 반영


        // 기본 설정 값 로그
        console.log("this.svgHeight", this.svgHeight);
        console.log("this.svgWidth", this.svgWidth);
        console.log("this.barWidth", this.barWidth);
        console.log("this.barHeight", this.barHeight);
        console.log("this.barStartX", this.barStartX);
        console.log("this.barStartY", this.barStartY);
        console.log("this.basePercent", this.basePercent);

        // 상태 관리
        this.state = {
            points: [],
            lines: [],
            areas: []
        };

        this.init();
    }

    init() {
        // 초기 점들 생성
        this.createDiameterPoints();

        // 리셋 버튼 이벤트 - 버튼이 존재할 때만 이벤트 리스너 추가
        const resetButton = this.graphDiv.querySelector('.btnReset');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.reset());
        }
    }

    updateSections() {
        this.sections = 100 / this.basePercent; // 섹션 수 계산
        this[`pxPercent${this.basePercent}`] = (this.barWidth * this.basePercent) / 100;
    }

    // basePercent만 바꿨을 때
    setBasePercent(basePercent) {
        this.basePercent = basePercent;
        this.updateSections();
    }

    // width가 바뀌었을 때
    setWidth(barWidth) {
        this.barWidth = barWidth;
        this.updateSections();
    }

    // 퍼센트를 px로 변환
    setPercentPx(percent) {
        return (this.barWidth * percent) / 100;
    }

    // px를 퍼센트로 변환
    getPercentFromPx(px) {
        return (px * 100) / this.barWidth;
    }

    // calculateTextPosition(startPoint, endPoint) {
    //     let midPoint = (startPoint + endPoint) / 2;
    //     if (endPoint < startPoint) {
    //         midPoint = (startPoint + endPoint + 360) / 2;
    //         if (midPoint >= 360) midPoint -= 360;
    //     }

    //     return {
    //         x: midPoint,
    //         y: this.barHeight / 2
    //     };
    // }

    updateAreaDisplay() {
        // 기존 퍼센테이지 텍스트 및 배경 제거
        const texts = this.svg.getElementsByClassName('percentage-text');
        while (texts.length > 0) texts[0].remove();

        const rects = this.svg.getElementsByClassName('percentage-bg');
        while (rects.length > 0) rects[0].remove();

        // // 초기 상태(40% 점 하나만 남은 상태) 판별
        // if (this.state.points.length === 1 && this.state.points[0].x1 === 368) {
        //     // 초기 상태에서는 data-correction 속성 제거
        //     this.graphDiv.removeAttribute('data-correction');
        //     // 초기 상태에서는 data-connection을 빈 배열로 설정
        //     this.graphDiv.setAttribute('data-connection', JSON.stringify([]));
        //     // 버튼 상태 업데이트
        //     window.forceWatchEvaluation();
        //     return;
        // }

        console.log("this.state.lines", this.state.lines);

        // 라인의 값 정렬
        const sortedLines = this.state.lines.sort((a, b) => a.x1 - b.x1);

        console.log("sortedLines", sortedLines);

        const percentages = [];

        let i;
        // 정렬된 점들을 순회하면서 영역 계산
        for (i = 0; i < sortedLines.length; i++) {

            const prev = sortedLines[i - 1];
            const x0 = prev ? prev.x1 : 0;
            const x1 = sortedLines[i].x1;
            const xMid = (x0 + x1) / 2;
            const yMid = (this.barHeight / 2) + (this.barStartY);
            // const percent = this.getPercentFromPx(x1 - x0);
            const percent = Math.round(this.getPercentFromPx(x1 - x0) * 100) / 100;

            // percentages에 추가
            percentages.push(percent);

            // // 배경색(사각형) 추가
            // const rect = document.createElementNS(this.NS, "rect");
            // rect.setAttribute("x", x0);
            // rect.setAttribute("y", 0);
            // rect.setAttribute("width", x1 - x0);
            // rect.setAttribute("height", this.barHeight);
            // rect.setAttribute("class", "percentage-bg");
            // rect.setAttribute("fill", colors[i % colors.length]);
            // const target = this.svg.querySelector('rect.bar');
            // this.svg.insertBefore(rect, target.nextSibling);

            // 텍스트 표시
            const text = document.createElementNS(this.NS, "text");
            text.setAttribute("x", xMid);
            text.setAttribute("y", yMid);
            text.setAttribute("class", "percentage-text");
            // text.setAttribute("data-start-point", currentPoint.angle);
            // text.setAttribute("data-end-point", nextPoint.angle);
            // text.setAttribute("data-percentage", Math.round(percentage));
            text.setAttribute("data-percentage", sortedLines[i].percent);
            text.textContent = percent + " ％";
            this.svg.appendChild(text);
        }

        // 마지막 라인 이후의 영역
        const lastLine = sortedLines[sortedLines.length - 1];
        if (lastLine) {
            const x0 = lastLine.x1;
            const x1 = this.barWidth;
            const xMid = (x0 + x1) / 2;
            const yMid = (this.barHeight / 2) + (this.barStartY);

            // const lastPercent = this.getPercentFromPx(x1 - x0);
            const lastPercent = Math.round(this.getPercentFromPx(x1 - x0) * 100) / 100;

            // percentages에 마지막 영역 퍼센트 추가
            percentages.push(lastPercent);

            // const rect = document.createElementNS(this.NS, "rect");
            // rect.setAttribute("x", x0);
            // rect.setAttribute("y", 0);
            // rect.setAttribute("width", x1 - x0);
            // rect.setAttribute("height", this.barHeight);
            // rect.setAttribute("class", "percentage-bg");
            // rect.setAttribute("fill", colors[(i) % colors.length]);
            // const target = this.svg.querySelector('rect.bar');
            // this.svg.insertBefore(rect, target.nextSibling);

            const text = document.createElementNS(this.NS, "text");
            text.setAttribute("x", xMid);
            text.setAttribute("y", yMid);
            text.setAttribute("class", "percentage-text");
            text.setAttribute("data-percentage", lastPercent);
            text.textContent = lastPercent + " ％";
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

    createDiameterPoints() {
        this.drawScaleMarks(); // 눈금 그리기
        this.drawScaleLabels(); // 눈금 레이블 그리기

        this.selectedPoints = [];
        for (let i = 0; i < this.sections; i++) {
            // const percent = this.basePercent * i;
            // const PercentPx = this.setPercentPx(this.basePercent) * i;
            // const x = PercentPx;
            const percent = i;
            const x = (this.barWidth * percent) / 100;
            const yTop = this.barStartY + 5;
            const yBottom = this.barStartY + this.barHeight - 5;

            // 미리보기 선
            const previewLine = document.createElementNS(this.NS, "line");
            previewLine.setAttribute("x1", x);
            previewLine.setAttribute("y1", yTop);
            previewLine.setAttribute("x2", x);
            previewLine.setAttribute("y2", yBottom);
            previewLine.setAttribute("class", "preview-line");
            previewLine.style.display = "none";
            this.svg.appendChild(previewLine);

            const arr = [[x, yTop], [x, yBottom]];

            arr.forEach((value, index) => {
                const x = value[0];
                const y = value[1];

                // 클릭 영역용 큰 원 1
                const clickArea = document.createElementNS(this.NS, "circle");
                clickArea.setAttribute("cx", x);
                clickArea.setAttribute("cy", y);
                clickArea.setAttribute("r", "8");
                clickArea.setAttribute("class", "diameter-point-area");
                clickArea.setAttribute("data-percent", percent);
                clickArea.setAttribute("data-selected", "false");

                // 보이는 점 1
                const point = document.createElementNS(this.NS, "circle");
                point.setAttribute("cx", x);
                point.setAttribute("cy", y);
                point.setAttribute("r", "6");
                point.setAttribute("class", "diameter-point");
                point.setAttribute("data-selected", "false");

                // 클릭 이벤트를 클릭 영역에 추가
                const handleClick = (e) => {
                    e.stopPropagation();

                    // 1. (= 배열의 길이가 2가 아닐 때)
                    // 1-1. 점이 활성화 상태일 때
                    if (clickArea.getAttribute("data-selected") === 'true') {
                        console.log('활성화된 점이 클릭됨');
                        // 비활성화
                        clickArea.setAttribute("data-selected", "false");
                        point.setAttribute("data-selected", "false");
                        // 점 함수
                        this.drawPoint(x, y, percent, false);
                    } else {
                        console.log('비활성화된 점이 클릭됨', clickArea);
                        // 1-2. 활성화 상태가 아닐 때
                        // 활성화
                        clickArea.setAttribute("data-selected", "true");
                        point.setAttribute("data-selected", "true");
                        // 배열에 점 추가
                        this.selectedPoints.push({ x: x, y: y, percent: percent });
                        // 점 함수
                        this.drawPoint(x, y, percent, false);

                        // 2. 배열의 길이가 2가 됐을 때
                        if (this.selectedPoints.length === 2) {
                            console.log("배열 길이 2", this.selectedPoints)
                            if (this.selectedPoints[0].x !== this.selectedPoints[1].x) {
                                // 2-1. X가 다를 때
                                console.log("X가 다를 때", this.selectedPoints[0].x, this.selectedPoints[1].x)
                                // 두 점 비활성화
                                this.svg.querySelector('.diameter-point-area[cx="' + this.selectedPoints[0].x + '"][cy="' + this.selectedPoints[0].y + '"]').setAttribute('data-selected', 'false');
                                this.svg.querySelector('.diameter-point[cx="' + this.selectedPoints[0].x + '"][cy="' + this.selectedPoints[0].y + '"]').setAttribute('data-selected', 'false');
                                this.svg.querySelector('.diameter-point-area[cx="' + this.selectedPoints[1].x + '"][cy="' + this.selectedPoints[1].y + '"]').setAttribute('data-selected', 'false');
                                this.svg.querySelector('.diameter-point[cx="' + this.selectedPoints[1].x + '"][cy="' + this.selectedPoints[1].y + '"]').setAttribute('data-selected', 'false');
                                // 두 점 지우기 함수
                                this.remove2point(this.selectedPoints);
                                // 배열 비우기
                                this.selectedPoints = [];
                            } else {
                                // 2-2. X가 같아 일직선이 될 때
                                console.log('X가 같아 일직선이 될 때')
                                // 라인 함수
                                // 라인 그리기
                                this.drawLine();
                                // 배열 비우기
                                this.selectedPoints = [];
                            }
                        }
                    }
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
            });
        }
    }

    remove2point(twoPoint) {
        // 두 점 지우기
        // 존재하는 라인과 점들
        const existingPoints = Array.from(this.svg.getElementsByClassName('click-point'));
        // 두 점 삭제
        for (const point of twoPoint) {
            for (let i = 0; i < existingPoints.length; i++) {
                const exPoint = existingPoints[i];

                // 존재하는 점의 x값
                const exCX = parseFloat(exPoint.getAttribute('cx'));
                const exCY = parseFloat(exPoint.getAttribute('cy'));

                if (exCX === point.x && exCY === point.y) {
                    // 점 삭제
                    this.svg.removeChild(exPoint);
                    // 두 점 비활성화 - 이미 처리
                    // 상태에서도 두 점 필터링해서 없애기
                    this.state.points = this.state.points.filter(
                        p => !(p.x === point.x && p.y === point.y)
                    );
                }
            }
        }
    }

    drawLine() {
        // 선 그리기
        const line = document.createElementNS(this.NS, "line");
        line.setAttribute("x1", this.selectedPoints[0].x);
        line.setAttribute("y1", this.selectedPoints[0].y);
        line.setAttribute("x2", this.selectedPoints[1].x);
        line.setAttribute("y2", this.selectedPoints[1].y);
        line.setAttribute("class", "click-line");
        // line.setAttribute("data-percent", percent);
        this.svg.appendChild(line);

        // 라인 정보 저장
        this.state.lines.push({
            percent: this.selectedPoints[0].percent,
            x1: this.selectedPoints[0].x,
            y1: this.selectedPoints[0].y,
            x2: this.selectedPoints[1].x,
            y2: this.selectedPoints[1].y
        });

        // 영역 표시 업데이트
        this.updateAreaDisplay();
    }

    drawPoint(x, y, percent) {
        // 존재하는 라인과 점들
        const existingLines = Array.from(this.svg.getElementsByClassName('click-line'));
        const existingPoints = Array.from(this.svg.getElementsByClassName('click-point'));
        console.log("existingLines", existingLines);
        console.log("existingPoints", existingPoints);

        for (let i = 0; i < existingPoints.length; i++) {
            const exLine = existingLines[i];
            const exPoint = existingPoints[i];

            // 존재하는 점의 x값
            const exCX = parseFloat(exPoint.getAttribute('cx'));
            const exCY = parseFloat(exPoint.getAttribute('cy'));

            // 점 지우기
            if (exCX === x && exCY === y) {
                console.log('지우기 해당 점', exPoint);
                console.log("지우기 전 points:", this.state.points);
                // console.log("지우기 전 lines:", this.state.lines);
                this.svg.removeChild(exPoint);
                // exPoint.setAttribute("data-selected", "false");

                // 상태에서도 삭제
                this.state.points = this.state.points.filter(
                    p => !(p.x === x && p.y === y)
                );

                console.log("지운 후 남은 points:", this.state.points);
                // console.log("지운 후 남은 lines:", this.state.lines);

                // 라인 중에 연결된 라인 있는지 찾기
                for (const line of existingLines) {
                    const x1 = parseFloat(line.getAttribute('x1'));
                    const y1 = parseFloat(line.getAttribute('y1'));
                    const x2 = parseFloat(line.getAttribute('x2'));
                    const y2 = parseFloat(line.getAttribute('y2'));

                    if ((x1 === exCX && y1 === exCY) || (x2 === exCX && y2 === exCY)) {
                        // 라인 삭제
                        this.svg.removeChild(line);

                        // 상태에서도 라인 삭제
                        this.state.lines = this.state.lines.filter(
                            l => !(l.x1 === x1 && l.y1 === y1 && l.x2 === x2 && l.y2 === y2)
                        );

                        // 연결된 다른 점의 좌표
                        const otherX = (x1 === exCX && y1 === exCY) ? x2 : x1;
                        const otherY = (x1 === exCX && y1 === exCY) ? y2 : y1;

                        // SVG에서 다른 점 삭제
                        for (const pt of existingPoints) {
                            const cx = parseFloat(pt.getAttribute('cx'));
                            const cy = parseFloat(pt.getAttribute('cy'));
                            if (cx === otherX && cy === otherY) {
                                this.svg.removeChild(pt);
                                break;
                            }
                        }

                        // 상태에서도 다른 점 삭제
                        this.state.points = this.state.points.filter(
                            p => !(p.x === otherX && p.y === otherY)
                        );

                        // 처리
                        this.svg.querySelector('.diameter-point-area[cx="' + otherX + '"][cy="' + otherY + '"]').setAttribute('data-selected', 'false');
                        this.svg.querySelector('.diameter-point[cx="' + otherX + '"][cy="' + otherY + '"]').setAttribute('data-selected', 'false');

                        // 영역 표시 업데이트
                        this.updateAreaDisplay();

                        break; // 한 라인만 지우면 되므로 
                    }
                }
                return;
            }
        }

        // 클릭한 원주 상의 점에만 파란점 표시
        const point = document.createElementNS(this.NS, "circle");
        point.setAttribute("cx", x);
        point.setAttribute("cy", y);
        point.setAttribute("r", "6");
        point.setAttribute("class", "click-point");
        // point.setAttribute("data-percent", percent);
        this.svg.appendChild(point);

        // 점 정보 저장
        this.state.points.push({
            // angle: angle,
            percent: percent,
            x: x,
            y: y,
        });

        // console.log("--drawLine ended --")
    }

    // 클릭 이벤트 발생 시키기
    forceClick(dataPercent) {
        // 클릭 이벤트 발생시켜 선 추가
        const clickPoints = document.querySelectorAll(`circle[data-percent="${dataPercent}"]`);
        // console.log("clickPoints", clickPoints);
        if (clickPoints) {
            clickPoints.forEach((value) => {
                // 'click' 이벤트를 강제로 발생시킴
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                value.dispatchEvent(clickEvent);
            });
        } else {
            console.warn(`circle[data-percent="${dataPercent}"]를 찾을 수 없습니다.`);
        }
    }

    reset() {
        // 모든 선, 점, 텍스트 제거
        const lines = this.svg.getElementsByClassName('click-line');
        const points = this.svg.getElementsByClassName('click-point');
        const texts = this.svg.getElementsByClassName('percentage-text');
        // 색칠된 사각형도 제거
        // const arcs = this.svg.getElementsByClassName('arc');

        while (lines.length > 0) lines[0].remove();
        while (points.length > 0) points[0].remove();
        while (texts.length > 0) texts[0].remove();
        // while (arcs.length > 0) arcs[0].remove();

        // 상태 초기화
        this.state.lines = [];
        this.state.points = [];
        this.state.areas = [];

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

    // 눈금 함수
    drawScaleMarks() {
        const height1 = 8;   // 1% 눈금
        const height5 = 13;  // 5% 눈금
        const height10 = 18; // 10% 눈금

        const barTop = this.barStartY; // 바 그래프의 시작 y좌표

        for (let i = 0; i <= 100; i++) {
            const percent = i;
            const x = (this.barWidth * percent) / 100;

            let lineHeight = height1;
            if (percent % 10 === 0) {
                lineHeight = height10;
            } else if (percent % 5 === 0) {
                lineHeight = height5;
            }

            const y1 = barTop - lineHeight;
            const y2 = barTop;

            const scaleLine = document.createElementNS(this.NS, "line");
            scaleLine.setAttribute("x1", x);
            scaleLine.setAttribute("y1", y1);
            scaleLine.setAttribute("x2", x);
            scaleLine.setAttribute("y2", y2);
            scaleLine.setAttribute("class", "scale-line");

            this.svg.appendChild(scaleLine);
        }
    }

    drawScaleLabels() {
        const barTop = this.barStartY;
        const labelOffset = 22; // 눈금에서 위로 얼마나 떨어질지 (px)
        const fontSize = 12;

        for (let i = 0; i <= 100; i += 10) {
            const x = (this.barWidth * i) / 100;
            const y = barTop - labelOffset;

            const label = document.createElementNS(this.NS, "text");
            label.setAttribute("x", x);
            label.setAttribute("y", y);
            label.setAttribute("text-anchor", "middle"); // 가운데 정렬
            label.setAttribute("font-size", fontSize);
            label.setAttribute("class", "scale-label");
            label.textContent = i;

            this.svg.appendChild(label);
        }
    }
}