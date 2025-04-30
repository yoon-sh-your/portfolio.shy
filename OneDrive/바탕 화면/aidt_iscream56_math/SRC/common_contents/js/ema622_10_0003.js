document.addEventListener('DOMContentLoaded', function() {
  const mathField = document.querySelector('#dice_answer');
  const diceCheckBtn = document.querySelector('.dice_btn.btnCheck');
  const diceResetBtn = document.querySelector('.dice_btn.btnReset');
  const rollDiceBtn = document.querySelector('button');
  const pieces = document.querySelectorAll('.piece');
  const mainResetBtn = document.querySelector('.btn_area .btnReset');
  const mainCheckBtn = document.querySelector('.btn_area .btnCheck');
  
  let selectedPiece = null;
  let currentDiceNumber = 0;

  rollDiceBtn.addEventListener('click', function() {
      currentDiceNumber = Math.floor(Math.random() * 6) + 1;
      this.textContent = `주사위: ${currentDiceNumber}`;
      
      pieces.forEach(piece => {
          piece.classList.add('selectable');
          piece.style.pointerEvents = 'auto';
      });

      if (selectedPiece) {
          selectedPiece.classList.remove('selected');
      }
      selectedPiece = null;
      
      activateMainButtons();
  });

  pieces.forEach(piece => {
      piece.addEventListener('click', function() {
          if (!this.classList.contains('selectable')) return;
          
          if (selectedPiece) {
              selectedPiece.classList.remove('selected');
          }
          
          selectedPiece = this;
          this.classList.add('selected');
          
          let currentPos = parseInt(this.getAttribute('data-position') || '1');
          let newPosition = currentPos + currentDiceNumber;
          
          if (newPosition > 21) newPosition = 21;
          movePiece(this, newPosition === 21 ? 'end' : newPosition);
          
          pieces.forEach(p => {
              p.classList.remove('selectable');
              p.style.pointerEvents = 'none';
          });

          mathField.focus();
      });
  });

  mathField.addEventListener('input', function() {
      const hasValue = this.value.trim() !== '';
      diceCheckBtn.classList.toggle('disabled', !hasValue);
      diceResetBtn.classList.toggle('disabled', !hasValue);
      
      activateMainButtons();
  });

  function activateMainButtons() {
      mainResetBtn.classList.add('active');
      mainCheckBtn.classList.add('active');
  }

  diceResetBtn.addEventListener('click', function() {
      if (diceResetBtn.classList.contains('disabled')) return;
      
      mathField.value = '';
      diceCheckBtn.classList.add('disabled');
      diceResetBtn.classList.add('disabled');
      setTimeout(activateMainButtons, 0);
  });

  diceCheckBtn.addEventListener('click', function() {
      if (diceCheckBtn.classList.contains('disabled')) return;
      
      mathField.value = '';
      currentDiceNumber = 0;
      rollDiceBtn.textContent = '주사위 굴리기';
      diceCheckBtn.classList.add('disabled');
      diceResetBtn.classList.add('disabled');
      setTimeout(activateMainButtons, 0);
  });

  function resetAll() {
      mathField.value = '';
      currentDiceNumber = 0;
      rollDiceBtn.textContent = '주사위 굴리기';
      
      pieces.forEach(piece => {
          piece.classList.remove('selectable', 'selected');
          piece.style.pointerEvents = 'none';
          if (piece.classList.contains('piece1')) {
              piece.style.top = '20%';
              piece.style.left = 'calc(10% - 55px)';
          } else {
              piece.style.top = '20%';
              piece.style.left = 'calc(10% + 70px)';
          }
          piece.setAttribute('data-position', '1');
      });
      
      selectedPiece = null;
      mainResetBtn.classList.remove('active');
      mainCheckBtn.classList.remove('active');
      diceCheckBtn.classList.add('disabled');
      diceResetBtn.classList.add('disabled');
  }

  mainResetBtn.addEventListener('click', resetAll);
  mainCheckBtn.addEventListener('click', resetAll);

  function movePiece(piece, position) {
      piece.style.transition = 'all 0.5s ease';
      
      const targetCell = document.querySelector(`.pos-${position}`);
      if (targetCell) {
          const cellRect = targetCell.getBoundingClientRect();
          const boardRect = document.querySelector('.board_cells').getBoundingClientRect();
          
          const topPercent = ((cellRect.top - boardRect.top) / boardRect.height) * 100;
          const leftPercent = ((cellRect.left - boardRect.left) / boardRect.width) * 100;
          const offsetX = piece.classList.contains('piece1') ? -32 : 32;
          
          piece.style.top = `${topPercent}%`;
          piece.style.left = `calc(${leftPercent}% + ${offsetX}px)`;
      }
      
      piece.setAttribute('data-position', position === 'end' ? '21' : position);
  }
});