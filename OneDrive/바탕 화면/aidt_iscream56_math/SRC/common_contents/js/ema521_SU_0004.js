document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    const questions = [
        {id: 1, question: '345를 올림하여 십의 자리까지 나타내기', answer: 350},
        {id: 2, question: '672를 버림하여 십의 자리까지 나타내기', answer: 670},
        {id: 3, question: '784를 반올림하여 백의 자리까지 나타내기', answer: 800},
        {id: 4, question: '596을 올림하여 십의 자리까지 나타내기​', answer: 600},
        {id: 5, question: '432를 버림하여 백의 자리까지 나타내기', answer: 400},
        {id: 6, question: '189를 반올림하여 십의 자리까지 나타내기​', answer: 190},
        {id: 7, question: '243을 올림하여 십의 자리까지 나타내기', answer: 250},
        {id: 8, question: '892를 버림하여 십의 자리까지 나타내기​', answer: 890},
        {id: 9, question: '567을 반올림하여 백의 자리까지 나타내기', answer: 600},
        {id: 10, question: '734를 올림하여 백의 자리까지 나타내기', answer: 800},
        {id: 11, question: '365를 버림하여 십의 자리까지 나타내기', answer: 360},
        {id: 12, question: '842를 반올림하여 백의 자리까지 나타내기', answer: 800},
        {id: 13, question: '491을 올림하여 십의 자리까지 나타내기', answer: 500},
        {id: 14, question: '678을 반올림하여 백의 자리까지 나타내기', answer: 700},
        {id: 15, question: '254를 버림하여 십의 자리까지 나타내기', answer: 250},
        {id: 16, question: '803을 올림하여 십의 자리까지 나타내기', answer: 810},
        {id: 17, question: '913을 버림하여 십의 자리까지 나타내기', answer: 910},
        {id: 18, question: '732를 반올림하여 백의 자리까지 나타내기', answer: 700},
        {id: 19, question: '645를 올림하여 십의 자리까지 나타내기', answer: 650},
        {id: 20, question: '921을 반올림하여 백의 자리까지 나타내기​ ', answer: 900}
    ];

    const shuffledQuestions = [];

    const form = document.getElementById('form');
    const btnStart = document.getElementById('btn_start');
    const board = document.getElementById('board');
    const answerInput = document.getElementById('answer_input');
    const btnResetInput = document.getElementById('btn_reset_input');
    const btnCheckInput = document.getElementById('btn_check_input');
    const btnResetForm = document.getElementById('btn_reset_form');
    const btnSubmitForm = document.getElementById('btn_submit_form');
    const resultInputs = document.getElementsByClassName('result_input');
    
    function enableBtnInput() {
        if (btnResetInput && !btnResetInput.classList.contains('active')) {
            btnResetInput.classList.add('active');
        }
    
        if (btnCheckInput && !btnCheckInput.classList.contains('active')) {
            btnCheckInput.classList.add('active');
        }
    }

    function disableBtnInput() {
        if (btnResetInput && btnResetInput.classList.contains('active')) {
            btnResetInput.classList.remove('active');
        }
    
        if (btnCheckInput && btnCheckInput.classList.contains('active')) {
            btnCheckInput.classList.remove('active');
        }
    }

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
    
    function resetInput() {
        if (answerInput && answerInput.setValue) {
            answerInput.setValue('', { suppressChangeNotifications: false });
        }
    }

    function resetResultForm() {
        if (resultInputs && 0 < resultInputs.length) {
            for (let i = 0; i < resultInputs.length; i++) {
                const resultInput = resultInputs[i];
                resultInput.value = '';
                resultInput.setAttribute('value', '');
            }
        }
    }

    function shuffleQuestion() {
        const array = [];
        array.push(...questions);
        shuffledQuestions.length = 0;
        shuffledQuestions.push(...array.sort(() => Math.random() - 0.5));
    }

    function setCurrentQuestion() {
        if (board && shuffledQuestions[currentIndex]) {
            board.innerText = shuffledQuestions[currentIndex].question ?? '';
        }
    }

    function moveNextQuestion() {
        if (currentIndex < questions.length) {
            currentIndex++;
            if (currentIndex <= questions.length) {
                setCurrentQuestion();
            }
        }
    }

    function checkCurrentAnswer() {
        const currentResultInput = resultInputs[currentIndex];
        if (!currentResultInput) {
            return;
        }
        const answer = shuffledQuestions[currentIndex] && shuffledQuestions[currentIndex].answer ? shuffledQuestions[currentIndex].answer : 0;
        const myAnswer = eval(answerInput.getValue('plain-text')) ?? '';
        if (answer == myAnswer) {
            currentResultInput.value = '1';
            currentResultInput.setAttribute('value', '1');
        } else {
            currentResultInput.value = '0';
            currentResultInput.setAttribute('value', '0');
        }
        currentResultInput.dispatchEvent(new Event("change"));
        resetInput();
        moveNextQuestion();
    }

    function resetGame() {
        resetInput();
        disableBtnInput();
        disableBtnForm();
        resetResultForm();
        shuffledQuestions.length = 0;
        currentIndex = 0;
        if (board) {
            board.innerText = '';
        }
        if (btnStart && btnStart.classList.contains('hide')) {
            btnStart.classList.remove('hide');
        }
    }

    function startGame() {
        resetGame();
        shuffleQuestion();
        currentIndex = 0;
        setCurrentQuestion();
    }

    if (answerInput) {
        answerInput.addEventListener('input', function (e) {
            this.value = e.target.value;
            if (e.target.getValue('plain-text')) {
                enableBtnInput();
            } else {
                disableBtnInput();
            }
        });
    }

    if (btnResetInput) {
        btnResetInput.addEventListener('click', function () {
            resetInput();
        });
    }

    if (btnCheckInput) {
        btnCheckInput.addEventListener('click', function () {
            checkCurrentAnswer();
        });
    }

    if (resultInputs && 0 < resultInputs.length) {
        for (let i = 0; i < resultInputs.length; i++) {
            const resultInput = resultInputs[i];
            resultInput.addEventListener('change', function (e) {
                if (e.target.value) {
                    enableBtnForm();
                } else {
                    const checkedInputs = Array.from(resultInputs).filter(input => input.value === '0' || input.value === '1');
                    if (1 > checkedInputs.length) {
                        disableBtnForm();
                        resetResultForm();
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
            const checkedInputs = Array.from(resultInputs).filter(input => input.value === '0' || input.value === '1');
            if (0 == checkedInputs.length) {
                toastCheckMsg("문제를 풀어보세요!", 2, false);
            } else if (20 > checkedInputs.length) {
                toastCheckMsg("아직 풀지 못한 문제가 있어요.<br/>문제를 풀어보세요!", 2, false);
            } else {
                this.submit();
            }
        });
    }

    if (btnStart) {
        btnStart.addEventListener('click', function (e) {
            startGame();
            this.classList.add('hide');
        });
    }
});