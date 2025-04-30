document.addEventListener('DOMContentLoaded', function() {
    const cardDrawBtn = document.querySelector('.card_btn:first-child');
    const cardToggleBtn = document.querySelector('.card_btn:nth-child(2)');
    const cardPreview = document.querySelector('.card_preview');
    const cardPreviewImg = document.querySelector('.card_preview_img');
    const minusBtn = document.querySelector('.control_wrap > div:first-child');
    const plusBtn = document.querySelector('.control_wrap > div:last-child');
    const actionWrap = document.querySelector('.action_wrap');
    const resetBtn = document.querySelector('.btnReset');
    const checkBtn = document.querySelector('.btnCheck');
    const cardPreviewFrame = document.querySelector('.card_preview_frame');
    
    let blockCount = 1; 
    let zIndexCounter = 1; 

    updateUI();

    cardToggleBtn.classList.add('disabled');

    function activateButtons() {
      resetBtn.classList.add('active');
      checkBtn.classList.add('active');
    }

    cardDrawBtn.addEventListener('click', function() {
      const randomNum = Math.floor(Math.random() * 8) + 1;
      cardPreviewImg.innerHTML = `
        <img src="../../common_contents/img/EMA623_09_SU/623_boxs_${randomNum}.png" alt="boxs">
      `;
      
      cardPreviewFrame.style.display = 'none';
      cardPreview.style.display = 'flex';
      
      cardPreview.classList.add('flipped');
      
      cardToggleBtn.textContent = '카드 보기';
      
      cardToggleBtn.classList.remove('disabled');
      cardToggleBtn.classList.add('highlight');
      activateButtons();
    });
    
    cardToggleBtn.addEventListener('click', function() {
      if (!cardToggleBtn.classList.contains('disabled')) {
        if (cardPreview.classList.contains('flipped')) {
          cardPreview.classList.remove('flipped');
          cardToggleBtn.textContent = '카드 가리기';
        } else {
          cardPreview.classList.add('flipped');
          cardToggleBtn.textContent = '카드 보기';
        }
        
        cardToggleBtn.classList.remove('highlight');
        activateButtons();
      }
    });

    plusBtn.addEventListener('click', function() {
      if (blockCount < 27) {
        blockCount++;
        addBlock();
        updateUI();
      }
    });

    minusBtn.addEventListener('click', function() {
      if (blockCount > 1) {
        blockCount--;
        removeBlock();
        updateUI();
      }
    });

    resetBtn.addEventListener('click', function() {
      location.reload();
    });

    function updateUI() {
      minusBtn.style.visibility = blockCount > 1 ? 'visible' : 'hidden';
      plusBtn.style.visibility = blockCount < 27 ? 'visible' : 'hidden';
    }

    function addBlock() {
      const box = document.createElement('div');
      box.className = 'box';
      box.innerHTML = `
        <div class="face front"></div>
        <div class="face top"></div>
        <div class="face left"></div>
        <div class="face right"></div>
        <div class="face back"></div>
        <div class="face bottom"></div>
      `;
      box.style.position = 'absolute';
      box.style.cursor = 'grab';

      const row = (blockCount - 1) % 3;
      const layer = Math.floor((blockCount - 1) / 3);

      const leftPercent = 0;
      const topPercent = (row * 10 + layer * 10);

      box.style.left = `${leftPercent}%`; 
      box.style.top = `${topPercent}%`;
      box.style.zIndex = zIndexCounter++; 

      activateButtons();
      makeDraggable(box);
      actionWrap.appendChild(box);
    }

    function removeBlock() {
      const lastBlock = actionWrap.lastElementChild;
      if (lastBlock) {
        actionWrap.removeChild(lastBlock);
      }
    }

    function makeDraggable(element) {
      let offsetX, offsetY, initialX, initialY;
      let startLeft, startTop;

      element.addEventListener('mousedown', function(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        
        const elemRect = element.getBoundingClientRect();
        const wrapRect = actionWrap.getBoundingClientRect();
        startLeft = (elemRect.left - wrapRect.left) / wrapRect.width * 100;
        startTop = (elemRect.top - wrapRect.top) / wrapRect.height * 100;
        
        offsetX = startLeft;
        offsetY = startTop;
        
        element.style.cursor = 'grabbing';
        element.style.zIndex = zIndexCounter++; 

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
      });

      function drag(e) {
        const wrapRect = actionWrap.getBoundingClientRect();
        
        const dx = (e.clientX - initialX) / wrapRect.width * 100;
        const dy = (e.clientY - initialY) / wrapRect.height * 100;
        
        const newLeft = offsetX + dx;
        const newTop = offsetY + dy;
        
        const elemRect = element.getBoundingClientRect();
        const maxLeft = 100 - (elemRect.width / wrapRect.width * 100);
        const maxTop = 100 - (elemRect.height / wrapRect.height * 100);

        element.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}%`;
        element.style.top = `${Math.max(0, Math.min(newTop, maxTop))}%`;
      }

      function stopDrag() {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        element.style.cursor = 'grab';

        snapToClosestElement(element);
      }
    }

    function snapToClosestElement(currentElement) {
      const elements = document.querySelectorAll('.action_wrap .box');
      const SNAP_THRESHOLD = 10;
      
      const wrapRect = actionWrap.getBoundingClientRect();
      const currentRect = currentElement.getBoundingClientRect();
      const currentX = (currentRect.left - wrapRect.left) / wrapRect.width * 100;
      const currentY = (currentRect.top - wrapRect.top) / wrapRect.height * 100;

      let closestElement = null;
      let minDistance = Infinity;
      let closestFace = null;

      elements.forEach(target => {
        if (target === currentElement) return;

        const targetRect = target.getBoundingClientRect();
        const targetX = (targetRect.left - wrapRect.left) / wrapRect.width * 100;
        const targetY = (targetRect.top - wrapRect.top) / wrapRect.height * 100;
        
        const boxWidth = targetRect.width / wrapRect.width * 100;
        const boxHeight = targetRect.height / wrapRect.height * 100;

        const snapPoints = [
          { x: targetX - boxWidth, y: targetY, face: 'right-left' },  
          { x: targetX + boxWidth, y: targetY, face: 'left-right' },  
          { x: targetX, y: targetY - boxHeight, face: 'bottom-top' }  
        ];

        snapPoints.forEach(point => {
          const dx = point.x - currentX;
          const dy = point.y - currentY;
          const distance = Math.hypot(dx, dy);

          if (distance < SNAP_THRESHOLD && distance < minDistance) {
            minDistance = distance;
            closestElement = target;
            closestFace = point.face;
          }
        });
      });

      if (closestElement) {
        const targetRect = closestElement.getBoundingClientRect();
        const targetX = (targetRect.left - wrapRect.left) / wrapRect.width * 100;
        const targetY = (targetRect.top - wrapRect.top) / wrapRect.height * 100;
        const boxWidth = targetRect.width / wrapRect.width * 100;
        const boxHeight = targetRect.height / wrapRect.height * 100;
        
        const offsets = {
          'right-left': { x: boxWidth * -0.2, y: 3.4 },
          'left-right': { x: -boxWidth * 0.2, y: 3 }, 
          'bottom-top': { x: -1.7, y: -boxHeight * -0.4 } 
        };
        
        let newLeft, newTop;
        
        switch (closestFace) {
          case 'right-left':
            newLeft = targetX - boxWidth + offsets['right-left'].x;
            newTop = targetY + offsets['right-left'].y;
            break;
          case 'left-right':
            newLeft = targetX + boxWidth + offsets['left-right'].x;
            newTop = targetY + offsets['left-right'].y;
            break;
          case 'bottom-top':
            newLeft = targetX + offsets['bottom-top'].x;
            newTop = targetY - boxHeight + offsets['bottom-top'].y;
            break;
        }
        
        // 부드러운 애니메이션 적용
        currentElement.style.transition = 'all 0.15s cubic-bezier(0.2, 0.8, 0.4, 1.2)';
        currentElement.style.left = `${newLeft}%`;
        currentElement.style.top = `${newTop}%`;
        
        setTimeout(() => {
          currentElement.style.transition = '';
        }, 150);
      }
    }

    document.querySelectorAll('.grid-item').forEach(item => {
      item.addEventListener('click', function() {
        this.classList.toggle('colored');
      });
    });

    checkBtn.addEventListener('click', function() {
      if (checkBtn.classList.contains('active')) {
          toastCheckMsg('다시 시도해보세요.', 2, false);
      }
    });

    window.addEventListener('resize', function() {
    });
  });