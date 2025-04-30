runAfterAppReady(() => {
  let pos = [];
  $('.draws-input-wrap').on('click', function (e) {
    let scale = getScale();

    $('.btn_area button').addClass('active');
    audioManager.playSound('click');

    let $wrap = $(this);
    let x = e.pageX - $wrap.offset().left;
    let gap = parseFloat($wrap.attr('data-gap'));
    if (pos.length === 2) return;
    if (typeof pos[0] === 'undefined') {
      pos[0] = Math.floor(x / scale / gap) * gap;

      $wrap.children('.input-wrap').css('left', `${pos[0] + 25}px`);
      $('.dw1').addClass('on');
    } else {
      pos[1] = Math.floor(x / scale / gap) * gap;
      pos.sort((a, b) => a - b);
      console.log(pos);
      $wrap.children('.input-wrap').css('left', `${pos[0] + 25}px`);
      $wrap.children('.input-wrap').css('width', `${pos[1] - pos[0]}px`);
      $('.dw2').addClass('on');
    }
  });

  $('.dropdown_wrap, .dropdown_wrap *').on('click', function (e) {
    e.stopPropagation();
  });

  $('.custom_dropdown').on('change', function () {
    const selectedVal = $(this).val(); // 선택된 값
    const $wrap = $(this).closest('.dropdown_wrap'); // 부모 래퍼 찾기

    // 기존 숫자 클래스 제거 (1~9에 한정하거나 상황에 맞게 조정 가능)
    $wrap.removeClass(function (index, className) {
      return (className.match(/(^|\s)val-\d+/g) || []).join(' ');
    });

    if (selectedVal) {
      $wrap.addClass(`val-${selectedVal}`);
    }
  });

  // 커스텀 정답 조건
  window.customCheckCondition = function (el) {
    let ans1 = parseFloat($('.input-wrap').css('left')) === 112;
    let ans2 = $('.input-wrap').width() === 348;
    let ans3 = $('.dw1').hasClass('val-1');
    let ans4 = $('.dw2').hasClass('val-2');

    if (ans1 && ans2 && ans3 && ans4) {
      return true; //true 반환하면 정답 처리 됩니다.
    } else {
      return false;
    }
  };
  window.onCorrectCustom = function () {
    document.body.classList.add('success');
    document.body.classList.add('result');
  };
  // 두 번째 오답 시
  window.onIncorrectTwiceCustom = function () {
    $('.input-wrap').css('left', 87 + 25);
    $('.input-wrap').css('width', 348);
    $('.dropdown_wrap').addClass('on');
    $('.dw1').addClass('val-1');
    $('.dw2').addClass('val-2');
  };

  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function () {
    $('.input-wrap').css('width', 0);
    $('.dropdown_wrap').removeClass('on val-1 val-2');
    pos = [];
  };
});
