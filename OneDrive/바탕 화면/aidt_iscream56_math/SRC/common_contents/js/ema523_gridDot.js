document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid-container');
  const popup = document.querySelector('.popup');
  const btnCheck = document.querySelector('.btnCheck');
  const btnReset = document.querySelector('.btnReset');
  let selectedPoint = null;

  function updateCurrentPage() {
    // console.log("🔥 updateCurrentPage 실행됨");

    // const wrapper = document.querySelector('#app_wrap.paging');
    // const currentPageId = wrapper?.getAttribute('data-current-page');
    // if (!currentPageId) {
    //   console.warn("❌ 현재 페이지 ID 없음");
    //   return;
    // }

    // const currentPage = document.querySelector(`.page.${currentPageId}`);
    // if (!currentPage) {
    //   console.warn(`❌ .page.${currentPageId} 요소 없음`);
    //   return;
    // }

    // const grid = currentPage.querySelector('.grid-container');
    // const validPoints = grid?.querySelectorAll('.marked-point:not(.hint)') || [];
    // const hasPoints = validPoints.length > 0;

    // console.log(`📌 현재 페이지: ${currentPageId}, 사용자 점 수: ${validPoints.length}`);

    // btnCheck.classList.toggle('active', hasPoints);
    // btnReset.classList.toggle('active', hasPoints);

    // setTimeout(() => {
    //   console.log("⏱ 재확인: 버튼 상태 강제 동기화");
    //   const stillNoPoints = grid?.querySelectorAll('.marked-point:not(.hint)').length === 0;
    //   if (stillNoPoints) {
    //     btnCheck.classList.remove('active');
    //     btnReset.classList.remove('active');
    //     console.log("❌ 3초 후에도 점 없음 → 버튼 비활성화");
    //   }
    // }, 3000);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.paging_controller button');
    if (btn) {
      console.log("📌 paging_controller 버튼 클릭 감지됨");
      setTimeout(updateCurrentPage, 300);
    }
  });

  window.addEventListener('load', () => {
    setTimeout(updateCurrentPage, 300);
  });

  function areAnswersEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every(a1 =>
      arr2.some(a2 =>
        a1.x === a2.x && a1.y === a2.y && a1.value === a2.value
      )
    );
  }

  function showCorrectHintsForWrongAnswers(grid) {
    const userList = JSON.parse(grid.dataset.correctionValue || '[]');
    const answerList = JSON.parse(grid.dataset.answerSingle || '[]');

    const wrongAnswersToShow = [];

    answerList.forEach(ans => {
      const x = parseInt(ans.x);
      const y = parseInt(ans.y);
      const value = ans.value;

      const match = userList.find(user =>
        parseInt(user.x) === x &&
        parseInt(user.y) === y &&
        user.value === value
      );

      if (!match) {
        wrongAnswersToShow.push({ x, y, value });
      }
    });

    console.log("✅ 힌트로 보여줄 오답 정답들:", wrongAnswersToShow);

    wrongAnswersToShow.forEach(({ x, y, value }) => {
      const point = document.createElement('div');
      point.className = 'marked-point hint';
      point.setAttribute('data-x', x);
      point.setAttribute('data-y', y);
      point.setAttribute('data-correction-value', value);
      point.style.position = 'absolute';
      point.style.left = `${x}px`;
      point.style.top = `${y + 4}px`;
      point.style.width = '16px';
      point.style.height = '16px';
      point.style.borderRadius = '50%';
      point.style.backgroundColor = '#ff0000';
      point.style.display = 'flex';
      point.style.justifyContent = 'center';
      point.style.alignItems = 'center';
      point.style.pointerEvents = 'none';
      point.style.zIndex = 9999;

      const markText = document.createElement('div');
      markText.className = 'mark-text';
      markText.textContent = value;
      markText.style.color = '#ff0000';
      markText.style.fontSize = '24px';
      markText.style.fontWeight = '700';

      point.appendChild(markText);
      grid.appendChild(point);
    });
  }

  // ❌ 초기 상태에 data-correction 강제 지정 제거됨

  const gridSize = parseInt(grid.dataset.gridSize) || 40;
  grid.style.setProperty('--grid-size', `${gridSize}px`);

  const updateButtonStates = () => {
    const hasPoints = grid.querySelectorAll('.marked-point:not(.hint)').length > 0;
    btnReset.classList.toggle('active', hasPoints);
    btnCheck.classList.toggle('active', hasPoints);
  };

  grid.addEventListener('click', (e) => {
    if (popup.style.display === 'block') {
      popup.style.display = 'none';
      if (selectedPoint) {
        selectedPoint.remove();
        selectedPoint = null;
        updateButtonStates();
        return;
      }
    }
  
    const offsetX = e.offsetX;
    const offsetY = e.offsetY;
    const snappedX = Math.round(offsetX / gridSize) * gridSize;
    const snappedY = Math.round(offsetY / gridSize) * gridSize;
  
    // ✅ 같은 좌표의 기존 점 제거
    const existingPoint = grid.querySelector(`.marked-point[data-x="${snappedX}"][data-y="${snappedY}"]`);
    if (existingPoint) {
      existingPoint.remove();
    }
  
    const point = document.createElement('div');
    point.className = 'marked-point';
    point.style.left = `${snappedX}px`;
    point.style.top = `${snappedY + 4}px`;
  
    point.dataset.x = snappedX;
    point.dataset.y = snappedY;
  
    grid.appendChild(point);
    selectedPoint = point;
  
    const popupWidth = popup.offsetWidth;
    const popupHeight = popup.offsetHeight;
    const popupLeft = snappedX + grid.offsetLeft - popupWidth / 2 - 62;
    const popupTop = snappedY + grid.offsetTop - popupHeight / 2 + 30;
  
    popup.style.left = `${popupLeft}px`;
    popup.style.top = `${popupTop}px`;
    popup.style.display = 'block';
  
    updateButtonStates();
  });
  

  popup.addEventListener('click', (e) => {
    const value = e.target.dataset.value;
    if (!value || !selectedPoint) return;
  
    selectedPoint.innerHTML = '';
  
    const markText = document.createElement('div');
    markText.className = 'mark-text';
    markText.textContent = value;
    selectedPoint.appendChild(markText);
  
    selectedPoint.dataset.correctionValue = value;
  
    const x = parseInt(selectedPoint.dataset.x);
    const y = parseInt(selectedPoint.dataset.y);
  
    // 🔁 기존 correction-value 읽기
    const existing = JSON.parse(grid.getAttribute('data-correction-value') || '[]');
  
    // 🔁 같은 좌표 값이 있다면 제거 (덮어쓰기 위해)
    const filtered = existing.filter(item => !(item.x === x && item.y === y));
  
    // ➕ 새 값 추가
    filtered.push({ x, y, value });
  
    // ✅ 다시 저장
    grid.setAttribute('data-correction-value', JSON.stringify(filtered));
  
    // ✅ 정답 비교
    const answerList = JSON.parse(grid.dataset.answerSingle || '[]');
    const isCorrect = areAnswersEqual(answerList, filtered); // ← 앞에서 정의한 함수 사용
  
    grid.setAttribute('data-correction', isCorrect ? 'true' : 'false');
  
    popup.style.display = 'none';
    selectedPoint = null;
  
    updateButtonStates();
  });
  
  document.addEventListener('click', (e) => {
    const isInsidePopup = popup.contains(e.target);
    const isInsideGrid = grid.contains(e.target);
    if (popup.style.display === 'block' && !isInsidePopup && !isInsideGrid) {
      popup.style.display = 'none';
      if (selectedPoint) {
        selectedPoint.remove();
        selectedPoint = null;
        updateButtonStates();
      }
    }
  });

  let checkCount = 0; 

  btnCheck.addEventListener('click', () => {
    const currentPageId = document.querySelector("#app_wrap")?.getAttribute("data-current-page");
    if (!currentPageId) return;

    const currentPage = document.querySelector(`.page.${currentPageId}`);
    if (!currentPage) return;

    const grid = currentPage.querySelector('.grid-container');
    if (!grid) return;

    const answerList = JSON.parse(grid.dataset.answerSingle || '[]');
    const userList = JSON.parse(grid.dataset.correctionValue || '[]');

    const isCorrect = areAnswersEqual(answerList, userList);
    grid.setAttribute('data-correction', isCorrect ? 'true' : 'false');

    if (isCorrect) {
      grid.classList.remove('incorrect');
      grid.classList.add('correct');
      checkCount = 0;
    } else {
      grid.classList.remove('correct');
      grid.classList.add('incorrect');
      checkCount++;

      // ✅ 힌트는 항상 answerList 기준으로 표시
      if (checkCount === 2 && !grid.classList.contains('hint')) {
        grid.classList.add('hint');

        // 기존 힌트 삭제 후 재표시
        grid.querySelectorAll('.marked-point.hint').forEach(hint => hint.remove());

        showCorrectHintsForWrongAnswers(grid);

        const hints = grid.querySelectorAll('.marked-point.hint');
        hints.forEach(h => h.style.display = 'flex');
      }
    }

    const hasPoints = grid.querySelectorAll('.marked-point:not(.hint)').length > 0;
    btnReset.classList.toggle('active', hasPoints);
    btnCheck.classList.toggle('active', hasPoints);

    window.forceWatchEvaluation();
  });

  btnReset.addEventListener('click', () => {
    const currentPageId = document.querySelector("#app_wrap")?.getAttribute("data-current-page");
    if (!currentPageId) return;

    const currentPage = document.querySelector(`.page.${currentPageId}`);
    if (!currentPage) return;

    const grid = currentPage.querySelector('.grid-container');
    if (!grid) return;

    // 초기화 처리
    grid.querySelectorAll('.marked-point').forEach(point => point.remove());
    popup.style.display = 'none';
    selectedPoint = null;

    grid.removeAttribute('data-correction-value');
    grid.removeAttribute('data-correction');

    grid.classList.remove('correct', 'incorrect', 'hint');

    btnReset.classList.remove('active');
    btnCheck.classList.remove('active');

    // ✅ checkCount도 초기화
    checkCount = 0;

    window.forceWatchEvaluation();
  });
});

runAfterAppReady(function () {
  defineButtonClassRules([
    {
      selector: ".figure_box.grid-container", //변경될 값을 감지할 태그 설정
      //아래 중 하나 활용
      //key: "check_target", // 공통 버튼과 똑같이 결정되는 활성화 여부 결정 키
      //key: "custom_reset_btn_active", // 리셋버튼 활성화 여부 결정 키
      //key: "custom_sample_btn_active", // 예시버튼 활성화 여부 결정 키
      key: "custom_check_btn_active", // 확인버튼 활성화 여부 결정 키
      //key: "custom_submit_btn_active", // 제출버튼 활성화 여부 결정 키
      test: (el) => {
        //활성화 여부 결정 로직 true 반환하면 버튼 활성화, false 반환하면 비활성화
        //el은 타겟을 의미하는 요소
        //ex) 값이 비어있거나 null인 경우로 조건 설정한 경우 예시
        const isCorrection = $(el).attr("data-correction") !== undefined;
        return isCorrection;
      }
    },
  ]);
});