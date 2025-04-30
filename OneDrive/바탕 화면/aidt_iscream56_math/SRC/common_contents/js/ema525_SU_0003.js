document.addEventListener("DOMContentLoaded", () => {
    let gameCount = 0;
    const cardDatas = [
        { card: 1, type: 1 },
        { card: 1, type: 2 },
        { card: 1, type: 3 },
        { card: 2, type: 1 },
        { card: 2, type: 2 },
        { card: 2, type: 3 },
        { card: 3, type: 1 },
        { card: 3, type: 2 },
        { card: 3, type: 3 },
        { card: 4, type: 1 },
        { card: 4, type: 2 },
        { card: 4, type: 3 }
    ];

    const shuffledCards = [];

    const form = document.getElementById('form');
    const cards = document.getElementsByClassName('card');
    const btnCompletes = document.getElementsByClassName('btnComplete');
    const btnShuffleNext = document.getElementById('btnShuffleNext');
    const btnShuffleMore = document.getElementById('btnShuffleMore');
    const completeCountInputs = document.getElementsByClassName('complete_count');
    const btnResetForm = document.getElementById('btn_reset_form');
    const btnSubmitForm = document.getElementById('btn_submit_form');

    function enableBtnForm() {
        if (btnResetForm && !btnResetForm.classList.contains('active')) {
            btnResetForm.classList.add('active');
        }
    
        if (btnSubmitForm && !btnSubmitForm.classList.contains('active')) {
            btnSubmitForm.classList.add('active');
        }
    }
    
    function disableBtnForm() {
        if (btnResetForm && btnResetForm.classList.contains('active')) {
            btnResetForm.classList.remove('active');
        }
    
        if (btnSubmitForm && btnSubmitForm.classList.contains('active')) {
            btnSubmitForm.classList.remove('active');
        }
    }

    function setCurrentCards() {
        if (cards && shuffledCards && cards.length == shuffledCards.length) {
            for (let i = 0; i < shuffledCards.length; i++) {
                const shuffledCard = shuffledCards[i];
                const card = cards[i];
                if (shuffledCard && card) {
                    card.dataset.card = shuffledCard.card;
                    card.dataset.type = shuffledCard.type;
                }
            }
        }
    }

    function shuffleCard() {
        if (10 <= gameCount) {
            resetGame();
            return;
        }
        gameCount++;
        const array = [];
        array.push(...cardDatas);
        shuffledCards.length = 0;
        shuffledCards.push(...array.sort(() => Math.random() - 0.5));
        setCurrentCards();
        if ('undefined' !== typeof toastCheckMsg) {
            toastCheckMsg(`${(gameCount > 1 ? `${gameCount}번째 ` : '')}게임 시작!`, 0, false);
        }
    }

    function nextCard() {
        const player1CardIdx = Math.floor(Math.random() * 3);
        const player2CardIdx = Math.floor(Math.random() * 3) + 3;
        const player3CardIdx = Math.floor(Math.random() * 3) + 6;
        const player4CardIdx = Math.floor(Math.random() * 3) + 9;
        if (shuffledCards.length > 0 && shuffledCards[player1CardIdx] && shuffledCards[player2CardIdx] && shuffledCards[player3CardIdx] && shuffledCards[player4CardIdx]) {
            //shuffledCards.unshift(shuffledCards.pop());
            const player1Card = shuffledCards[player1CardIdx];
            const player2Card = shuffledCards[player2CardIdx];
            const player3Card = shuffledCards[player3CardIdx];
            const player4Card = shuffledCards[player4CardIdx];
            shuffledCards[player1CardIdx] = player4Card;
            shuffledCards[player2CardIdx] = player1Card;
            shuffledCards[player3CardIdx] = player2Card;
            shuffledCards[player4CardIdx] = player3Card;
        }
        setCurrentCards();
    }

    function resetCompleteCount() {
        if (completeCountInputs && 0 < completeCountInputs.length) {
            for (let i = 0; i < completeCountInputs.length; i++) {
                const completeCountInput = completeCountInputs[i];
                completeCountInput.value = 0;
                completeCountInput.setAttribute('value', 0);
            }
        }
    }

    function resetGame() {
        gameCount = 0;
        shuffleCard();
        resetCompleteCount();
        disableBtnForm();
    }

    function checkCount(index) {
        let result = false;
        switch (index) {
            case 0:
                result = 
                shuffledCards[0] && shuffledCards[0].card && shuffledCards[0].type &&
                shuffledCards[1] && shuffledCards[1].card && shuffledCards[1].type &&
                shuffledCards[2] && shuffledCards[2].card && shuffledCards[2].type &&
                shuffledCards[0].card == shuffledCards[1].card && shuffledCards[1].card == shuffledCards[2].card;
                break;

            case 1:
                result = 
                shuffledCards[3] && shuffledCards[3].card && shuffledCards[3].type &&
                shuffledCards[4] && shuffledCards[4].card && shuffledCards[4].type &&
                shuffledCards[5] && shuffledCards[5].card && shuffledCards[5].type &&
                shuffledCards[3].card == shuffledCards[4].card && shuffledCards[4].card == shuffledCards[5].card;
                break;

            case 2:
                result = 
                shuffledCards[6] && shuffledCards[6].card && shuffledCards[6].type &&
                shuffledCards[7] && shuffledCards[7].card && shuffledCards[7].type &&
                shuffledCards[8] && shuffledCards[8].card && shuffledCards[8].type &&
                shuffledCards[6].card == shuffledCards[7].card && shuffledCards[7].card == shuffledCards[8].card;
                break;

            case 3:
                result = 
                shuffledCards[9] && shuffledCards[9].card && shuffledCards[9].type &&
                shuffledCards[10] && shuffledCards[10].card && shuffledCards[10].type &&
                shuffledCards[11] && shuffledCards[11].card && shuffledCards[11].type &&
                shuffledCards[9].card == shuffledCards[10].card && shuffledCards[10].card == shuffledCards[11].card;
                break;
        }

        if (result) {
            const completeCountInput = completeCountInputs[index];
            if (completeCountInput) {
                const currentValue = parseInt(completeCountInput.value);
                const resultValue = isNaN(currentValue) ? 1 : currentValue + 1;
                completeCountInput.value = resultValue;
                completeCountInput.setAttribute('value', resultValue);
                completeCountInput.dispatchEvent(new Event("change"));
            }
            shuffleCard();
            toastCheckMsg("같은 도형입니다!", 4, false);
        } else {
            toastCheckMsg("같은 도형이 아닙니다!", 2, false);
        }
    }

    if (btnShuffleNext) {
        btnShuffleNext.addEventListener('click', function () {
            nextCard();
        });
    }

    if (btnShuffleMore) {
        btnShuffleMore.addEventListener('click', function () {
            shuffleCard();
        });
    }

    if (btnCompletes && 0 < btnCompletes.length) {
        for (let i = 0; i < btnCompletes.length; i++) {
            const btnComplete = btnCompletes[i];
            btnComplete.addEventListener('click', function () {
                checkCount(i);
            });
        }
    }

    if (completeCountInputs && 0 < completeCountInputs.length) {
        for (let i = 0; i < completeCountInputs.length; i++) {
            const completeCountInput = completeCountInputs[i];
            completeCountInput.addEventListener('change', function (e) {
                if (e.target.value) {
                    enableBtnForm();
                } else {
                    const emptyInputs = Array.from(completeCountInputs).filter(input => input.value == '0');
                    if (3 < emptyInputs.length) {
                        disableBtnForm();
                        resetCompleteCount();
                    }
                }
            });
        }
    }

    if (btnResetForm) {
        btnResetForm.addEventListener('click', function () {
            resetGame();
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const emptyInputs = Array.from(completeCountInputs).filter(input => input.value == '0');
            if (3 < emptyInputs.length) {
                toastCheckMsg("문제를 풀어보세요!", 2, false);
            } else {
                this.submit();
            }
        });
    }

    resetGame();
});