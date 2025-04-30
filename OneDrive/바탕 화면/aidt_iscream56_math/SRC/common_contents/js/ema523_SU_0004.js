document.addEventListener("DOMContentLoaded", () => {
    const btnOpenCard = document.querySelector('#btn_open_card');
    const getCardContent = document.querySelector('.card_content_1');
    const playerAreas = document.querySelectorAll('.player_area');
    const btnReset = document.querySelector('.btnReset');
    let usedCards = [];
    let droppedCards = [];

    btnReset.classList.remove('active');

    function getRandomCard() {
        if (usedCards.length === 12) {
            usedCards = [];
        }

        let randomNum;
        do {
            randomNum = Math.floor(Math.random() * 12) + 1;
        } while (usedCards.includes(randomNum));

        usedCards.push(randomNum);
        return randomNum.toString().padStart(2, '0');
    }

    function generateInitialCards() {
        const normalCards = Array.from({length: 12}, (_, i) => ({
            name: `card_${(i + 1).toString().padStart(2, '0')}`,
            ext: 'svg'
        }));
        const specialCards = Array.from({length: 3}, (_, i) => ({
            name: `card_sp_${(i + 1).toString().padStart(2, '0')}`,
            ext: 'png'
        }));
        
        const allCards = [...normalCards, ...specialCards];
        const shuffledCards = [...allCards].sort(() => Math.random() - 0.5);
        
        return {
            player1: shuffledCards.slice(0, 5),
            player2: shuffledCards.slice(5, 10),
            player3: shuffledCards.slice(10, 15)
        };
    }

    function updateDroppedCardDisplay() {
        if (droppedCards.length > 0) {
            const topCard = droppedCards[droppedCards.length - 1];
            getCardContent.style.backgroundImage = `url(../../common_contents/img/EMA523_SU/${topCard.name}.${topCard.ext})`;
            getCardContent.style.backgroundRepeat = 'no-repeat';
            getCardContent.style.backgroundPosition = 'center center';
        } else {
            getCardContent.style.backgroundImage = '';
        }
    }

    function checkForWinner(playerCards) {
        if (playerCards.length === 0) {
            toastCheckMsg('이겼습니다!', 1);
        }
    }

    btnOpenCard.addEventListener('click', () => {
        const cardNumber = getRandomCard();
        const newCard = {
            name: `card_${cardNumber}`,
            ext: 'svg'
        };
        droppedCards.push(newCard);
        updateDroppedCardDisplay();
        setTimeout(() => {
            btnReset.classList.add('active');
        }, 0);
    });

    const initialCards = generateInitialCards();

    playerAreas.forEach((playerArea, playerIndex) => {
        const cardWrap = playerArea.querySelector('.card_wrap');
        const cardNavigation = playerArea.querySelector('.card_navigation');
        const prevBtn = playerArea.querySelector('.btn_card_move_prev');
        const nextBtn = playerArea.querySelector('.btn_card_move_next');
        const pickBtn = playerArea.querySelector('.btn_pick');
        const dropBtn = playerArea.querySelector('.btn_drop');
        let currentIndex = 0;

        let playerCards = playerIndex === 0 ? [...initialCards.player1] :
                         playerIndex === 1 ? [...initialCards.player2] :
                         [...initialCards.player3];

        function createCardElement() {
            const article = document.createElement('article');
            article.className = 'card';
            const div = document.createElement('div');
            div.className = 'card_content';
            article.appendChild(div);
            return article;
        }

        function createNavButton() {
            const button = document.createElement('button');
            button.className = 'btn btn_navigation';
            return button;
        }

        function updateCardElements() {
            while (cardWrap.firstChild) {
                cardWrap.removeChild(cardWrap.firstChild);
            }
            while (cardNavigation.firstChild) {
                cardNavigation.removeChild(cardNavigation.firstChild);
            }

            if (playerCards.length === 0) {
                const cardElement = createCardElement();
                cardElement.classList.add('on');
                cardWrap.appendChild(cardElement);
                return;
            }

            for (let i = 0; i < playerCards.length; i++) {
                const cardElement = createCardElement();
                const content = cardElement.querySelector('.card_content');
                const cardData = playerCards[i];
                content.style.backgroundImage = `url(../../common_contents/img/EMA523_SU/${cardData.name}.${cardData.ext})`;
                content.style.backgroundRepeat = 'no-repeat';
                content.style.backgroundPosition = 'center center';

                if (i === currentIndex) {
                    cardElement.classList.add('on');
                }
                cardWrap.appendChild(cardElement);

                const navBtn = createNavButton();
                if (i === currentIndex) {
                    navBtn.classList.add('on');
                }
                cardNavigation.appendChild(navBtn);

                navBtn.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlide();
                    setTimeout(() => {
                        btnReset.classList.add('active');
                    }, 0);
                });
            }
        }

        updateCardElements();

        pickBtn.addEventListener('click', () => {
            const cardNumber = getRandomCard();
            const newCard = {
                name: `card_${cardNumber}`,
                ext: 'svg'
            };
            playerCards.unshift(newCard);
            currentIndex = 0;
            updateCardElements();
            setTimeout(() => {
                btnReset.classList.add('active');
            }, 0);
        });

        dropBtn.addEventListener('click', () => {
            if (playerCards.length > 0) {
                const droppedCard = playerCards[currentIndex];
                droppedCards.push(droppedCard);
                playerCards.splice(currentIndex, 1);
                if (currentIndex >= playerCards.length) {
                    currentIndex = Math.max(0, playerCards.length - 1);
                }
                updateCardElements();
                updateDroppedCardDisplay();
                checkForWinner(playerCards);
                setTimeout(() => {
                    btnReset.classList.add('active');
                }, 0);
            }
        });

        function updateSlide() {
            const cards = cardWrap.querySelectorAll('.card');
            const navBtns = cardNavigation.querySelectorAll('.btn_navigation');

            cards.forEach(card => card.classList.remove('on'));
            navBtns.forEach(btn => btn.classList.remove('on'));

            if (playerCards.length > 0) {
                cards[currentIndex].classList.add('on');
                navBtns[currentIndex].classList.add('on');
            }
        }

        prevBtn.addEventListener('click', () => {
            if (playerCards.length > 0) {
                currentIndex = (currentIndex - 1 + playerCards.length) % playerCards.length;
                updateSlide();
                setTimeout(() => {
                    btnReset.classList.add('active');
                }, 0);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (playerCards.length > 0) {
                currentIndex = (currentIndex + 1) % playerCards.length;
                updateSlide();
                setTimeout(() => {
                    btnReset.classList.add('active');
                }, 0);
            }
        });
    });

    btnReset.addEventListener('click', () => {
        location.reload();
    });
});
