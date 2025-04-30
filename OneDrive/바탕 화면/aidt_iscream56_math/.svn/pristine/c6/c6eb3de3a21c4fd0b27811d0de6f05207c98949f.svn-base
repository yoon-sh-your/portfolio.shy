/** 계산 순서 점 잇기 기능 실행 */
document.querySelectorAll(".drawing_area").forEach(drawingArea => {
    const svg = drawingArea.querySelector(".connection_lines");
    const dotCount = parseInt(drawingArea.dataset.dotCount) || 0;
    let selectedDots = [];
    let connectionCount = 1;
    const bendHeight = 30;
    const offsetY = 20;
    const lineWidth = 2;
    let availableDots = new Map(); // 점을 인덱스 기반으로 관리
    let existingBends = [];
    let labelCount = 1; // ✅ 라벨 번호를 순차적으로 부여하기 위한 변수
    let isInitialized = false; // ✅ 초기화 여부 확인

    function initializeDots() {
        if (isInitialized) return;
        for (let i = 1; i <= dotCount; i++) {
            createDot(i, drawingArea);
        }
        isInitialized = true;
    }
    
    function createDot(label, area, x = null, y = null, isGenerated = false, hideDot = false) {
        const dot = document.createElement("div");
        dot.classList.add("dot", `dot_${label}`);
        dot.dataset.index = label;
        dot.dataset.generated = isGenerated ? "true" : "false";
        if (hideDot) {
            dot.style.visibility = "hidden";
        }
        area.appendChild(dot);

        if (x !== null && y !== null) {
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
        }

        availableDots.set(label, dot);
        dot.addEventListener("click", () => handleDotClick(dot, area, svg));
    }

    function handleDotClick(dot, area, svg, isAuto = false) {
        const index = parseInt(dot.dataset.index);
        if (!availableDots.has(index)) return;
    
        // 자동 클릭 시 선택 해제 로직 무시
        if (!isAuto && selectedDots.includes(dot)) {
            dot.classList.remove("selected");
            selectedDots = selectedDots.filter(d => d !== dot);
            audioManager.playSound('click');
            return;
        }
    
        dot.classList.add("selected");
        selectedDots.push(dot);
    
        if (!isAuto) {
            audioManager.playSound('click');
        }
    
        if (selectedDots.length === 2) {
            createBentLine(selectedDots[0], selectedDots[1], area, svg);
            selectedDots.forEach(d => d.classList.remove("selected"));
            selectedDots = [];
        }
    }
    
    function connectTwoDots(dot1, dot2, area, svg) {
        if (!availableDots.has(parseInt(dot1.dataset.index)) || !availableDots.has(parseInt(dot2.dataset.index))) return;
    
        selectedDots = [dot1, dot2];
        createBentLine(dot1, dot2, area, svg);
        selectedDots = [];
    }
    

    function createBentLine(startDot, endDot, area, svg) {
        const startRect = startDot.getBoundingClientRect();
        const endRect = endDot.getBoundingClientRect();
        const areaRect = area.getBoundingClientRect();
    
        let x1 = (startRect.left + startRect.width / 2 - areaRect.left) / globalScale;
        let y1 = (startRect.top + startRect.height / 2 - areaRect.top) / globalScale;
        let x2 = (endRect.left + endRect.width / 2 - areaRect.left) / globalScale;
        let y2 = (endRect.top + endRect.height / 2 - areaRect.top) / globalScale;
    
        // ✅ 처음에 생성된 점을 `startDot`으로, 이동할 점을 `endDot`으로 보장
        if (startDot.dataset.generated === "true") {
            [startDot, endDot] = [endDot, startDot]; // 스왑
            [x1, x2] = [x2, x1];
            [y1, y2] = [y2, y1];
        }
    
        let startX = x1;
        let startY = y1;
        let endX = x2;
        let endY = y2;
    
        let lowerY = Math.max(startY, endY);
        let midX = (startX + endX) / 2;
        let midY = lowerY + bendHeight;
        const offsetX = 20; // 좌우 이동 거리
    
        let shouldAdjustX = false;
        // let targetDot = null;
        // let targetLabel = null;
        let targetX = null;
    
        // ✅ X좌표가 10px 오차 범위 내에서 같은 경우 실행
        if (Math.abs(startX - endX) <= 5) {
            // console.log("X축 충돌 감지! 꺾은선 적용");
            shouldAdjustX = true;
        }

        // ✅ 같은 X축에 위치한 점 중에서 **이동해야 할 점을 찾음**
        if (shouldAdjustX) {
            // let targetDrawingArea = startDot.closest(".drawing_area"); // ✅ 해당 점이 속한 태그 찾기

            const targetDot = selectedDots.find(dot => dot.dataset.generated === "true");

            if (targetDot) {
                let targetDrawingArea = targetDot.closest(".drawing_area");
                targetLabels = Array.from(targetDrawingArea.querySelectorAll(".connection_label"))
                    .filter(label => label.dataset.labelIndex === targetDot.dataset.index);
                    
                let moveX = (startX >= endX) ? offsetX : -offsetX;
                let newLeft = parseFloat(targetDot.style.left || "0") + moveX;
                targetDot.style.left = `${newLeft}px`;

                // ✅ 이동된 X 좌표를 `endX`에 반영
                const updatedRect = targetDot.getBoundingClientRect();
                targetX = (updatedRect.left + updatedRect.width / 2 - targetDrawingArea.getBoundingClientRect().left) / globalScale;
                endX = targetX;

                // console.log(`점 이동! X좌표 조정: ${startX} → ${targetX}`);

                // ✅ 해당 점(`targetDot`)과 연결된 라벨만 이동
                targetLabels.forEach(label => {
                    label.style.left = `${newLeft}px`;
                });

                // ✅ 새로운 midX 재계산
                midX = (startX + endX) / 2;
            }
        }

    
        // ✅ 기존보다 더 높은 midY를 유지하면서, 선을 더 꺾음
        let maxExistingY = lowerY;
        existingBends.forEach(bend => {
            if ((bend.startX >= Math.min(startX, endX) && bend.startX <= Math.max(startX, endX)) ||
                (bend.endX >= Math.min(startX, endX) && bend.endX <= Math.max(startX, endX))) {
                maxExistingY = Math.max(maxExistingY, bend.y);
            }
        });
    
        midY = maxExistingY + bendHeight;
        existingBends.push({ startX, endX, y: midY });
    
        // ✅ 이동된 점을 반영하여 **Y축을 먼저 이동한 후, X축으로 이동하는 선을 생성**
        const pathData = `
            M ${startX} ${startY} 
            V ${midY} 
            H ${midX} 
            H ${endX} 
            V ${endY}
        `;
    
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", "#000");
        path.setAttribute("stroke-width", lineWidth);
        path.setAttribute("fill", "none");
        path.classList.add("connection_line", `line_${connectionCount}`);
        svg.appendChild(path);
    
        let parent1 = parseInt(startDot.dataset.index);
        let parent2 = parseInt(endDot.dataset.index);
        let newLabel = parseInt([...new Set([...parent1.toString(), ...parent2.toString()])].sort((a, b) => a - b).join(''));
    
        availableDots.delete(parent1);
        availableDots.delete(parent2);
        
        const labelIndex = labelCount++

        // ✅ 이동된 점의 위치를 반영하여 새로운 점을 생성
        const connectionLabel = document.createElement("div");
        connectionLabel.classList.add("connection_label", `label_${labelIndex}`);
        connectionLabel.dataset.labelIndex = newLabel; // ✅ dataset.labelIndex 추가
        connectionLabel.textContent = connectionCount;
        connectionLabel.style.position = "absolute";
        connectionLabel.style.left = `${midX}px`;
        connectionLabel.style.top = `${midY + offsetY}px`;
        connectionLabel.style.transform = "translate(-50%, -50%)";
        area.appendChild(connectionLabel);
    
        if (availableDots.size === 0) {
            createDot(newLabel, area, midX, midY + offsetY * 2, true, true);
        } else {
            createDot(newLabel, area, midX, midY + offsetY * 2, true, false);
        }
    
        let userConnections = JSON.parse(svg.dataset.userConnections || "[]");
        userConnections.push([parent1, parent2].sort((a, b) => a - b));
        svg.dataset.userConnections = JSON.stringify(userConnections);
    
        // console.log(svg.dataset.userConnections);
        connectionCount++;
    }

    function resetDrawingArea() {
        console.log("Resetting drawing area");
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        drawingArea.querySelectorAll(".dot").forEach(dot => {
            if (dot.dataset.generated === "true") {
                dot.remove();
            }
        });

        drawingArea.querySelectorAll(".connection_label").forEach(label => label.remove());

        selectedDots = [];
        connectionCount = 1;
        availableDots.clear();
        existingBends = [];
        svg.dataset.userConnections = JSON.stringify([]);
        labelCount = 1;

        drawingArea.querySelectorAll(".dot").forEach(dot => {
            availableDots.set(parseInt(dot.dataset.index), dot);
            dot.removeEventListener("click", handleDotClick);
            dot.addEventListener("click", () => handleDotClick(dot, drawingArea, svg));
        });
    }

    document.addEventListener("pageChanged", () => {
        if (pagenation.activePage.contains(drawingArea)) {
            initializeDots();
        }
    });

    document.querySelectorAll(".btn_area .btnReset").forEach(resetButton => {
        resetButton.addEventListener("click", () => {
            if (pagenation.activePage.contains(drawingArea)) {
                resetDrawingArea();
                isInitialized = false;
                initializeDots();
            }
        });
    });

    document.addEventListener("globalFaultUpdated", (event) => {
        if (event.detail > 1 && pagenation.activePage.contains(drawingArea)) {
            resetDrawingArea();
            initializeDots();
    
            const connectionsData = JSON.parse(drawingArea.dataset.answerConnectline || "[]");
    
            (async () => {
                for (const [dotIndex1, dotIndex2] of connectionsData) {
                    const dot1 = drawingArea.querySelector(`.dot_${dotIndex1}`);
                    const dot2 = drawingArea.querySelector(`.dot_${dotIndex2}`);
                    if (dot1 && dot2) {
                        connectTwoDots(dot1, dot2, drawingArea, svg);
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                }
            })();
        }
    });
    

    initializeDots();
});

const connectLineWidth = 6;

// 드래그/클릭 판별용 상수
const DRAG_TIME_THRESHOLD = 150; // ms
const DRAG_DISTANCE_THRESHOLD = 5; // px

// 연결 초기화

document.querySelectorAll('.connect_wrap').forEach(wrap => {
  const svg = wrap.querySelector('.connect_lines');
  const points = wrap.querySelectorAll('.connect_point');
  const mode = wrap.dataset.mode || "single";
  const connections = new Map();

  let startDot = null;
  let tempLine = null;

  let pressStartTime = 0;
  let dragMoved = false;
  let startX = 0;
  let startY = 0;
  let clickSoundPlayed = false;
  let dragSoundPlayed = false;

  function getPointById(id) {
    return wrap.querySelector(`.connect_point[data-id="${id}"]`);
  }

  function updateConnectionData() {
    const connectionArray = Array.from(connections.entries()).map(([a, b]) => [a, b]);
    wrap.dataset.connections = JSON.stringify(connectionArray);
  }

  function drawLine(fromEl, toEl) {
    const rect1 = fromEl.getBoundingClientRect();
    const rect2 = toEl.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();

    const x1 = (rect1.left + rect1.width / 2 - wrapRect.left) / globalScale;
    const y1 = (rect1.top + rect1.height / 2 - wrapRect.top) / globalScale;
    const x2 = (rect2.left + rect2.width / 2 - wrapRect.left) / globalScale;
    const y2 = (rect2.top + rect2.height / 2 - wrapRect.top) / globalScale;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#000");
    line.setAttribute("stroke-width", connectLineWidth);
    line.setAttribute("stroke-linecap", "round");
    line.dataset.from = fromEl.dataset.id;
    line.dataset.to = toEl.dataset.id;
    svg.appendChild(line);
  }

  function removeLine(pointId) {
    svg.querySelectorAll(`line[data-from="${pointId}"], line[data-to="${pointId}"]`).forEach(line => {
      const from = line.dataset.from;
      const to = line.dataset.to;

      getPointById(from)?.classList.remove('connected');
      getPointById(to)?.classList.remove('connected');

      line.remove();
      connections.delete(from);
      for (const [k, v] of connections.entries()) {
        if (v === from || v === to) connections.delete(k);
      }
    });
    updateConnectionData();
  }

  function finalizeConnection(endDot) {
    if (!endDot || startDot === endDot) {
      startDot.classList.remove('selected');
      return false;
    }

    const sameGroup = (
      startDot.closest('.start_group') === endDot.closest('.start_group') ||
      startDot.closest('.end_group') === endDot.closest('.end_group')
    );

    if (sameGroup) {
      startDot.classList.remove('selected');
      return false;
    }

    if (mode === "single") {
      removeLine(startDot.dataset.id);
      removeLine(endDot.dataset.id);
    }

    drawLine(startDot, endDot);
    connections.set(startDot.dataset.id, endDot.dataset.id);
    updateConnectionData();

    startDot.classList.remove('selected');
    startDot.classList.add('connected');
    endDot.classList.add('connected');
    return true;
  }

  function endConnection(x, y) {
    if (!startDot || !tempLine) return false;

    svg.removeChild(tempLine);
    tempLine = null;

    const endDot = [...points].find(p => {
      const rect = p.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });

    startDot.classList.remove('dragging');
    const result = finalizeConnection(endDot);
    startDot = null;
    return result;
  }

  points.forEach(point => {
    point.addEventListener('mousedown', e => {
      pressStartTime = Date.now();
      clickSoundPlayed = false;
      dragSoundPlayed = false;
      dragMoved = false;
      startX = e.clientX;
      startY = e.clientY;

      startDot = point;
      if (mode === "single") removeLine(point.dataset.id);

      tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tempLine.setAttribute("stroke", "#aaa");
      tempLine.setAttribute("stroke-width", connectLineWidth);
      tempLine.setAttribute("stroke-linecap", "round");
      svg.appendChild(tempLine);

      startDot.classList.add('selected', 'dragging');
    });
  });

  document.addEventListener('mousemove', e => {
    if (!startDot || !tempLine) return;
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);

    if (!dragMoved && (dx > DRAG_DISTANCE_THRESHOLD || dy > DRAG_DISTANCE_THRESHOLD)) {
      dragMoved = true;
      if (!dragSoundPlayed) {
        audioManager.playSound("drag");
        dragSoundPlayed = true;
      }
    }

    const wrapRect = wrap.getBoundingClientRect();
    const x1 = (startX - wrapRect.left) / globalScale;
    const y1 = (startY - wrapRect.top) / globalScale;
    const x2 = (e.clientX - wrapRect.left) / globalScale;
    const y2 = (e.clientY - wrapRect.top) / globalScale;

    tempLine.setAttribute("x1", x1);
    tempLine.setAttribute("y1", y1);
    tempLine.setAttribute("x2", x2);
    tempLine.setAttribute("y2", y2);
  });

  document.addEventListener('mouseup', e => {
    const pressDuration = Date.now() - pressStartTime;
    const wasDrag = dragMoved || pressDuration > DRAG_TIME_THRESHOLD;
    const connected = endConnection(e.clientX, e.clientY);

    if (!wasDrag && !clickSoundPlayed) {
      audioManager.playSound("click");
      clickSoundPlayed = true;
    }

    if (wasDrag && connected) {
      audioManager.playSound("drop");
    }
  });
});

