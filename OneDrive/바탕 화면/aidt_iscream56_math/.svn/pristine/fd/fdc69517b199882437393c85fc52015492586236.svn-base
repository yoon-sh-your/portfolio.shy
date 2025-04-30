document.addEventListener('DOMContentLoaded', function() {
  const diceButton = document.querySelector('.left_area > button');
  const radiusField = document.querySelector('.left_area .answer_wrap > div:first-child .input_wrap math-field');
  const areaField = document.querySelector('.left_area .answer_wrap > div:nth-child(2) .input_wrap math-field');
  const resultField = document.querySelector('.left_area .answer_wrap > div:last-child .input_wrap math-field');
  const leftResetBtn = document.querySelector('.left_reset_btn');
  const leftCheckBtn = document.querySelector('.left_check_btn');
  const checkBtn = document.querySelector('.btnCheck');
  const resetBtn = document.querySelector('.btnReset');
  const rightRadiusField = document.querySelector('.right_area .answer_wrap > div:first-child .input_wrap math-field');
  const rightAreaField = document.querySelector('.right_area .answer_wrap > div:nth-child(2) .input_wrap math-field');
  const rightResultField = document.querySelector('.right_area .answer_wrap > div:last-child .input_wrap math-field');
  
  const gridContainer = document.querySelector('.grid_container');
  let currentRadius = 0;
  
  if (rightRadiusField) rightRadiusField.readOnly = true;
  if (rightAreaField) rightAreaField.readOnly = true;
  if (rightResultField) rightResultField.readOnly = true;
  
  if (radiusField) radiusField.readOnly = true;
  if (resultField) resultField.readOnly = true;
  
  const paletteContainer = document.createElement('div');
  paletteContainer.className = 'palette_container';
  paletteContainer.style.display = 'none';
  paletteContainer.innerHTML = `
    <img src="./../../common_contents/img/EMA625_10_SU/625_palette.svg" alt="palette" class="palette_image">
    <div class="color_circle yellow" data-color="#FFDE6A"></div>
    <div class="color_circle blue" data-color="#07BBA9"></div>
  `;
  gridContainer.appendChild(paletteContainer);
  
  diceButton.addEventListener('click', function() {
    const randomNum = Math.floor(Math.random() * 6) + 1;
    currentRadius = randomNum;
    
    checkBtn.classList.add('active');
    resetBtn.classList.add('active');

    const activeCircle = document.querySelector('.circle:not(.placed)');
    if (activeCircle) {
      activeCircle.remove();
    }
    
    if (radiusField) {
      radiusField.value = randomNum.toString();
    }
  });
  
  if (areaField) {
    areaField.addEventListener('input', function() {
      leftResetBtn.disabled = !areaField.value;
      leftCheckBtn.disabled = !areaField.value;
    });
  }
  
  leftCheckBtn.addEventListener('click', function() {
    const userArea = parseFloat(areaField.value);
    const correctArea = Math.PI * Math.pow(currentRadius, 2);
    const userAreaInt = Math.floor(userArea);
    const correctAreaInt = Math.floor(correctArea);
    
    leftResetBtn.disabled = true;
    leftCheckBtn.disabled = true;
    
    if (resultField) {
      resultField.value = correctArea.toFixed(2);
    }
    
    if (userAreaInt !== correctAreaInt) {
      return;
    }
    const activeCircle = document.querySelector('.circle:not(.placed)');

    if (activeCircle) {
      activeCircle.remove();
    }
    createCircle(currentRadius);
    paletteContainer.style.display = 'block';
  });
  
  function createCircle(radius) {
    const circle = document.createElement('div');
    circle.className = 'circle';
    
    const diameter = radius * 15 * 2;
    circle.style.width = diameter + 'px';
    circle.style.height = diameter + 'px';
    circle.style.borderRadius = '50%';
    circle.style.position = 'absolute';
    circle.style.left = '50%';
    circle.style.top = '50%';
    circle.style.transform = 'translate(-50%, -50%)';
    circle.style.border = '2px solid #000000';
    circle.style.backgroundColor = 'transparent';
    circle.style.cursor = 'move';
    
    gridContainer.appendChild(circle);
    
    positionPalette(radius);
    
    let isDragging = false;
    let startPosX, startPosY;
    let startMouseX, startMouseY;
    
    function checkCircleCollision(circle1, circle2) {
      const rect1 = circle1.getBoundingClientRect();
      const rect2 = circle2.getBoundingClientRect();
      const center1X = rect1.left + rect1.width / 2;
      const center1Y = rect1.top + rect1.height / 2;
      const center2X = rect2.left + rect2.width / 2;
      const center2Y = rect2.top + rect2.height / 2;
      const dx = center1X - center2X;
      const dy = center1Y - center2Y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (rect1.width + rect2.width) / 2;
      
      return distance < minDistance;
    }
    
    let originalLeft, originalTop;
    
    circle.addEventListener('mousedown', function(e) {
      originalLeft = parseFloat(circle.style.left);
      originalTop = parseFloat(circle.style.top);
      isDragging = true;
      
      const style = window.getComputedStyle(circle);
      startPosX = parseInt(style.left);
      startPosY = parseInt(style.top);
      startMouseX = e.clientX;
      startMouseY = e.clientY;
      
      e.preventDefault();
    });
    
    gridContainer.addEventListener('mousemove', function(event) {
      if (!isDragging) return;
      
      const dx = event.clientX - startMouseX;
      const dy = event.clientY - startMouseY;
      const newLeft = startPosX + dx;
      const newTop = startPosY + dy;
      const radiusPx = diameter / 2;
      const containerWidth = gridContainer.clientWidth;
      const containerHeight = gridContainer.clientHeight;
      const limitedLeft = Math.max(radiusPx, Math.min(newLeft, containerWidth - radiusPx));
      const limitedTop = Math.max(radiusPx, Math.min(newTop, containerHeight - radiusPx));
      const tempLeft = circle.style.left;
      const tempTop = circle.style.top;
      circle.style.left = limitedLeft + 'px';
      circle.style.top = limitedTop + 'px';
      
      let willCollide = false;
      const placedCircles = document.querySelectorAll('.circle.placed');
      for (let i = 0; i < placedCircles.length; i++) {
        if (placedCircles[i] !== circle && checkCircleCollision(circle, placedCircles[i])) {
          willCollide = true;
          break;
        }
      }
      
      if (willCollide) {
        circle.style.left = tempLeft;
        circle.style.top = tempTop;
      } else {
        circle.style.left = limitedLeft + 'px';
        circle.style.top = limitedTop + 'px';
      }
      paletteContainer.style.top = (limitedTop + radiusPx + 10) + 'px';
      paletteContainer.style.left = limitedLeft + 'px';
    });
    
    document.addEventListener('mouseup', function() {
      isDragging = false;
    });
    
    document.querySelectorAll('.color_circle').forEach(colorCircle => {
      colorCircle.onclick = function() {
        const color = this.getAttribute('data-color');
        const activeCircle = document.querySelector('.circle:not(.placed)');
        if (activeCircle) {
          activeCircle.style.border = `2px solid ${color}`;
          activeCircle.classList.add('placed');
          paletteContainer.style.display = 'none';
        }
      };
    });
    
    return circle;
  }
  
  function positionPalette(radius) {
    const radiusPx = radius * 15;
    paletteContainer.style.position = 'absolute';
    paletteContainer.style.top = `calc(50% + ${radiusPx}px + 10px)`;
    paletteContainer.style.left = '50%';
    paletteContainer.style.transform = 'translateX(-50%)';
  }
  
  leftResetBtn.addEventListener('click', function() {
    if (areaField) areaField.value = '';
    
    leftResetBtn.disabled = true;
    leftCheckBtn.disabled = true;
  });
  
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      window.location.reload();
    });
  }

  checkBtn.addEventListener('click', function() {
    if (checkBtn.classList.contains('active')) {
        toastCheckMsg('다시 시도해보세요.', 2, false);
    }
  });
});