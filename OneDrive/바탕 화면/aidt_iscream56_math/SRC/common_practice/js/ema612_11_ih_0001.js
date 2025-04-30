runAfterAppReady(() => {
    const puzzle = [
      ['선', '행', '사', '다', '리', '꼴', '평'],
      ['분', '칠', '직', '십', '각', '뿔', '행'],
      ['사', '각', '형', '자', '겨', '복', '모'],
      ['각', '기', '둥', '냥', '꼭', '십', '서'],
      ['이', '둥', '도', '팔', '전', '짓', '리'],
      ['수', '각', '형', '개', '나', '리', '점'],
      ['선', '다', '도', '수', '높', '이', '칠']
    ];
  
    let html = '';
    puzzle.forEach((row, rowIndex) => {
      row.forEach((char, colIndex) => {
        html += `<div class="hit-area" data-row="${rowIndex}" data-col="${colIndex}" data-char="${char}"></div>\n`;
      });
    });
    document.querySelector('.drag_area').innerHTML += html;
  
    let dragPath = [];
    let isDragging = false;
    let direction = null;
    let currentInputIndex = 0;
    const maxInputCount = 5;
    const scale =  globalScale || 1;
  
    const hitAreas = document.querySelectorAll('.hit-area');
  
    function startDrag(el) {
      dragPath = [el];
      isDragging = true;
      direction = null;
      el.classList.add('selected');
    }
  
    function continueDrag(el) {
      if (!isDragging) return;
  
      const existingIndex = dragPath.indexOf(el);
      if (existingIndex !== -1) {
        for (let i = existingIndex + 1; i < dragPath.length; i++) {
          dragPath[i].classList.remove('selected');
        }
        dragPath = dragPath.slice(0, existingIndex + 1);
        return;
      }
  
      const curRow = parseInt(el.dataset.row);
      const curCol = parseInt(el.dataset.col);
      const lastEl = dragPath[dragPath.length - 1];
      const lastRow = parseInt(lastEl.dataset.row);
      const lastCol = parseInt(lastEl.dataset.col);
      const dRow = curRow - lastRow;
      const dCol = curCol - lastCol;
  
      if (direction === null && dragPath.length === 1) {
        const angle = Math.atan2(dRow, dCol) * 180 / Math.PI;
        const absAngle = Math.abs(angle);
        if ((absAngle <= 22.5) || (absAngle >= 157.5)) direction = 'horizontal';
        else if (absAngle > 67.5 && absAngle < 112.5) direction = 'vertical';
        else direction = 'diagonal';
      }
  
      const isValid =
        (direction === 'horizontal' && dRow === 0 && Math.abs(dCol) === 1) ||
        (direction === 'vertical' && dCol === 0 && Math.abs(dRow) === 1) ||
        (direction === 'diagonal' && Math.abs(dRow) === 1 && Math.abs(dCol) === 1);
  
      if (!isValid) return;
  
      if ((direction === 'vertical' || direction === 'diagonal')) {
        const alreadyInRow = dragPath.some(el => parseInt(el.dataset.row) === curRow);
        if (alreadyInRow) return;
      }
  
      dragPath.push(el);
      el.classList.add('selected');
    }
  
    hitAreas.forEach(el => {
      let enterTimer = null;
  
      el.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        startDrag(el);
      });
  
      el.addEventListener('mouseenter', () => {
        clearTimeout(enterTimer);
        enterTimer = setTimeout(() => continueDrag(el), 40);
      });
  
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrag(el);
      });
  
      el.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains('hit-area')) {
          continueDrag(target);
        }
      });
    });
  
    function finishDrag() {
      if (!isDragging || dragPath.length < 2) return;
      isDragging = false;
  
      const container = document.querySelector('.drag_area');
      const existingOvals = container.querySelectorAll('.word-oval');
      if (existingOvals.length >= 5) return;
  
      const word = dragPath.map(el => el.dataset.char).join('');
      const target = document.querySelector(`#custom_target0${currentInputIndex + 1}`);
      const answer = target.dataset.answerSingle;
  
      if (target) {
        target.value = word;
        target.dispatchEvent(new Event('input', { bubbles: true }));
      }
  
      const first = dragPath[0];
      const last = dragPath[dragPath.length - 1];
  
      const rect1 = first.getBoundingClientRect();
      const rect2 = last.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
  
      const left1 = rect1.left - containerRect.left;
      const top1 = rect1.top - containerRect.top;
      const left2 = rect2.left - containerRect.left;
      const top2 = rect2.top - containerRect.top;
  
      const rawWidth = Math.abs(left2 - left1) + rect1.width;
      const rawHeight = Math.abs(top2 - top1) + rect1.height;
  
      let adjustedWidth = rawWidth;
      let adjustedHeight = rawHeight;
      let applyRotation = false;
  
      if (direction === 'diagonal') {
        adjustedWidth = 32 * scale;
        adjustedHeight = rawHeight * 1.25;
        applyRotation = true;
      }
  
      const centerX = (left1 + left2 + rect1.width) / 2;
      const centerY = (top1 + top2 + rect1.height) / 2;
      const angleDeg = -Math.atan2(top2 - top1, left2 - left1) * 180 / Math.PI;
  
      const oval = document.createElement('div');
      oval.className = 'word-oval';
      oval.style.position = 'absolute';
      oval.style.width = `${adjustedWidth / scale}px`;
      oval.style.height = `${adjustedHeight / scale}px`;
      oval.style.left = `${(centerX - adjustedWidth / 2) / scale}px`;
      oval.style.top = `${(centerY - adjustedHeight / 2) / scale}px`;
      oval.style.border = '4px solid #000';
      oval.style.borderRadius = '30px';
      oval.style.boxSizing = 'border-box';
      oval.style.pointerEvents = 'none';
      oval.style.zIndex = '10';
      oval.setAttribute('data-index', currentInputIndex + 1);
  
      if (applyRotation) {
        oval.style.transform = `rotate(${angleDeg}deg)`;
      }
  
      container.appendChild(oval);
  
      setTimeout(() => {
        const inputRow = document.querySelector(`.input_row[data-index="${currentInputIndex}"]`);
        if (word === answer) {
          oval.classList.add('correct');
          inputRow?.classList.add('correct');
        } else {
          oval.classList.add('fail');
          inputRow?.classList.add('fail');
        }
      }, 0);
  
      currentInputIndex++;
      dragPath.forEach(el => el.classList.remove('selected'));
      dragPath = [];
      direction = null;
    }
  
    document.addEventListener('mouseup', finishDrag);
    document.addEventListener('touchend', finishDrag);
  
    document.querySelector('.btnReset')?.addEventListener('click', () => {
      document.querySelectorAll('.word-oval').forEach(el => el.remove());
      dragPath = [];
      direction = null;
      currentInputIndex = 0;
      document.querySelectorAll('.input_row').forEach(list => 
        list.classList.remove('on')
      );
    });



  });
  
  document.addEventListener("DOMContentLoaded", () => {
    // 커스텀 정답 조건
    window.onCorrectCustom = function () {
      $('.word-oval').addClass('on');
      $('.input_row').addClass('on');
    };
    window.onIncorrectTwiceCustom = function (el) {
      $('.word-oval').addClass('on');
      $('.input_row').addClass('on');
    };
  });
  
