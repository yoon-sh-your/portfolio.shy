document.addEventListener('DOMContentLoaded', function() {
  const dropdown1 = document.getElementById('dropdown1');
  const dropdown2 = document.getElementById('dropdown2');
  const dropdown3 = document.getElementById('dropdown3');
  const flipBtn = document.querySelector('.card_preview button');
  const cardPreviewDisplay = document.querySelectorAll('.card_preview')[1];
  const getCardBtns = document.querySelectorAll('.get_card_btn');
  const cards = document.querySelectorAll('.card');
  const btnReset = document.querySelector('.btnReset');
  const btnCheck = document.querySelector('.btnCheck');
  
  let isPageModified = false;
  
  const cardImages = [];
  for (let i = 1; i <= 16; i++) {
    cardImages.push(`../../common_contents/img/EMA626_09_SU/626_shape_${i}.png`);
  }
  
  let currentCard = null;
  
  function activateActionButtons() {
    if (!isPageModified) {
      isPageModified = true;
      btnReset.classList.add('active');
      btnCheck.classList.add('active');
    }
  }
  
  btnReset.addEventListener('click', function() {
    if (btnReset.classList.contains('active')) {
      dropdown1.selectedIndex = 0;
      resetDropdown(dropdown2);
      resetDropdown(dropdown3);
      dropdown2.disabled = true;
      dropdown3.disabled = true;
      
      cardPreviewDisplay.innerHTML = '';
      currentCard = null;
      
      cards.forEach(card => {
        card.innerHTML = '';
        card.classList.remove('has-2-stack', 'has-3-stack');
      });
      document.querySelectorAll('.card_count').forEach(count => {
        count.textContent = '0';
      });
      
      flipBtn.disabled = true;
      getCardBtns.forEach(btn => {
        btn.disabled = true;
      });
      
      isPageModified = false;
      btnReset.classList.remove('active');
      btnCheck.classList.remove('active');
    }
  });
  
  dropdown1.addEventListener('change', function() {
    resetDropdown(dropdown2);
    resetDropdown(dropdown3);
    
    dropdown2.disabled = false;
    setAvailableOptions(dropdown2, [dropdown1.value]);
    
    dropdown3.disabled = true;
    activateActionButtons();
  });
  
  dropdown2.addEventListener('change', function() {
    resetDropdown(dropdown3);
    
    dropdown3.disabled = false;
    setAvailableOptions(dropdown3, [dropdown1.value, dropdown2.value]);
    activateActionButtons();
  });
  
  dropdown3.addEventListener('change', function() {
    if (dropdown1.value && dropdown2.value && dropdown3.value) {
      flipBtn.disabled = false;
    }
    activateActionButtons();
  });
  
  flipBtn.addEventListener('click', function() {
    if (!flipBtn.disabled) {
      const randomIndex = Math.floor(Math.random() * cardImages.length);
      const randomImage = cardImages[randomIndex];
      
      cardPreviewDisplay.innerHTML = `<img src="${randomImage}" alt="Random Shape" style="width:100%; height:100%; object-fit:contain;">`;
      
      currentCard = randomImage;
      getCardBtns.forEach(btn => btn.disabled = false);
      activateActionButtons();
    }
  });
  
  getCardBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      if (!btn.disabled && currentCard) {
        const card = cards[index];
        card.innerHTML = `<img src="${currentCard}" alt="Card" style="width:100%; height:100%; object-fit:contain;">`;
        
        const countElement = this.nextElementSibling.querySelector('.card_count');
        const cardCount = parseInt(countElement.textContent) + 1;
        countElement.textContent = cardCount;
        
        if (cardCount == 2) {
          card.classList.add('has-2-stack');
        }
        
        if (cardCount >= 3) {
          card.classList.add('has-3-stack');
        }
        
        cardPreviewDisplay.innerHTML = '';
        currentCard = null;
        getCardBtns.forEach(btn => btn.disabled = true);
        activateActionButtons();
      }
    });
  });
  
  function resetDropdown(dropdown) {
    dropdown.selectedIndex = 0;
    
    while (dropdown.options.length > 1) {
      dropdown.remove(1);
    }
    
    const options = ['원기둥', '원뿔', '구'];
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      dropdown.appendChild(opt);
    });
  }
  
  function setAvailableOptions(dropdown, excludeValues) {
    while (dropdown.options.length > 1) {
      dropdown.remove(1);
    }
    
    const options = ['원기둥', '원뿔', '구'];
    options.forEach(option => {
      if (!excludeValues.includes(option)) {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        dropdown.appendChild(opt);
      }
    });
  }
});