function drawAnswerConnections(connectWrap) {
    if (connectWrap.dataset.correction !== "false") return;
  
    const svg = connectWrap.querySelector("svg.connect_lines");
    const answerRaw = connectWrap.dataset.answerSingle;
    const userRaw = connectWrap.dataset.connections;
  
    if (!svg || !answerRaw) return;
  
    let answerPairs = [];
    let userPairs = [];
  
    try {
      answerPairs = JSON.parse(answerRaw).map(pair => pair.slice().sort());
      userPairs = JSON.parse(userRaw || "[]").map(pair => pair.slice().sort());
    } catch (e) {
      console.warn("❌ JSON 파싱 오류:", e);
      return;
    }
  
    const stringify = arr => JSON.stringify(arr.sort());
    const userKeySet = new Set(userPairs.map(pair => stringify(pair)));
    const answerKeySet = new Set(answerPairs.map(pair => stringify(pair)));
  
    // 기존에 이미 있는 선 쌍 추출
    const existingLines = new Set();
    svg.querySelectorAll("line").forEach(line => {
      const from = line.dataset.from;
      const to = line.dataset.to;
      const key = stringify([from, to]);
  
      if (answerKeySet.has(key)) {
        // 정답 선이면 그대로 두고 추적
        existingLines.add(key);
      } else {
        // 오답 선은 제거
        line.remove();
      }
    });
  
    // 아직 연결되지 않은 정답 선 추가 (빨간색)
    answerPairs.forEach(pair => {
      const key = stringify(pair);
      if (existingLines.has(key)) return; // 이미 그려진 정답 선이면 skip
  
      const [fromId, toId] = pair;
      const fromEl = connectWrap.querySelector(`.connect_point[data-id="${fromId}"]`);
      const toEl = connectWrap.querySelector(`.connect_point[data-id="${toId}"]`);
      if (!fromEl || !toEl) return;
  
      const rect1 = fromEl.getBoundingClientRect();
      const rect2 = toEl.getBoundingClientRect();
      const wrapRect = connectWrap.getBoundingClientRect();
  
      const x1 = (rect1.left + rect1.width / 2 - wrapRect.left) / globalScale;
      const y1 = (rect1.top + rect1.height / 2 - wrapRect.top) / globalScale;
      const x2 = (rect2.left + rect2.width / 2 - wrapRect.left) / globalScale;
      const y2 = (rect2.top + rect2.height / 2 - wrapRect.top) / globalScale;
  
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "red");
      line.setAttribute("stroke-width", connectLineWidth);
      line.setAttribute("stroke-linecap", "round");
    //   line.setAttribute("stroke-dasharray", "4");
      line.dataset.from = fromId;
      line.dataset.to = toId;
      svg.appendChild(line);
    });
  }