function addFinish() {
  // 모든 .boolean_count_wrap 요소를 선택
  const booleanCountWraps = document.querySelectorAll('.boolean_count_wrap');

  booleanCountWraps.forEach(booleanCountWrap => {
    const buttons = booleanCountWrap.querySelectorAll('button');
    const targetElement = document.querySelector('.contents');

    // MutationObserver 설정
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-prev-selected') {
          console.log('data-prev-selected 값 변경됨:', booleanCountWrap.dataset.prevSelected);

          const prevSelected = JSON.parse(booleanCountWrap.dataset.prevSelected);

          prevSelected.forEach(index => {
            buttons[index].classList.add('on');
          });
        }
      });
    });

    const config = {
      attributes: true,
      attributeFilter: ['data-prev-selected']
    };

    observer.observe(booleanCountWrap, config);

    // data-correction이 "true"일 경우, selected 클래스가 있는 버튼에 'on' 클래스 추가
    if (booleanCountWrap.dataset.correction === "true") {
      buttons.forEach(button => {
        if (button.classList.contains('selected')) {
          button.classList.add('on');
        }
      });
    }

    // .contents이 존재할 경우 booleanCountWrap에 'finish' 클래스 추가
    if (targetElement) {
      booleanCountWrap.classList.add('finish');
    }
  });
}


function removeFinish() {
  // 모든 .boolean_count_wrap 요소를 선택
  const booleanCountWraps = document.querySelectorAll('.boolean_count_wrap');

  booleanCountWraps.forEach(booleanCountWrap => {
    const buttons = booleanCountWrap.querySelectorAll('button');
    const targetElement = document.querySelector('.contents');

    // .contents 요소가 존재하면 'finish' 클래스 제거
    if (targetElement) {
      booleanCountWrap.classList.remove('finish');
    }

    // 모든 버튼의 클래스를 제거
    buttons.forEach(button => {
      button.classList.remove('on');
      button.classList.remove('selected');
      button.classList.remove('finish');
    });
  });
}

// 정답일 때
function onCorrectCustom () {
  document.addEventListener("change", addFinish);
  addFinish();
}

// 두번째 틀렸을 때
function onIncorrectTwiceCustom() {
  document.addEventListener("change", addFinish);
  addFinish();
}

// 리셋일 때
function resetCustom () {
  removeFinish();
}

runAfterAppReady(() => {
  $(".btnSubmit").click(function () {
    $(".text_hint").css("opacity", '1');
    $(".answer_img").css("display", 'block');

  });

  $(".btnReset").click(function () {
    $(".text_hint").css("opacity", '0');
    $(".answer_img").css("display", 'none');
  });
  
});
