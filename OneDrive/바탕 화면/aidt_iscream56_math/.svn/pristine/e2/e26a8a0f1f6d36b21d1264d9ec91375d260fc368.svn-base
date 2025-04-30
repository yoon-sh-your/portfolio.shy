document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.boolean_wrap').forEach(function (wrapper) {
        wrapper.querySelectorAll('button').forEach(function (button) {
            button.addEventListener('click', function () {
                let clickButton = this;

                wrapper.querySelectorAll('button').forEach(function (btn) {
                    if (btn.classList.contains('selected') && btn !== clickButton) {
                        btn.click();
                    }
                });

                setTimeout(function () {
                    const selectedBtn = wrapper.querySelector('button.selected');
                    const isCorrect = selectedBtn && selectedBtn.dataset.answerSingle === 'true';

                    wrapper.querySelectorAll('button').forEach(function (btn) {
                        btn.dataset.correction = isCorrect ? 'true' : 'false';
                    });
                }, 0);
            });
        });
    });
});

function addResult () {
    let booleanWraps = document.querySelectorAll('.boolean_wrap');

    booleanWraps.forEach(function(booleanWrap) {
        booleanWrap.classList.add('result');
    });
}

function removeResult () {
    let booleanWraps = document.querySelectorAll('.boolean_wrap');

    booleanWraps.forEach(function(booleanWrap) {
        booleanWrap.classList.remove('result');
    });
}

// 정답일 때
function onCorrectCustom () {
    addResult();
}

// 리셋일 떄
function resetCustom () {
    removeResult();
}

// 첫번째 틀렸을 때
function onIncorrectCustom() {
    removeResult();
}

// 두번째 틀렸을 때
function onIncorrectTwiceCustom () {
    addResult();
    // hint 숨기기 추가
    document.querySelectorAll('.hint').forEach(function(hint) {
        hint.style.display = 'none';
    });
}

// 빈칸일 때
function onEmptyCustom () {
    removeResult();
}


