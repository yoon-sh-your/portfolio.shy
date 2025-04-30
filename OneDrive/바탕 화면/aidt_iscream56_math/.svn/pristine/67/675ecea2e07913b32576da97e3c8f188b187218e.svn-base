document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.querySelector('.btn_area .btnReset');
    const checkBtn = document.querySelector('.btn_area .btnCheck');
    
    resetBtn.classList.remove('active');
    checkBtn.classList.remove('active');
    
    const style = document.createElement('style');
    style.textContent = `
      .btnReset:not(.active), .btnCheck:not(.active) {
        opacity: 0.5;
        pointer-events: none;
      }
      .btnReset.active, .btnCheck.active {
        opacity: 1;
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);
    
    const cardContents = [
      { ratio: "0.6667", text: "2:3" },
      { ratio: "0.6667", text: "4:6" },
      { ratio: "0.6667", text: "0.6:0.9" },
      { ratio: "0.6667", text: "12:18" },
      { ratio: "0.6667", text: "0.4:0.6" },
      
      { ratio: "2.5", text: "5:2" },
      { ratio: "2.5", text: "10:4" },
      { ratio: "2.5", text: "100:40" },
      { ratio: "2.5", text: "1.5:0.6" },
      { ratio: "2.5", text: "1/2:1/5" },
      
      { ratio: "4", text: "4:1" },
      { ratio: "4", text: "40:10" },
      { ratio: "4", text: "0.8:0.2" },
      { ratio: "4", text: "1:1/4" },
      { ratio: "4", text: "8:2" },
      
      { ratio: "0.2857", text: "2:7" },
      { ratio: "0.2857", text: "1/7:1/2" },
      { ratio: "0.2857", text: "1.4:4.9" },
      { ratio: "0.2857", text: "12:42" },
      { ratio: "0.2857", text: "4:14" },
      
      { ratio: "2", text: "1/2:1/4" },
      { ratio: "2", text: "1:0.5" },
      { ratio: "2", text: "2:1" },
      { ratio: "2", text: "0.4:0.2" },
      { ratio: "2", text: "6:3" }
    ];
    
    const cardGrid = document.querySelector('.card_grid');
    cardGrid.innerHTML = '';
    
    const ratioGroups = ["0.6667", "2.5", "4", "0.2857", "2"];
    let cardsToAdd = [];
    
    ratioGroups.forEach((ratio, rowIndex) => {
      const cardsWithRatio = cardContents.filter(card => card.ratio === ratio);
      
      const shuffled = [...cardsWithRatio].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);
      
      selected.forEach(card => {
        cardsToAdd.push({
          ...card,
          row: rowIndex
        });
      });
    });
    
    cardsToAdd = cardsToAdd.sort(() => 0.5 - Math.random());
    
    cardsToAdd.forEach(cardInfo => {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-ratio', cardInfo.ratio);
      card.setAttribute('data-row', cardInfo.row);
      
      const originalFormat = formatRatioWithFractions(cardInfo.text, false);
      
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="../../common_contents/img/EMA624_10_SU/624_card_1.png" alt="카드">
          </div>
          <div class="card-back">
            <img src="../../common_contents/img/EMA624_10_SU/624_card_2.png" alt="카드 뒷면">
            <div class="card-content">${originalFormat}</div>
          </div>
        </div>
      `;
      
      cardGrid.appendChild(card);
    });
    
    const cards = document.querySelectorAll('.card[data-ratio]');
    const tableRows = document.querySelectorAll('.proportion_table tr');
    let flippedCards = [];
    let matchedPairs = 0;
    let gameActive = true;
    
    // 활성화 함수
    function activateMainButtons() {
      resetBtn.classList.add('active');
      checkBtn.classList.add('active');
    }
    
    cards.forEach(card => {
      card.addEventListener('click', function() {
        if (!gameActive || this.classList.contains('matched') || this.classList.contains('flipped') || flippedCards.length >= 2) {
          return;
        }
        
        activateMainButtons();
        
        this.classList.add('flipped');
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
          gameActive = false;
          
          setTimeout(() => {
            const ratio1 = flippedCards[0].getAttribute('data-ratio');
            const ratio2 = flippedCards[1].getAttribute('data-ratio');
            
            if (ratio1 === ratio2) {
              flippedCards.forEach(card => {
                card.classList.add('matched');
              });
              
              const matchedTexts = flippedCards.map(card => 
                card.querySelector('.card-content').innerHTML
              );
              
              const rowIndex = Math.floor(matchedPairs / 2); 
              const colIndex = matchedPairs % 2; 
              
              if (rowIndex < tableRows.length) {
                const row = tableRows[rowIndex];
                const cells = row.querySelectorAll('td');
                
                const fullEquation = `${formatRatioWithFractions(flippedCards[0].querySelector('.card-content').innerHTML, true)}<span class="equals">&nbsp;=&nbsp;</span>${formatRatioWithFractions(flippedCards[1].querySelector('.card-content').innerHTML, true)}`;
                cells[colIndex].innerHTML = fullEquation;
              }
              
              matchedPairs++;
              flippedCards = [];
              gameActive = true;
            } else {
              setTimeout(() => {
                flippedCards.forEach(card => {
                  card.classList.remove('flipped');
                });
                flippedCards = [];
                gameActive = true;
              }, 1000);
            }
          }, 1000);
        }
      });
    });
    
    resetBtn.addEventListener('click', function() {
      if (resetBtn.classList.contains('active')) {
        location.reload();
      }
    });
  });

  function formatRatioWithFractions(text, useWiderSpacing = false) {
    if (!text.includes(':')) return text;
    
    if (text.includes('<div class="fraction">')) return text;
    
    const parts = text.split(':');
    let left = parts[0];
    let right = parts[1];
    
    if (left.includes('.') || right.includes('.') || left.includes('/') || right.includes('/')) {
      if (left.includes('/')) {
        const fractionParts = left.split('/');
        left = `<div class="fraction">
                  <div class="numerator">${fractionParts[0]}</div>
                  <div class="denominator">${fractionParts[1]}</div>
                </div>`;
      } else if (left.includes('.')) {
        const [numerator, denominator] = decimalToFraction(parseFloat(left));
        left = `<div class="fraction">
                  <div class="numerator">${numerator}</div>
                  <div class="denominator">${denominator}</div>
                </div>`;
      }
      
      if (right.includes('/')) {
        const fractionParts = right.split('/');
        right = `<div class="fraction">
                   <div class="numerator">${fractionParts[0]}</div>
                   <div class="denominator">${fractionParts[1]}</div>
                 </div>`;
      } else if (right.includes('.')) {
        const [numerator, denominator] = decimalToFraction(parseFloat(right));
        right = `<div class="fraction">
                   <div class="numerator">${numerator}</div>
                   <div class="denominator">${denominator}</div>
                 </div>`;
      }
      
      return useWiderSpacing ? 
        `${left}<span class="ratio-separator">&nbsp;:&nbsp;</span>${right}` : 
        `${left}:${right}`;
    }
    
    return useWiderSpacing ? 
      `${left}<span class="ratio-separator">&nbsp;:&nbsp;</span>${right}` : 
      `${left}:${right}`;
  }

  function decimalToFraction(decimal) {
    const precision = 1000; 
    
    let numerator = Math.round(decimal * precision);
    let denominator = precision;
    
    const gcd = findGCD(numerator, denominator);
    numerator = numerator / gcd;
    denominator = denominator / gcd;
    
    return [numerator, denominator];
  }

  function findGCD(a, b) {
    return b ? findGCD(b, a % b) : a;
  }