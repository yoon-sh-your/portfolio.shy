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

  // 취소 버튼 생성 및 추가
  function createCancelButton() {
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "선택 취소";
    cancelButton.classList.add("btn_cancel");
    cancelButton.style.display = "none"; // 초기에는 숨김
    drawingArea.appendChild(cancelButton);

    cancelButton.addEventListener("click", () => {
      selectedDots.forEach(dot => {
        dot.classList.remove("selected");
      });
      selectedDots = [];
      cancelButton.style.display = "none";
      audioManager.playSound('click');
    });

    return cancelButton;
  }

  const cancelButton = createCancelButton();

  function initializeDots() {
    if (isInitialized) return;

    for (let i = 1; i <= dotCount; i++) {
      createDot(i, drawingArea);
    }

    // ✅ 여기에 아래 두 줄 꼭 추가
    drawingArea.__resetDrawingArea__ = resetDrawingArea;
    drawingArea.__initializeDots__ = initializeDots;

    isInitialized = true;
  }


  function createDot(label, area, x = null, y = null, isGenerated = false, hideDot = false, parent1 = null, parent2 = null) {
    const dot = document.createElement("div");
    dot.classList.add("dot", `dot_${label}`);
    dot.dataset.index = label;
    dot.dataset.generated = isGenerated ? "true" : "false";
    if (isGenerated) {
        // 부모 점 인덱스 저장
        if (parent1 !== null) dot.dataset.parent1 = parent1;
        if (parent2 !== null) dot.dataset.parent2 = parent2;
    }
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
      cancelButton.style.display = "none";
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
    let targetX = null;

    // ✅ X좌표가 10px 오차 범위 내에서 같은 경우 실행
    if (Math.abs(startX - endX) <= 5) {
      shouldAdjustX = true;
    }

    // ✅ 같은 X축에 위치한 점 중에서 **이동해야 할 점을 찾음**
    if (shouldAdjustX) {
      // selectedDots는 클릭 컨텍스트에서만 유효하므로 여기서는 직접 사용 불가.
      // 대신 endDot이 생성된 점인지 확인해야 함.
      const targetDot = (endDot.dataset.generated === "true") ? endDot : null;
      // const targetDot = selectedDots.find(dot => dot.dataset.generated === "true"); // 이 방식은 클릭 시에만 유효

      if (targetDot) {
        let targetDrawingArea = targetDot.closest(".drawing_area");
        const targetLabels = Array.from(targetDrawingArea.querySelectorAll(".connection_label"))
          .filter(label => label.dataset.labelIndex === targetDot.dataset.index);

        let moveX = (startX >= endX) ? offsetX : -offsetX;
        let newLeft = parseFloat(targetDot.style.left || "0") + moveX;
        targetDot.style.left = `${newLeft}px`;

        const updatedRect = targetDot.getBoundingClientRect();
        targetX = (updatedRect.left + updatedRect.width / 2 - targetDrawingArea.getBoundingClientRect().left) / globalScale;
        endX = targetX;

        targetLabels.forEach(label => {
          label.style.left = `${newLeft}px`;
        });

        midX = (startX + endX) / 2;
      }
    }

    // --- Bend 높이 결정 로직 수정 ---
    const parent1 = parseInt(startDot.dataset.index); // 부모1 인덱스
    const parent2 = parseInt(endDot.dataset.index); // 부모2 인덱스
    const newLabel = parseInt([...new Set([...parent1.toString(), ...parent2.toString()])].sort((a, b) => a - b).join('')); // 생성될 점 인덱스 (bend ID로 사용)

    let reusedBend = null;
    let lowestInactiveY = Infinity;

    // 1. 겹치는 구간 내 비활성(active: false) bend 찾기
    existingBends.forEach(bend => {
        if (!bend.active &&
            ((bend.startX >= Math.min(startX, endX) && bend.startX <= Math.max(startX, endX)) ||
             (bend.endX >= Math.min(startX, endX) && bend.endX <= Math.max(startX, endX))) &&
            bend.y < lowestInactiveY) {
            lowestInactiveY = bend.y;
            reusedBend = bend;
        }
    });

    if (reusedBend) {
        // 2. 비활성 bend 재활용
        midY = reusedBend.y;
        reusedBend.active = true;
        reusedBend.id = newLabel; // ID 업데이트 (새로 연결되는 점 기준)
        reusedBend.startX = startX; // 혹시 모를 좌표 업데이트
        reusedBend.endX = endX;
    } else {
        // 3. 재활용할 bend 없으면 새로 생성
        let maxExistingY = lowerY;
        existingBends.forEach(bend => {
            if (bend.active &&
                ((bend.startX >= Math.min(startX, endX) && bend.startX <= Math.max(startX, endX)) ||
                 (bend.endX >= Math.min(startX, endX) && bend.endX <= Math.max(startX, endX)))) {
                maxExistingY = Math.max(maxExistingY, bend.y);
            }
        });

        midY = maxExistingY + bendHeight;
        existingBends.push({
            id: newLabel, // 생성된 점 index를 ID로 사용
            startX,
            endX,
            y: midY,
            active: true
        });
    }
    // --- Bend 높이 결정 로직 수정 끝 ---

    // ✅ 라벨 번호 결정 로직: 사용 가능한 가장 작은 번호 찾기
    const existingLabelElements = area.querySelectorAll('.connection_label');
    const usedNumbers = new Set(Array.from(existingLabelElements).map(label => parseInt(label.textContent)).filter(num => !isNaN(num)));
    let nextLabelNumber = 1;
    while (usedNumbers.has(nextLabelNumber)) {
        nextLabelNumber++;
    }

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
    path.classList.add("connection_line", `line_${nextLabelNumber}`);
    path.dataset.generatedDotIndex = newLabel; // ✅ 생성된 점 인덱스 정보 추가


    const hintPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    hintPath.setAttribute("d", pathData);
    hintPath.setAttribute("stroke", "transparent");
    hintPath.setAttribute("stroke-width", "20");
    hintPath.setAttribute("fill", "none");
    hintPath.classList.add("hint_line", `hint_${nextLabelNumber}`);
    hintPath.dataset.generatedDotIndex = newLabel; // ✅ 생성된 점 인덱스 정보 추가

    // 4. 선 클릭 핸들러 수정
    hintPath.addEventListener("click", () => {
        // 선 제거 (path와 hintPath 자체) - 재귀 함수에서 처리하므로 여기선 제거 안 함

        // 연결된 원래 점들 다시 사용 가능하게 (제거 로직 안으로 이동 고려)
        // availableDots.set(parent1, startDot); // 재귀 함수 내에서 필요시 처리
        // availableDots.set(parent2, endDot);

        // 생성된 점(newLabel)과 그 자손들 재귀적으로 제거
        removeDotAndDescendants(newLabel); // ✅ 새 재귀 함수 호출

        // 연결 정보 업데이트 (userConnections) - 재귀적으로 처리되지 않으므로 여기서 유지
        let userConnections = JSON.parse(svg.dataset.userConnections || "[]");
         // newLabel의 부모인 parent1, parent2 쌍만 제거
         const sortedParents = [parent1, parent2].sort((a,b) => a-b);
         userConnections = userConnections.filter(conn =>
             !(conn[0] === sortedParents[0] && conn[1] === sortedParents[1])
         );
        svg.dataset.userConnections = JSON.stringify(userConnections);

        // bend 정보 제거는 removeDotAndDescendants 내부에서 처리됨

        audioManager.playSound('click');
    });


    svg.appendChild(path);
    svg.appendChild(hintPath);

    availableDots.delete(parent1);
    availableDots.delete(parent2);

    const connectionLabel = document.createElement("div");
    connectionLabel.classList.add("connection_label", `label_${nextLabelNumber}`);
    connectionLabel.dataset.labelIndex = newLabel;
    connectionLabel.textContent = nextLabelNumber;
    connectionLabel.style.position = "absolute";
    connectionLabel.style.left = `${midX}px`;
    connectionLabel.style.top = `${midY + offsetY}px`;
    connectionLabel.style.transform = "translate(-50%, -50%)";
    area.appendChild(connectionLabel);

    // createDot 호출 시 부모 정보 전달
    if (availableDots.size === 0) {
      createDot(newLabel, area, midX, midY + offsetY * 2, true, true, parent1, parent2);
    } else {
      createDot(newLabel, area, midX, midY + offsetY * 2, true, false, parent1, parent2);
    }

    let userConnections = JSON.parse(svg.dataset.userConnections || "[]");
    userConnections.push([parent1, parent2].sort((a, b) => a - b));
    svg.dataset.userConnections = JSON.stringify(userConnections);

}

