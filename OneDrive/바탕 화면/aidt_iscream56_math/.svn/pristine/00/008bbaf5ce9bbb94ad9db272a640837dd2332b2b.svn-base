document.addEventListener("DOMContentLoaded", function () {
  const appWrap = document.querySelector('#app_wrap');
  const submitBtn = document.querySelector('.btnSubmit');
  const resetBtn = document.querySelector('.btnReset');
  let latestSampleLine = null;

  // ✅ 1페이지 제출
  submitBtn.addEventListener('click', () => {
    const currentPage = appWrap.getAttribute('data-current-page');
    if (currentPage !== 'page_1') return;

    setTimeout(() => {
      const page1Grid = document.querySelector('.page.page_1 .drawing_grid_area');
      const raw = page1Grid?.getAttribute('data-connection');
      try {
        const rawPoints = JSON.parse(raw);
        latestSampleLine = rawPoints;
        const page2Grid = document.querySelector('.page.page_2 .drawing_grid_area');
        page2Grid?.setAttribute('data-sample-line', JSON.stringify(rawPoints));
        console.log("✅ sample-line 복사 완료:", rawPoints);
      } catch (e) {
        console.error("⛔ JSON 파싱 실패:", e);
        latestSampleLine = null;
      }
    }, 100);
  });

  // ✅ 1페이지 리셋
  resetBtn.addEventListener('click', () => {
    const currentPage = appWrap.getAttribute('data-current-page');
    if (currentPage !== 'page_1') return;

    const page1Grid = document.querySelector('.page.page_1 .drawing_grid_area');
    page1Grid.dataset.connection = '[]';
    page1Grid.removeAttribute('data-correction');
    page1Grid.classList.remove('disabled');
    const svg = page1Grid.querySelector('svg.line_canvas');
    if (svg) svg.innerHTML = '';
    const resetEvent = new CustomEvent('gridAreaReset', { bubbles: true, detail: { element: page1Grid } });
    page1Grid.dispatchEvent(resetEvent);
    console.log('🧹 커스텀 리셋 완료');
  });

  // ✅ sample-line 기반 선 복구 함수
  function recoverSampleLineAfterPage2Load() {
    let intervalId = null;
    let recoveryStart = Date.now();
  
    function draw() {
      const page2Grid = document.querySelector('.page.page_2 .drawing_grid_area');
      const svg = page2Grid?.querySelector('svg.line_canvas');
      const sampleLine = page2Grid?.getAttribute('data-sample-line');
  
      if (!svg || !sampleLine || sampleLine === '[]') {
        console.warn("⚠️ sample-line 없음 또는 SVG 없음");
        return;
      }
  
      try {
        let parsed = JSON.parse(sampleLine);
        if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
          parsed = parsed[0];
        }
        if (parsed.length > 0 && !Array.isArray(parsed[0])) {
          const lines = [];
          for (let i = 0; i < parsed.length - 1; i++) {
            lines.push([parsed[i], parsed[i + 1]]);
          }
          parsed = lines;
        }
  
        svg.innerHTML = '';
        parsed.forEach((line) => {
          if (!Array.isArray(line) || line.length !== 2) return;
          const [start, end] = line;
          const lineElem = document.createElementNS("http://www.w3.org/2000/svg", "line");
          lineElem.setAttribute("x1", start.x);
          lineElem.setAttribute("y1", start.y);
          lineElem.setAttribute("x2", end.x);
          lineElem.setAttribute("y2", end.y);
          lineElem.setAttribute("stroke", "black");
          lineElem.setAttribute("stroke-width", "2");
          svg.appendChild(lineElem);
        });
        console.log("🎯 [감시] sample-line 복구 성공");
      } catch (e) {
        console.error("⛔ sample-line 파싱 실패:", e);
      }
    }
  
    // 1초 동안 감시하면서 200ms마다 draw() 실행
    intervalId = setInterval(() => {
      draw();
      if (Date.now() - recoveryStart > 1200) { 
        clearInterval(intervalId);
        console.log("🛑 sample-line 감시 복구 완료");
      }
    }, 200);
  }
  

  // ✅ 페이지 전환 감지 → page_2 도달 시 선 복구
  const observer = new MutationObserver(() => {
    recoverSampleLineAfterPage2Load();
  });
  observer.observe(appWrap, {
    attributes: true,
    attributeFilter: ['data-current-page']
  });

  // ✅ 2페이지에서 점/선 추가 시 sample-line 동기화
  function syncPage2SampleLine() {
    const page2Grid = document.querySelector('.page.page_2 .drawing_grid_area');
    if (!page2Grid) return;
  
    const connectionRaw = page2Grid.getAttribute('data-connection');
    try {
      const parsedPoints = JSON.parse(connectionRaw);
  
      if (Array.isArray(parsedPoints) && parsedPoints.length > 1) {
        const lines = [];
        for (let i = 0; i < parsedPoints.length - 1; i++) {
          lines.push([parsedPoints[i], parsedPoints[i + 1]]);
        }
        // 🔥 최신 연결선을 이중배열로 다시 sample-line에 저장
        page2Grid.setAttribute('data-sample-line', JSON.stringify([lines]));
        console.log("🔄 2페이지 점/선 추가 → sample-line 실시간 업데이트:", [lines]);
      } else {
        // 점은 있는데 선을 만들 수 없는 경우
        page2Grid.setAttribute('data-sample-line', '[]');
        console.warn("⚠️ 2페이지 점만 있고 선 연결 부족 → sample-line 비움");
      }
    } catch (e) {
      console.error("⛔ 2페이지 data-connection 파싱 실패:", e);
    }
  }
  
  // ✅ 2페이지에서 클릭(점 추가)시 자동 업데이트
  document.addEventListener('click', (e) => {
    const page2Grid = document.querySelector('.page.page_2 .drawing_grid_area');
    if (!page2Grid) return;
  
    const currentPage = appWrap.getAttribute('data-current-page');
    if (currentPage !== 'page_2') return;
  
    if (page2Grid.contains(e.target)) {
      setTimeout(() => {
        syncPage2SampleLine(); // 클릭 후 100ms 후 sample-line 최신화
      }, 100);
    }
  });
  


  // ✅ paging_controller 버튼 클릭 감지 → 선 복구
  const pagingButtons = document.querySelectorAll('.paging_controller button');
  pagingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      recoverSampleLineAfterPage2Load();
    });
  });
});


  


