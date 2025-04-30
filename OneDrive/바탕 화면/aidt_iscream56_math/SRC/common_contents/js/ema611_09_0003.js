function addResult () {
    let imgBox = document.querySelector('.input_area .img_box');
    imgBox.classList.add('on');
}

function removeResult () {
    let imgBox = document.querySelector('.input_area .img_box');
    imgBox.classList.remove('on');
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
}

// 빈칸일 때
function onEmptyCustom () {
    removeResult();
}