// 3. 재귀적 제거 함수 구현 (forEach 루프 안으로 이동)
function removeDotAndDescendants(dotIndexToRemove) {
    // drawingArea와 svg는 클로저를 통해 접근 가능하므로 document.querySelector 제거
    // const drawingArea = document.querySelector('.drawing_area'); // 제거
    // const svg = drawingArea.querySelector(".connection_lines"); // 제거

    const dotToRemove = drawingArea.querySelector(`.dot[data-index="${dotIndexToRemove}"]`);

    // Base case: 점이 없거나 생성된 점이 아니면 종료
    if (!dotToRemove || dotToRemove.dataset.generated !== "true") {
        return;
    }

    // 해당 점을 생성한 부모 점들을 찾아 다시 available로 만들기 (옵션 - 필요시 활성화)
    const parent1Index = parseInt(dotToRemove.dataset.parent1);
    const parent2Index = parseInt(dotToRemove.dataset.parent2);
    if (!isNaN(parent1Index)) {
        const parent1Dot = drawingArea.querySelector(`.dot[data-index="${parent1Index}"]`);
        // 부모가 다른 생성된 점에 의해 아직 사용 중인지 확인 후 available로 변경
        const isParent1Used = Array.from(drawingArea.querySelectorAll(`.dot[data-generated="true"]:not([data-index="${dotIndexToRemove}"])`)).some(d => d.dataset.parent1 == parent1Index || d.dataset.parent2 == parent1Index);
        // availableDots는 클로저 변수 사용
        if (parent1Dot && !isParent1Used) availableDots.set(parent1Index, parent1Dot);
    }
    if (!isNaN(parent2Index)) {
        const parent2Dot = drawingArea.querySelector(`.dot[data-index="${parent2Index}"]`);
        const isParent2Used = Array.from(drawingArea.querySelectorAll(`.dot[data-generated="true"]:not([data-index="${dotIndexToRemove}"])`)).some(d => d.dataset.parent1 == parent2Index || d.dataset.parent2 == parent2Index);
        // availableDots는 클로저 변수 사용
        if (parent2Dot && !isParent2Used) availableDots.set(parent2Index, parent2Dot);
    }


    // 연결된 요소 찾기 (제거 전)
    const labelToRemove = drawingArea.querySelector(`.connection_label[data-label-index="${dotIndexToRemove}"]`);
    // svg는 클로저 변수 사용
    const pathsToRemove = Array.from(svg.querySelectorAll(`path[data-generated-dot-index="${dotIndexToRemove}"]`));

    // Bend 정보 비활성화
    const bendIdToRemove = dotIndexToRemove; // 제거 대상 점의 인덱스가 bend의 ID
    const bendToDeactivate = existingBends.find(bend => bend.id === bendIdToRemove && bend.active);
    if (bendToDeactivate) {
        bendToDeactivate.active = false;
    }

    // 요소 제거
    if (labelToRemove) labelToRemove.remove();
    pathsToRemove.forEach(p => p.remove());
    dotToRemove.remove();

    // 상태 업데이트
    // availableDots는 클로저 변수 사용
    availableDots.delete(dotIndexToRemove);

    // 자식 점들 찾기
    const childrenDots = Array.from(drawingArea.querySelectorAll(
        `.dot[data-generated="true"][data-parent1="${dotIndexToRemove}"], .dot[data-generated="true"][data-parent2="${dotIndexToRemove}"]`
    ));

    // 자식 점들에 대해 재귀 호출 (함수는 이미 로컬 스코프에 있음)
    childrenDots.forEach(childDot => {
        const childIndex = parseInt(childDot.dataset.index);
        if (!isNaN(childIndex)) {
            removeDotAndDescendants(childIndex);
        }
    });
}


  function resetDrawingArea() {
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // ✅ 모든 점 제거 (초기 점 + 생성된 점 포함)
    drawingArea.querySelectorAll(".dot").forEach(dot => dot.remove());

    // ✅ 라벨 제거
    drawingArea.querySelectorAll(".connection_label").forEach(label => label.remove());

    selectedDots = [];
    cancelButton.style.display = "none";
    availableDots.clear();
    existingBends = [];
    svg.dataset.userConnections = JSON.stringify([]);
    labelCount = 1;

    isInitialized = false; // ✅ 초기화 상태로 되돌림
  }


  document.addEventListener("pageChanged", () => {
    if (pagenation.activePage.contains(drawingArea)) {
      initializeDots();
      const connectionsData = JSON.parse(drawingArea.dataset.answerSingle || "[]");

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



  document.addEventListener("globalFaultUpdated", (event) => {
    if (event.detail > 1 && pagenation.activePage.contains(drawingArea)) {
      resetDrawingArea();
      initializeDots();

      const connectionsData = JSON.parse(drawingArea.dataset.answerSingle || "[]");

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

document.querySelectorAll(".btn_area .btnReset").forEach(resetButton => {
  // 이미 리스너 등록 여부 체크
  if (!resetButton.dataset.listenerAttached) {
    resetButton.addEventListener("click", () => {
      document.querySelectorAll(".drawing_area").forEach(drawingArea => {

        if (!pagenation.activePage.contains(drawingArea)) return;

        const svg = drawingArea.querySelector(".connection_lines");
        if (!svg) return;

        const resetDrawingArea = drawingArea.__resetDrawingArea__;
        const initializeDots = drawingArea.__initializeDots__;

        if (typeof resetDrawingArea === "function" && typeof initializeDots === "function") {
          resetDrawingArea();
          drawingArea.__isInitialized__ = false;
          initializeDots();

          forceWatchEvaluation();
          // 모든 버튼의 active 클래스 제거
        }
      });

      // connect_wrap 요소 리셋 로직 추가
      document.querySelectorAll(".connect_wrap").forEach(connectWrap => {
        if (!pagenation.activePage.contains(connectWrap)) return;

        const resetFunc = connectWrap.__resetConnectWrap__;
        if (typeof resetFunc === "function") {
          resetFunc();
        }
      });

      forceWatchEvaluation(); // connect_wrap 리셋 후에도 호출
    });


    // ✅ 다시 등록되지 않도록 표시
    resetButton.dataset.listenerAttached = "true";
  }
});


const connectLineWidth = 2;

// 드래그/클릭 판별용 상수
const DRAG_TIME_THRESHOLD = 150; // ms
const DRAG_DISTANCE_THRESHOLD = 5; // px
const TOUCH_DRAG_DISTANCE_THRESHOLD = 2; // 터치 이벤트용 더 작은 값

// 연결 초기화

document.querySelectorAll('.connect_wrap').forEach(wrap => {
  const svg = wrap.querySelector('.connect_lines');
  const points = wrap.querySelectorAll('.connect_point');
  const mode = wrap.dataset.mode || "single";
  const connections = new Map();

  let firstClickedDot = null; // State for click-connection (using mouseup)
  let tempLine = null;
  let isPotentialDrag = false; // Flag: mousedown occurred, could become drag or click
  let isDragging = false;     // Flag: mouse moved significantly after mousedown
  let startX = 0;
  let startY = 0;
  let dragStartDot = null; // Keep track of the dot where drag started

  // Multi-mode line click removal
  if (mode === "multi") {
    svg.addEventListener('click', (e) => {
      const line = e.target.closest('line.connection_line, line.hint_line');
      if (line) {
        const fromId = line.dataset.from;
        const toId = line.dataset.to;
        svg.querySelectorAll(`line[data-from="${fromId}"][data-to="${toId}"]`).forEach(l => l.remove());
        if (connections.get(fromId) === toId) connections.delete(fromId);
        if (connections.get(toId) === fromId) connections.delete(toId);

        // Remove connections *to* the points as well if map stores direction
         let keyToDelete = null;
         for(let [key, val] of connections.entries()){
             if(val === fromId && key === toId) keyToDelete = key;
             if(val === toId && key === fromId) keyToDelete = key;
         }
         if(keyToDelete) connections.delete(keyToDelete);

        updateConnectionData();

        const startPoint = getPointById(fromId);
        const endPoint = getPointById(toId);
        const connectionArray = Array.from(connections.entries());

        if (startPoint) {
          const hasOtherConnections = connectionArray.some(conn => conn[0] === fromId || conn[1] === fromId || connections.get(conn[1]) === fromId);
          if (!hasOtherConnections) startPoint.classList.remove('connected');
        }
        if (endPoint) {
          const hasOtherConnections = connectionArray.some(conn => conn[0] === toId || conn[1] === toId || connections.get(conn[1]) === toId);
          if (!hasOtherConnections) endPoint.classList.remove('connected');
        }
        audioManager.playSound('click');
      }
    });
  }

  function getPointById(id) {
    return wrap.querySelector(`.connect_point[data-id="${id}"]`);
  }

  function updateConnectionData() {
    const finalConnectionArray = Array.from(connections.entries());
    wrap.dataset.connections = JSON.stringify(finalConnectionArray);
    wrap.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    window.forceWatchEvaluation?.();
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
    line.classList.add("connection_line");
    line.dataset.from = fromEl.dataset.id;
    line.dataset.to = toEl.dataset.id;
    svg.appendChild(line);

    const hintLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hintLine.setAttribute("x1", x1);
    hintLine.setAttribute("y1", y1);
    hintLine.setAttribute("x2", x2);
    hintLine.setAttribute("y2", y2);
    hintLine.setAttribute("stroke", "transparent");
    hintLine.setAttribute("stroke-width", "20");
    hintLine.setAttribute("stroke-linecap", "round");
    hintLine.classList.add("hint_line");
    hintLine.dataset.from = fromEl.dataset.id;
    hintLine.dataset.to = toEl.dataset.id;
    svg.appendChild(hintLine);
  }

  function removeLine(pointId) {
    const connectedTo = connections.get(pointId);
    if (connectedTo) {
        svg.querySelectorAll(`line[data-from="${pointId}"][data-to="${connectedTo}"]`).forEach(line => line.remove());
        connections.delete(pointId);
        const targetPoint = getPointById(connectedTo);
         const hasOtherConnections = Array.from(connections.entries()).some(([key, val]) => key === connectedTo || val === connectedTo);
         if(targetPoint && !hasOtherConnections) targetPoint.classList.remove('connected');
    }

     let connectedFrom = null;
     for(const [key, val] of connections.entries()){
         if(val === pointId){
             connectedFrom = key;
             break;
         }
     }
     if(connectedFrom){
         svg.querySelectorAll(`line[data-from="${connectedFrom}"][data-to="${pointId}"]`).forEach(line => line.remove());
         connections.delete(connectedFrom);
          const sourcePoint = getPointById(connectedFrom);
          const hasOtherConnections = Array.from(connections.entries()).some(([key, val]) => key === connectedFrom || val === connectedFrom);
          if(sourcePoint && !hasOtherConnections) sourcePoint.classList.remove('connected');
     }

    const selfPoint = getPointById(pointId);
    const stillConnected = Array.from(connections.entries()).some(([key, val]) => key === pointId || val === pointId);
    if(selfPoint && !stillConnected) selfPoint.classList.remove('connected');

    updateConnectionData();
}


  function finalizeConnection(startDotForConnection, endDot) {
    if (!startDotForConnection || !endDot || startDotForConnection === endDot) {
        if(startDotForConnection) startDotForConnection.classList.remove('selected');
        return false;
    }

    const sameGroup = (
      startDotForConnection.closest('.start_group') === endDot.closest('.start_group') ||
      startDotForConnection.closest('.end_group') === endDot.closest('.end_group')
    );

    if (sameGroup) {
      startDotForConnection.classList.remove('selected');
      return false;
    }

    if (mode === "single") {
      removeLine(startDotForConnection.dataset.id);
      removeLine(endDot.dataset.id);
    }

    drawLine(startDotForConnection, endDot);
    connections.set(startDotForConnection.dataset.id, endDot.dataset.id);
    updateConnectionData();

    startDotForConnection.classList.remove('selected');
    startDotForConnection.classList.add('connected');
    endDot.classList.add('connected');
    return true;
  }

  function findEndDot(x, y) {
     return [...points].find(p => {
         const rect = p.getBoundingClientRect();
         const hitWidth = rect.width * 1.5;
         const hitHeight = rect.height * 1.5;
         const expandedRect = {
             left: rect.left + (rect.width / 2) - (hitWidth / 2),
             right: rect.left + (rect.width / 2) + (hitWidth / 2),
             top: rect.top + (rect.height / 2) - (hitHeight / 2),
             bottom: rect.top + (rect.height / 2) + (hitHeight / 2)
         };
         return x >= expandedRect.left && x <= expandedRect.right &&
                y >= expandedRect.top && y <= expandedRect.bottom;
     });
 }


  points.forEach(point => {
    point.addEventListener('mousedown', handleStart);
    point.addEventListener('touchstart', handleStart, { passive: false });
    // Remove the 'click' listener
    // point.addEventListener('click', handleClick);
  });

  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);


  function handleStart(e) {
    const point = e.target.closest('.connect_point');
    if (!point) return;
    e.preventDefault();

    isPotentialDrag = true;
    isDragging = false;
    dragStartDot = point;

    // Clear previous click selection only if starting on a *different* dot
    if (firstClickedDot && firstClickedDot !== point) {
        firstClickedDot.classList.remove('selected');
         // Don't reset firstClickedDot itself here, let handleEnd manage it
    }

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    startX = clientX;
    startY = clientY;

    // ✅ tempLine 유효성 검사 추가: 변수가 존재하지만 DOM에 없으면 null로 처리
    if (tempLine && !svg.contains(tempLine)) {
        tempLine = null;
    }

    if (!tempLine) {
         tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
         tempLine.setAttribute("stroke", "#aaa");
         tempLine.setAttribute("stroke-width", "6");
         tempLine.setAttribute("stroke-linecap", "round");
         tempLine.style.pointerEvents = 'none';
         svg.appendChild(tempLine);
     }
     const wrapRect = wrap.getBoundingClientRect();
     const x1 = (startX - wrapRect.left) / globalScale;
     const y1 = (startY - wrapRect.top) / globalScale;
     tempLine.setAttribute("x1", x1);
     tempLine.setAttribute("y1", y1);
     tempLine.setAttribute("x2", x1);
     tempLine.setAttribute("y2", y1);
     tempLine.style.display = 'block'; // 드래그 시작 시 바로 보이도록 변경
  }

  function handleMove(e) {
    if (!isPotentialDrag || !dragStartDot) return;
     if(e.type === 'touchmove') e.preventDefault();

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const dx = Math.abs(clientX - startX);
    const dy = Math.abs(clientY - startY);
    const threshold = e.type === 'touchmove' ? TOUCH_DRAG_DISTANCE_THRESHOLD : DRAG_DISTANCE_THRESHOLD;

    if (!isDragging && (dx > threshold || dy > threshold)) {
      isDragging = true;
      dragStartDot.classList.add('dragging');
      audioManager.playSound("drag");

      // If drag starts, cancel any pending first click state
      if(firstClickedDot) {
          firstClickedDot.classList.remove('selected');
          firstClickedDot = null;
      }
    }

    if (isDragging && tempLine) {
      const wrapRect = wrap.getBoundingClientRect();
      const x2 = (clientX - wrapRect.left) / globalScale;
      const y2 = (clientY - wrapRect.top) / globalScale;
      tempLine.setAttribute("x2", x2);
      tempLine.setAttribute("y2", y2);
    }
  }

  function handleEnd(e) {
    if (!isPotentialDrag || !dragStartDot) return;

    const wasDragging = isDragging;
    const currentStartDot = dragStartDot; // Capture before resetting

    // Reset state for next interaction
    isPotentialDrag = false;
    isDragging = false;
    dragStartDot = null;

    if (tempLine) tempLine.style.display = 'none';
    currentStartDot.classList.remove('dragging');

    // Determine the end point (might be null if released outside a point)
     let endDot = null;
     // Use elementFromPoint for mouseup/touchend location
     try {
         const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
         const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;
         const endTargetElement = document.elementFromPoint(clientX, clientY);
         endDot = endTargetElement?.closest('.connect_point');
     } catch (error) { /* Ignore errors from elementFromPoint if coordinates are invalid */ }


    if (wasDragging) {
        // --- Handle Drag End --- Find target using coords
        const clientX_drag = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
        const clientY_drag = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;
        const dragEndTargetDot = findEndDot(clientX_drag, clientY_drag);

        const connected = finalizeConnection(currentStartDot, dragEndTargetDot);
        if (connected) {
            audioManager.playSound("drop");
        } else {
             currentStartDot.classList.remove('selected');
        }
    } else {
        // --- Handle Click (No Drag Occurred) ---
        // Check if mouseup/touchend happened *on the starting point*
        if (endDot === currentStartDot) {
             if (!firstClickedDot) {
                 // First click of a pair
                 firstClickedDot = currentStartDot;
                 firstClickedDot.classList.add('selected');
                 audioManager.playSound('click');
             } else {
                 // Second click
                 if (currentStartDot === firstClickedDot) {
                     // Clicked the same dot again - deselect
                     firstClickedDot.classList.remove('selected');
                     firstClickedDot = null;
                     audioManager.playSound('click');
                 } else {
                     // Clicked a different dot as the second click
                     const tempFirstDot = firstClickedDot;
                     firstClickedDot.classList.remove('selected'); // Deselect first
                     firstClickedDot = null;

                     const connected = finalizeConnection(tempFirstDot, currentStartDot); // Connect first to current
                     if (connected) {
                         audioManager.playSound('drop');
                     } else {
                         audioManager.playSound('click');
                         tempFirstDot.classList.remove('selected'); // Ensure first is deselected on fail
                     }
                 }
             }
        } else {
             // Click happened outside the starting point (or on no point), cancel selection
             if(firstClickedDot){
                 firstClickedDot.classList.remove('selected');
                 firstClickedDot = null;
             }
        }
    }
}

  // Initial draw from dataset (unchanged)
  try {
    const initialConnections = JSON.parse(wrap.dataset.connections || "[]");
      initialConnections.forEach(pair => {
          const fromEl = getPointById(pair[0]);
          const toEl = getPointById(pair[1]);
          if(fromEl && toEl) {
                // Need a temporary startDot context for finalizeConnection
                let tempStartDot = fromEl;
                finalizeConnection(tempStartDot, toEl);
          }
      });
  } catch (e) {
      // console.error("Error parsing initial connections for connect_wrap:", e);
  }

  // --- 리셋 함수 추가 --- 
  function resetConnectWrap() {
    // SVG 내용 비우기
    svg.innerHTML = '';
    // 연결 정보 초기화
    connections.clear();
    // 선택된 점 초기화
    if (firstClickedDot) {
      firstClickedDot.classList.remove('selected');
      firstClickedDot = null;
    }
    // 모든 점의 연결 상태 클래스 제거
    points.forEach(p => p.classList.remove('connected', 'selected'));
    // 임시 라인 제거 (만약 존재하고 DOM에 있다면)
    if (tempLine && svg.contains(tempLine)) {
      tempLine.remove();
      tempLine = null;
    }
    // 데이터셋 업데이트 및 이벤트 발생
    updateConnectionData();
  }

  // wrap 요소에 리셋 함수 저장
  wrap.__resetConnectWrap__ = resetConnectWrap;
  // --- 리셋 함수 추가 끝 --- 

});

function drawAnswerConnections(connectWrap) {
  // if (connectWrap.dataset.correction !== "false") return;

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
    // console.warn("❌ JSON 파싱 오류:", e);
    return;
  }

  const stringify = arr => JSON.stringify(arr.sort());
  const userKeySet = new Set(userPairs.map(pair => stringify(pair)));
  const answerKeySet = new Set(answerPairs.map(pair => stringify(pair)));

  // 기존 정답/오답 표시선 제거 (새로 그리기 위함)
  svg.querySelectorAll(".correct_highlight, .answer_line").forEach(line => line.remove());

  // 사용자가 그린 선 처리 (오답 선은 그대로 두거나 필요시 스타일링)
  svg.querySelectorAll("line.connection_line").forEach(line => {
    const from = line.dataset.from;
    const to = line.dataset.to;
    const key = stringify([from, to]);

    if (!answerKeySet.has(key) && userKeySet.has(key)) {
        // 사용자가 그린 오답 선에 대한 처리 (필요하다면)
        // 예: line.setAttribute("stroke", "gray");
    }
    // 사용자가 그린 정답 선은 그대로 둠 (뒤에 파란 선 추가)
  });


  // 정답 선 처리
  answerPairs.forEach(pair => {
    const key = stringify(pair);
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

    if (userKeySet.has(key)) {
      // 사용자가 그린 정답 선: 뒤에 파란색 두꺼운 선 추가
      const highlightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      highlightLine.setAttribute("x1", x1);
      highlightLine.setAttribute("y1", y1);
      highlightLine.setAttribute("x2", x2);
      highlightLine.setAttribute("y2", y2);
      highlightLine.setAttribute("stroke-width", connectLineWidth * 3); // 더 두껍게 (기존 * 2)
      highlightLine.setAttribute("stroke-linecap", "round");
      highlightLine.classList.add("correct_highlight", "correct_line"); // 클래스 추가
      highlightLine.dataset.from = fromId; // 데이터 속성 유지
      highlightLine.dataset.to = toId;

      // 생성된 파란 선을 SVG의 맨 앞에 추가 (기존 선 뒤에 그려지도록)
      if (svg.firstChild) {
        svg.insertBefore(highlightLine, svg.firstChild);
      } else {
        svg.appendChild(highlightLine);
      }
    } else {
      // 사용자가 그리지 않은 정답 선: 뒤에 빨간색 두꺼운 선 추가
      const answerLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      answerLine.setAttribute("x1", x1);
      answerLine.setAttribute("y1", y1);
      answerLine.setAttribute("x2", x2);
      answerLine.setAttribute("y2", y2);
      answerLine.setAttribute("stroke-width", connectLineWidth * 3); // 두껍게
      answerLine.setAttribute("stroke-linecap", "round");
      answerLine.classList.add("answer_line", "correct_line"); // 클래스 추가
      answerLine.dataset.from = fromId; // 데이터 속성 유지
      answerLine.dataset.to = toId;

      // 생성된 빨간 선을 SVG의 맨 앞에 추가 (다른 선들 뒤에 그려지도록)
      if (svg.firstChild) {
        svg.insertBefore(answerLine, svg.firstChild);
      } else {
        svg.appendChild(answerLine);
      }
    }
  });
}


/**
 * 격자 그리기
 */
const drawingAreas = document.querySelectorAll('.drawing_grid_area');
let pointsMap = new Map(); // 각 drawingArea에 대한 points 저장
let isClosedMap = new Map(); // 각 drawingArea에 대한 isClosed 저장
let gridInitializedMap = new Map(); // 각 drawingArea의 그리드 초기화 여부 저장

// 특정 요소에 대해 그리드 포인트 생성 (기존 createGridPoints 로직 이동 및 수정)
function createGridPointsForElement(el) {
    if (gridInitializedMap.get(el)) return; // 이미 초기화되었으면 중단

    // 요소 크기 확인
    if (el.offsetWidth === 0 || el.offsetHeight === 0) {
        // console.warn('Grid creation skipped: Element has zero dimensions', el.id);
        return;
    }

    // 기존 hit_area 제거 (혹시 모를 중복 방지)
    el.querySelectorAll('.hit_area').forEach(hit => hit.remove());

    const currentGridSize = parseInt(el.dataset.gridSize, 10) || 50;
    pointsMap.set(el, []);
    isClosedMap.set(el, false);

    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const cols = Math.floor(width / currentGridSize);
    const rows = Math.floor(height / currentGridSize);

    // console.log(`Creating grid for ${el.id}: ${cols}x${rows} (size: ${width}x${height})`); // 로그 추가

    for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {
            const hitArea = document.createElement('div');
            hitArea.className = 'hit_area';
            hitArea.style.left = j * currentGridSize + 'px';
            hitArea.style.top = i * currentGridSize + 'px';
            // hitArea.style.width = currentGridSize + 'px'; // 필요시 크기 명시
            // hitArea.style.height = currentGridSize + 'px';

            hitArea.addEventListener('click', (e) => {
                const x = j * currentGridSize;
                const y = i * currentGridSize;

                if (isClosedMap.get(el)) {
                    resetDrawing(el);
                    return;
                }
                createPoint(x, y, el);
            });
            el.appendChild(hitArea);
        }
    }
    gridInitializedMap.set(el, true); // 초기화 완료 표시

    // 샘플 라인 그리기
    drawSampleLine(el);
    // 초기 정답 라인 그리기 (새로운 빨간 선)
    drawInitialAnswerLines(el);
}

// 초기 샘플 라인 그리기 함수 (별도 정의 또는 createGridPointsForElement 내부에 포함)
function drawSampleLine(el) {
    // 기존 샘플 라인(default_line) 제거 후 다시 그림
    el.querySelectorAll('.default_line').forEach(line => line.remove());

    const sampleLineData = el.dataset.sampleLine;
    if (sampleLineData) {
        try {
            const groups = JSON.parse(sampleLineData);
            if (Array.isArray(groups)) {
                const svgCanvas = el.querySelector('.line_canvas');
                if (svgCanvas) {
                    // 각 선 묶음별로 처리
                    groups.forEach(group => {
                        if (Array.isArray(group) && group.length > 1) {
                            // 각 선 묶음 내의 연속된 점들을 선으로 연결
                            for (let i = 0; i < group.length - 1; i++) {
                                const startPoint = group[i];
                                const endPoint = group[i + 1];
                                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                                line.classList.add('default_line');
                                line.setAttribute('x1', startPoint.x);
                                line.setAttribute('y1', startPoint.y);
                                line.setAttribute('x2', endPoint.x);
                                line.setAttribute('y2', endPoint.y);
                                svgCanvas.appendChild(line);
                            }
                        }
                    });
                }
            }
        } catch (e) {
            // console.error("Error parsing or drawing sample line:", e, el);
        }
    }
}

// ✅ 초기 정답 선 그리기 함수 추가
function drawInitialAnswerLines(el) {
  const svgCanvas = el.querySelector('.line_canvas');
  const answerRaw = el.dataset.answerSingle;

  if (!svgCanvas || !answerRaw) {
    // SVG 캔버스가 없거나 정답 데이터가 없으면 실행 안 함
    return;
  }

  // 기존에 그려진 배경 정답 선 제거 (중복 방지 - 초기화 시점에만 필요할 수 있음)
  el.querySelectorAll('.answer_bg_line').forEach(line => line.remove());

  try {
    const answerGroups = JSON.parse(answerRaw);
    if (Array.isArray(answerGroups)) {
      answerGroups.forEach(group => {
        if (Array.isArray(group) && group.length > 1) {
          for (let i = 0; i < group.length - 1; i++) {
            const startPoint = group[i];
            const endPoint = group[i + 1];

            const answerBgLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            answerBgLine.classList.add('answer_bg_line'); // 배경 정답 선 클래스 추가
            answerBgLine.setAttribute('x1', startPoint.x);
            answerBgLine.setAttribute('y1', startPoint.y);
            answerBgLine.setAttribute('x2', endPoint.x);
            answerBgLine.setAttribute('y2', endPoint.y);
            // 스타일은 CSS로 정의

            // 생성된 선을 SVG의 맨 앞에 추가 (다른 선들 아래에 그려지도록)
            if (svgCanvas.firstChild) {
              svgCanvas.insertBefore(answerBgLine, svgCanvas.firstChild);
            } else {
              svgCanvas.appendChild(answerBgLine);
            }
          }
        }
      });
    }
  } catch (e) {
    // console.error("Error parsing or drawing initial answer lines:", e, el);
  }
}

/**
 * 두 좌표 배열을 정렬하여 비교하는 함수
 * @param {Array<Array<Object>>} arr1 - 첫 번째 좌표 배열 [[{x, y}, ...], [{x, y}, ...]]
 * @param {Array<Array<Object>>} arr2 - 두 번째 좌표 배열 [[{x, y}, ...], [{x, y}, ...]]
 * @returns {boolean} - 두 배열이 동일한 점 집합을 가지면 true, 아니면 false
 */
function comparePointArrays(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }

  // 두 점이 같은지 비교하는 함수
  function isSamePoint(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
  }

  // 두 점 배열이 같은 점들을 포함하는지 비교하는 함수 (순서 무관)
  function hasSamePoints(points1, points2) {
    if (points1.length !== points2.length) return false;

    // points1의 각 점이 points2에 존재하는지 확인
    return points1.every(p1 => 
      points2.some(p2 => isSamePoint(p1, p2))
    );
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  // 각 선 묶음에 대해 매칭되는 묶음이 있는지 확인
  const usedIndices = new Set();
  
  for (const group1 of arr1) {
    let found = false;
    for (let i = 0; i < arr2.length; i++) {
      if (!usedIndices.has(i) && hasSamePoints(group1, arr2[i])) {
        usedIndices.add(i);
        found = true;
        break;
      }
    }
    if (!found) return false;
  }

  return true;
}

function createPoint(x, y, el) {
  // console.log(`Point created at: (${x}, ${y})`);

  // points 배열 초기화 확인
  let points = pointsMap.get(el);
  if (!points || !Array.isArray(points)) {
    points = [[]];
    pointsMap.set(el, points);
  }
  // 현재 활성화된 선 묶음이 없으면 새로운 선 묶음 추가
  if (points.length === 0) {
    points.push([]);
  }

  let currentGroup = points[points.length - 1];

  // 마지막 점을 다시 클릭한 경우
  if (currentGroup.length > 0) {
    const lastPoint = currentGroup[currentGroup.length - 1];
    if (lastPoint.x === x && lastPoint.y === y) {
      // 마지막 점을 파란색으로 변경
      const existingPoints = el.querySelectorAll('.point');
      if (existingPoints.length > 0) {
        const lastPointElement = existingPoints[existingPoints.length - 1];
        lastPointElement.classList.add('end-point');
      }
      // 새로운 선 묶음 시작
      points.push([]);
      return;
    }
  }

  // 시작점과 현재 점이 이어지는지 확인
  if (currentGroup.length > 0) {
    const firstPoint = currentGroup[0];
    if (firstPoint.x === x && firstPoint.y === y) {
      // 시작점과 현재 점이 이어지면 선 그리기
      const prevPoint = currentGroup[currentGroup.length - 1];
      drawLine(prevPoint, firstPoint, el);
      // 새로운 선 묶음 시작
      points.push([]);
      return;
    }
  }

  // 점 생성 및 추가
  const point = document.createElement('div');
  point.className = 'point';
  point.style.left = x + 'px';
  point.style.top = y + 'px';
  el.appendChild(point);

  // 현재 선 묶음에 점 추가
  currentGroup = points[points.length - 1];
  currentGroup.push({ x, y });

  // 첫 점을 찍었을 때 리셋/확인 버튼 활성화
  const totalPoints = points.reduce((sum, group) => sum + group.length, 0);
  if (totalPoints === 1) {
    const resetButton = document.querySelector('.btn_area .btnReset');
    if (resetButton) {
      resetButton.classList.add('active');
    }
    const checkButton = document.querySelector('.btn_area .btnCheck');
    if (checkButton) {
      checkButton.classList.add('active');
    }
  }

  // 데이터 속성에 연결 정보 업데이트
  // 빈 배열은 제외하고 저장
  const nonEmptyGroups = points.filter(group => group.length > 0);
  el.dataset.connection = JSON.stringify(nonEmptyGroups);

  // 실시간 정답 비교 및 data-correction 업데이트
  try {
    const answerData = JSON.parse(el.dataset.answerSingle || '[]');
    const isCorrect = comparePointArrays(nonEmptyGroups, answerData);
    el.dataset.correction = isCorrect;
  } catch (e) {
    // console.error("Error comparing points:", e);
    el.removeAttribute('data-correction');
  }

  // 현재 그룹에 2개 이상의 점이 있으면 선 그리기
  if (currentGroup.length > 1) {
    drawLine(currentGroup[currentGroup.length - 2], currentGroup[currentGroup.length - 1], el);
  }
}

function drawLine(start, end, el) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.classList.add('add_line');
  line.setAttribute('x1', start.x);
  line.setAttribute('y1', start.y);
  line.setAttribute('x2', end.x);
  line.setAttribute('y2', end.y);
  const svgCanvas = el.querySelector('.line_canvas');
  if (svgCanvas) {
      svgCanvas.appendChild(line);
  }
}

function isSamePoint(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

function closeShape(el) {
  isClosedMap.set(el, true); // 해당 drawingArea의 isClosed 설정
}

function resetDrawing(el) {
  pointsMap.set(el, [[]]); // 2차원 배열로 초기화
  isClosedMap.set(el, false);

  // 데이터 속성 초기화
  el.dataset.connection = '[]';
  el.removeAttribute('data-correction');

  // 사용자가 추가한 선과 점 삭제
  el.querySelectorAll('.add_line').forEach(e => e.remove());
  el.querySelectorAll('.point').forEach(p => p.remove());

  // 버튼 비활성화
  const checkButton = document.querySelector('.btn_area .btnCheck');
  if (checkButton) {
    checkButton.classList.remove('active');
  }
  const resetButton = document.querySelector('.btn_area .btnReset');
  if (resetButton) {
    resetButton.classList.remove('active');
  }

  // 리셋 이벤트 발생
  const resetEvent = new CustomEvent('gridAreaReset', { bubbles: true, detail: { element: el } });
  el.dispatchEvent(resetEvent);
  // console.log('gridAreaReset event dispatched for', el);
}

// Intersection Observer 설정
const gridObserverOptions = {
  root: null, // 뷰포트를 root로 사용
  rootMargin: '0px',
  threshold: 0.1 // 요소가 10% 보이면 콜백 실행
};

const gridObserverCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      // 해당 요소에 대해 그리드 생성 함수 호출
      // console.log('Element is intersecting, creating grid for:', el.id);
      createGridPointsForElement(el);
      // 한 번 생성 후 관찰 중지 (필요한 경우)
      // observer.unobserve(el);
    } else {
        // 화면 밖으로 나갔을 때의 처리 (필요한 경우)
        // const el = entry.target;
        // console.log('Element is not intersecting:', el.id);
    }
  });
};

const gridObserver = new IntersectionObserver(gridObserverCallback, gridObserverOptions);

// 모든 drawing_grid_area 요소를 관찰 시작
drawingAreas.forEach(el => {
  gridObserver.observe(el);
});


// 기존 createGridPoints() 호출 및 초기 도형 세팅 로직 제거
// createGridPoints();
// drawingAreas.forEach(el => { ... });
