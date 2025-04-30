document.addEventListener("DOMContentLoaded", () => {
    const cardDummyBtn = document.querySelector('.btn_card_dummy');
    const cardCondition = document.querySelector('.card_condition');
    const cardOpens = document.querySelectorAll('.btn_card_open');
    const mathFields = document.querySelectorAll('math-field[data-answer-single="정답"]');
    const resultInput = document.querySelector('.calc_result_input');
    const btnReset = document.querySelector('.btnReset');
    
    btnReset.classList.remove('active');
    
    mathFields.forEach(field => {
        field.setAttribute('disabled', true);
    });
    resultInput.setAttribute('disabled', true);
    
    const conditions = [
        { text: "(대분수) × (자연수)", subText: "※ 수 카드를 4장 뽑아요.", count: 4 },
        { text: "(자연수) × (진분수)", subText: "※ 수 카드를 3장 뽑아요.", count: 3 },
        { text: "(진분수) × (진분수)", subText: "※ 수 카드를 4장 뽑아요.", count: 4 },
        { text: "(대분수) × (대분수)", subText: "※ 수 카드를 6장 뽑아요.", count: 6 }
    ];

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let currentCondition = null;

    function calculateTotal() {
        let total = 0;
        mathFields.forEach((field, index) => {
            if (index % 4 === 3) {
                const value = parseInt(field.value) || 0;
                total += value;
            }
        });
        resultInput.value = total;
    }

    mathFields.forEach((field, index) => {
        field.addEventListener('input', () => {
            btnReset.classList.add('active');
            if (index % 4 === 3) {
                calculateTotal();
            }
        });
    });

    resultInput.addEventListener('input', () => {
        btnReset.classList.add('active');
    });
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function setConditionText(condition) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.padding = '20px';
        wrapper.style.boxSizing = 'border-box';

        const mainTextContainer = document.createElement('div');
        mainTextContainer.style.flex = '1';
        mainTextContainer.style.display = 'flex';
        mainTextContainer.style.alignItems = 'center';
        mainTextContainer.style.justifyContent = 'center';
        mainTextContainer.style.width = '100%';
        mainTextContainer.style.marginTop = '-30px';

        const mainText = document.createElement('div');
        mainText.style.color = 'black';
        mainText.style.fontSize = '40px';
        mainText.style.textAlign = 'center';
        mainText.textContent = condition.text;

        const subText = document.createElement('div');
        subText.style.color = 'black';
        subText.style.fontSize = '20px';
        subText.style.position = 'absolute';
        subText.style.right = '50px';
        subText.style.bottom = '45px';
        subText.textContent = condition.subText;

        const existingText = cardCondition.querySelector('div');
        if (existingText) {
            existingText.remove();
        }
        
        mainTextContainer.appendChild(mainText);
        wrapper.appendChild(mainTextContainer);
        wrapper.appendChild(subText);
        cardCondition.appendChild(wrapper);
    }

    function setNumberText(card, number) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';

        const numberContainer = document.createElement('div');
        numberContainer.style.height = '60px';
        numberContainer.style.display = 'flex';
        numberContainer.style.alignItems = 'center';
        numberContainer.style.justifyContent = 'center';
        numberContainer.style.marginTop = '30px';

        const numberDiv = document.createElement('div');
        numberDiv.style.color = 'black';
        numberDiv.style.fontSize = '42px';
        numberDiv.style.fontWeight = 'bold';
        numberDiv.textContent = number;

        numberContainer.appendChild(numberDiv);
        wrapper.appendChild(numberContainer);

        if (number === 6 || number === 9) {
            const koreanDiv = document.createElement('div');
            koreanDiv.style.color = 'black';
            koreanDiv.style.fontSize = '20px';
            koreanDiv.style.marginTop = '-5px';
            koreanDiv.textContent = number === 6 ? '(육)' : '(구)';
            wrapper.appendChild(koreanDiv);
        }
        
        const existingText = card.querySelector('div');
        if (existingText) {
            existingText.remove();
        }
        
        card.appendChild(wrapper);
    }

    function showNewCondition() {
        currentCondition = conditions[Math.floor(Math.random() * conditions.length)];
        setConditionText(currentCondition);
        
        const shuffledNumbers = shuffleArray([...numbers]);
        
        cardOpens.forEach(card => {
            card.style.backgroundImage = 'url(../../common_contents/img/EMA522_SU/0003_img_card_back.png)';
            const textDiv = card.querySelector('div');
            if (textDiv) textDiv.remove();
        });
        
        for(let i = 0; i < currentCondition.count; i++) {
            const card = cardOpens[i];
            card.style.backgroundImage = 'url(../../common_contents/img/EMA522_SU/0003_img_card_back_white.png)';
            setNumberText(card, shuffledNumbers[i]);
        }
        
        mathFields.forEach(field => {
            field.removeAttribute('disabled');
        });
        resultInput.removeAttribute('disabled');
        
        setTimeout(() => {
            btnReset.classList.add('active');
        }, 0);
    }
    
    cardDummyBtn.addEventListener('click', () => {
        cardCondition.style.backgroundImage = 'url(../../common_contents/img/EMA522_SU/0003_img_card_condition_back_white.png)';
        showNewCondition();
    });

    btnReset.addEventListener('click', () => {
        location.reload();
    });
});